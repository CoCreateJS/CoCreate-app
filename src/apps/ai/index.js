(() => {
	const shell = document.querySelector("[data-ai-chat]:not([data-ai-initialized])");
	if (!shell) return;
	shell.setAttribute("data-ai-initialized", "");

	const models = {
		copilot: ["gpt-5-mini"],
		openai: [
			"gpt-5.6-terra",
			"gpt-5.6-sol",
			"gpt-5.6-luna",
			"gpt-5.5",
			"gpt-5.5-pro",
			"gpt-5.4",
			"gpt-5.4-pro",
			"gpt-5.4-mini",
			"gpt-5.4-nano",
			"gpt-5.3-codex",
			"gpt-5.2",
			"gpt-5.2-pro",
			"gpt-5.1",
			"gpt-5-pro",
			"gpt-5",
			"gpt-5-mini",
			"gpt-4.1"
		],
		gemini: ["gemini-1.5-flash", "gemini-1.5-pro"]
	};
	const messages = shell.querySelector(".ai-messages");
	const emptyView = messages.querySelector(".ai-empty").cloneNode(true);
	const form = shell.querySelector(".ai-composer");
	const prompt = shell.querySelector(".ai-prompt");
	const send = shell.querySelector(".ai-send");
	const provider = shell.querySelector(".ai-provider");
	const model = shell.querySelector(".ai-model");
	const modelValue = shell.querySelector(".ai-model-value");
	const modelOptions = shell.querySelector(".ai-model-options");
	const status = shell.querySelector(".ai-status");
	const threadList = shell.querySelector(".ai-thread-list");
	const streams = new Map();
	let socket;
	let conversationId;
	let conversationLoadId;

	const makeId = () =>
		crypto.randomUUID?.() ||
		`ai-${Date.now()}-${Math.random().toString(16).slice(2)}`;

	const scrollDown = () => {
		messages.scrollTop = messages.scrollHeight;
	};

	const setStatus = (label, state = "") => {
		status.textContent = label;
		status.className = `ai-status ${state}`;
	};

	const setBusy = (busy) => {
		send.disabled = busy;
		prompt.disabled = busy;
	};

	const resizePrompt = () => {
		prompt.style.height = "auto";
		prompt.style.height = `${Math.min(prompt.scrollHeight, 170)}px`;
	};

	const appendInlineMarkdown = (target, content) => {
		const inline = /`([^`]+)`|\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^\s)]+)\)/g;
		let cursor = 0;
		let match;
		while ((match = inline.exec(content))) {
			if (match.index > cursor) {
				target.append(document.createTextNode(content.slice(cursor, match.index)));
			}
			if (match[1]) {
				const code = document.createElement("code");
				code.textContent = match[1];
				target.append(code);
			} else if (match[2]) {
				const strong = document.createElement("strong");
				strong.textContent = match[2];
				target.append(strong);
			} else {
				const href = match[4];
				if (/^(https?:\/\/|\/)/i.test(href)) {
					const link = document.createElement("a");
					link.href = href;
					link.target = "_blank";
					link.rel = "noopener noreferrer";
					link.textContent = match[3];
					target.append(link);
				} else {
					target.append(document.createTextNode(match[0]));
				}
			}
			cursor = inline.lastIndex;
		}
		if (cursor < content.length) target.append(document.createTextNode(content.slice(cursor)));
	};

	const appendMarkdown = (target, content) => {
		const lines = content.split("\n");
		let list;
		const closeList = () => {
			if (list) target.append(list);
			list = null;
		};

		lines.forEach((line, index) => {
			const heading = line.match(/^(#{1,3})\s+(.+)$/);
			const item = line.match(/^[-*]\s+(.+)$/);
			if (heading) {
				closeList();
				const element = document.createElement(`h${heading[1].length + 1}`);
				appendInlineMarkdown(element, heading[2]);
				target.append(element);
			} else if (item) {
				if (!list) list = document.createElement("ul");
				const element = document.createElement("li");
				appendInlineMarkdown(element, item[1]);
				list.append(element);
			} else {
				closeList();
				appendInlineMarkdown(target, line);
				if (index < lines.length - 1) target.append(document.createElement("br"));
			}
		});
		closeList();
	};

	const createCodeBlock = (language, content) => {
		const block = document.createElement("section");
		block.className = "ai-code-block";
		const header = document.createElement("header");
		const label = document.createElement("span");
		label.textContent = language || "code";
		const copy = document.createElement("button");
		copy.type = "button";
		copy.textContent = "Copy";
		copy.addEventListener("click", async () => {
			await navigator.clipboard?.writeText(content);
			copy.textContent = "Copied";
			setTimeout(() => {
				copy.textContent = "Copy";
			}, 1500);
		});
		const extension = {
			javascript: "js",
			js: "js",
			typescript: "ts",
			ts: "ts",
			html: "html",
			css: "css",
			json: "json",
			bash: "sh",
			shell: "sh",
			python: "py",
			php: "php",
			sql: "sql"
		}[language] || "txt";
		const download = document.createElement("button");
		download.type = "button";
		download.textContent = "Download";
		download.addEventListener("click", () => {
			const url = URL.createObjectURL(new Blob([content], { type: "text/plain" }));
			const link = document.createElement("a");
			link.href = url;
			link.download = `cocreate-ai.${extension}`;
			link.click();
			URL.revokeObjectURL(url);
		});
		const actions = document.createElement("div");
		actions.className = "ai-code-actions";
		actions.append(download, copy);
		header.append(label, actions);

		const pre = document.createElement("pre");
		const code = document.createElement("code");
		if (language) code.className = `language-${language}`;
		if (language === "diff") {
			const lines = content.split("\n");
			lines.forEach((line, index) => {
				const row = document.createElement("span");
				row.className = "ai-diff-line";
				if (line.startsWith("+") && !line.startsWith("+++")) {
					row.classList.add("added");
				} else if (line.startsWith("-") && !line.startsWith("---")) {
					row.classList.add("removed");
				} else if (line.startsWith("@@")) {
					row.classList.add("meta");
				}
				row.textContent = line;
				code.append(row);
				if (index < lines.length - 1) code.append("\n");
			});
		} else {
			code.textContent = content;
		}
		pre.append(code);
		block.append(header, pre);
		return block;
	};

	const createJsonBlock = (content) => {
		try {
			const formatted = JSON.stringify(JSON.parse(content), null, 2);
			const block = createCodeBlock("json", formatted);
			block.classList.add("ai-json-block");
			const header = block.querySelector("header");
			const label = header.querySelector("span");
			label.textContent = "JSON data";
			const pre = block.querySelector("pre");
			const toggle = document.createElement("button");
			toggle.type = "button";
			toggle.textContent = "Collapse";
			toggle.setAttribute("aria-expanded", "true");
			toggle.addEventListener("click", () => {
				const expanded = toggle.getAttribute("aria-expanded") === "true";
				toggle.setAttribute("aria-expanded", String(!expanded));
				toggle.textContent = expanded ? "Expand" : "Collapse";
				pre.hidden = expanded;
			});
			header.querySelector(".ai-code-actions").prepend(toggle);
			return block;
		} catch {
			return createCodeBlock("json", content);
		}
	};

	const renderMessageContent = (body, content = "") => {
		body.dataset.content = content;
		body.replaceChildren();

		const codeFence = /```([^\n`]*)\n([\s\S]*?)```/g;
		let cursor = 0;
		let match;
		while ((match = codeFence.exec(content))) {
			appendMarkdown(body, content.slice(cursor, match.index));
			const language = match[1].trim().toLowerCase();
			body.append(
				language === "json"
					? createJsonBlock(match[2])
					: createCodeBlock(language, match[2])
			);
			cursor = codeFence.lastIndex;
		}

		const trailing = content.slice(cursor);
		const pendingFence = trailing.lastIndexOf("```");
		appendMarkdown(body, pendingFence === -1 ? trailing : trailing.slice(0, pendingFence));
	};

	const getCodeLanguage = (filePath = "") => ({
		js: "javascript",
		mjs: "javascript",
		ts: "typescript",
		html: "html",
		css: "css",
		json: "json",
		sh: "bash",
		bash: "bash",
		py: "python",
		php: "php",
		sql: "sql"
	})[filePath.split(".").pop().toLowerCase()] || "";

	const renderToolResult = (stream, tool) => {
		let results = stream.element.querySelector(".ai-tool-results");
		if (!results) {
			results = document.createElement("div");
			results.className = "ai-tool-results";
			stream.element.append(results);
		}

		let card = results.querySelector(`[data-tool-id="${tool.id}"]`);
		if (!card) {
			card = document.createElement("details");
			card.className = "ai-tool-result";
			card.dataset.toolId = tool.id;
			card.open = tool.status === "error";
			const summary = document.createElement("summary");
			card.append(summary);
			results.append(card);
		}

		const records = Array.isArray(tool.result?.object)
			? tool.result.object.filter((record) => record && typeof record === "object")
			: [];
		if (records.length) card.open = true;
		card.className = `ai-tool-result ${tool.status}`;
		card.querySelector("summary").textContent = records.length
			? `${tool.name} · ${records.length} record${records.length === 1 ? "" : "s"}`
			: `${tool.name} · ${tool.status}`;
		card.querySelector(".ai-tool-records")?.remove();
		card.querySelector(".ai-tool-file")?.remove();
		card.querySelector(".ai-tool-raw")?.remove();
		const fileContent = typeof tool.result?.content === "string"
			? tool.result.content
			: typeof tool.result?.src === "string" ? tool.result.src : undefined;
		if (fileContent !== undefined) {
			card.open = true;
			const file = document.createElement("section");
			file.className = "ai-tool-file";
			const name = document.createElement("strong");
			name.textContent = tool.result.path || tool.result.filePath || tool.result.name || "File";
			file.append(name);
			file.append(createCodeBlock(getCodeLanguage(name.textContent), fileContent));
			card.append(file);
		}
		if (records.length) {
			const preview = document.createElement("div");
			preview.className = "ai-tool-records";
			for (const record of records.slice(0, 8)) {
				const recordCard = document.createElement("article");
				recordCard.className = "ai-tool-record";
				const title = document.createElement("strong");
				title.textContent = record.name || record.title || record.subject || record.email || record._id;
				recordCard.append(title);

				const fields = Object.entries(record)
					.filter(([key, value]) => !["_id", "name", "title", "subject"].includes(key) &&
						["string", "number", "boolean"].includes(typeof value))
					.slice(0, 4);
				for (const [key, value] of fields) {
					const field = document.createElement("span");
					field.textContent = `${key.replaceAll("_", " ")}: ${value}`;
					recordCard.append(field);
				}
				preview.append(recordCard);
			}
			card.append(preview);
		}
		if (tool.status !== "running") {
			const raw = document.createElement("details");
			raw.className = "ai-tool-raw";
			const rawSummary = document.createElement("summary");
			rawSummary.textContent = "Raw response";
			const pre = document.createElement("pre");
			const code = document.createElement("code");
			code.textContent = JSON.stringify(
				tool.status === "error" ? { error: tool.error } : tool.result,
				null,
				2
			);
			pre.append(code);
			raw.append(rawSummary, pre);
			card.append(raw);
		}
	};

	const renderCredentialCard = (stream, credential) => {
		let card = stream.element.querySelector(".ai-credential-card");
		if (card) return card;

		card = document.createElement("form");
		card.className = "ai-credential-card";
		card.addEventListener("submit", (event) => event.preventDefault());
		card.setAttribute("array", credential.array);
		card.setAttribute("object", credential.object);
		const copy = document.createElement("div");
		copy.className = "ai-credential-copy";
		const title = document.createElement("strong");
		const providerName = credential.name.charAt(0).toUpperCase() + credential.name.slice(1);
		title.textContent = `Connect ${providerName}`;
		const description = document.createElement("span");
		description.textContent = `Enter your ${providerName} API key to continue. It saves securely to the integration and is never sent through the chat.`;
		copy.append(title, description);

		const input = document.createElement("input");
		input.type = "password";
		input.name = credential.key;
		input.setAttribute("array", credential.array);
		input.setAttribute("object", credential.object);
		input.setAttribute("key", credential.key);
		input.placeholder = "Paste API key";
		input.autocomplete = "off";
		input.required = true;
		input.setAttribute("aria-label", credential.label);

		const save = document.createElement("button");
		save.type = "button";
		save.setAttribute("actions", "save");
		save.textContent = "Save key";

		card.append(copy, input, save);
		save.addEventListener("saved", () => {
			input.value = "";
			card.remove();
			setStatus("Credential saved", "connected");
			const continueSetup = () => submitPrompt(
				`The ${providerName} API credential was saved successfully. Resume the pending integration setup.`,
				{
					display: false,
					persist: false,
					signal: "credential.saved"
				}
			);
			if (streams.has(stream.streamId)) {
				stream.onComplete = continueSetup;
			} else {
				void continueSetup();
			}
		});
		stream.element.append(card);
		window.CoCreate?.elements?.init?.(input);
		return card;
	};

	const updateModels = () => {
		if (!models[provider.value]) provider.value = "openai";
		if (!models[provider.value].includes(model.value)) {
			model.value = models[provider.value][0];
		}

		modelValue.textContent = `${provider.value} · ${model.value}`;
		modelOptions.replaceChildren(
			...Object.entries(models).flatMap(([providerName, providerModels]) => {
				const label = document.createElement("span");
				label.className = "ai-model-provider";
				label.textContent = providerName;

				const options = providerModels.map((modelName) => {
					const button = document.createElement("button");
					button.type = "button";
					button.className = "ai-model-option";
					button.textContent = modelName;
					button.setAttribute("role", "option");
					button.setAttribute(
						"aria-selected",
						String(providerName === provider.value && modelName === model.value)
					);
					button.addEventListener("click", () => {
						provider.value = providerName;
						model.value = modelName;
						updateModels();
					});
					return button;
				});

				return [label, ...options];
			})
		);
	};

	const addMessage = (role, content = "") => {
		shell.querySelector(".ai-empty")?.remove();
		const element = document.createElement("article");
		element.className = `ai-message ${role}`;
		const body = document.createElement("div");
		body.className = "ai-message-content";
		renderMessageContent(body, content);
		element.append(body);
		messages.append(element);
		scrollDown();
		return { element, body };
	};

	const getConversationContext = () =>
		Array.from(messages.querySelectorAll(".ai-message"))
			.map((element) => ({
				role: element.classList.contains("user") ? "user" : "assistant",
			content: element.querySelector(".ai-message-content")?.dataset.content || ""
			}))
			.filter((message) => message.content)
			.slice(-12);

	const activateThread = (id) => {
		for (const item of threadList.querySelectorAll(".ai-thread")) {
			item.classList.toggle(
				"active",
				item.dataset.conversationId === id
			);
		}
	};

	const readObjects = async (array, filter) => {
		const crud = window.CoCreate?.crud;
		if (!crud?.send) throw new Error("CoCreate CRUD is unavailable.");
		const data = await crud.send({
			method: "object.read",
			array,
			object: [],
			filter
		});
		const objects = data?.object || data?.data || [];
		return Array.isArray(objects) ? objects : [objects];
	};

	const unwrapObject = (object) => {
		const nested = object?.object;
		return Array.isArray(nested) ? nested[0] || object : nested || object;
	};

	const readConversationMessages = async (id, userId) => {
		const createFilter = (nested = false) => {
			const prefix = nested ? "object." : "";
			return {
				query: {
					[`${prefix}conversation_id`]: id,
					...(userId && { [`${prefix}user_id`]: userId })
				},
				sort: [{ key: `${prefix}created.on`, direction: "asc" }],
				limit: 200
			};
		};

		let history = await readObjects("ai-messages", createFilter());
		if (!history.length) {
			history = await readObjects("ai-messages", createFilter(true));
		}

		return history.filter((item) => {
			const message = unwrapObject(item);
			return String(message.conversation_id) === String(id);
		});
	};

	const loadConversation = async (button) => {
		const id = button.dataset.conversationId;
		if (!id) return;
		const loadId = (conversationLoadId = makeId());
		conversationId = id;
		activateThread(id);
		if (button.dataset.provider && models[button.dataset.provider]) {
			provider.value = button.dataset.provider;
		}
		if (button.dataset.model) model.value = button.dataset.model;
		updateModels();
		messages.replaceChildren();
		setStatus("Loading conversation…", "connected");

		try {
			const userId = localStorage.getItem("user_id");
			const history = await readConversationMessages(id, userId);
			if (conversationLoadId !== loadId) return;
			for (const item of history) {
				const message = unwrapObject(item);
				addMessage(message.role || "assistant", message.content || "");
			}
			if (!history.length) {
				addMessage("assistant", "This conversation has no saved messages.");
			}
			setStatus("Connected", "connected");
			prompt.focus();
		} catch (error) {
			if (conversationLoadId !== loadId) return;
			addMessage("assistant", error.message).element.classList.add("error");
			setStatus("History failed", "error");
		}
	};

	const onChat = (data = {}) => {
		const stream = streams.get(data.stream_id);
		if (!stream || !data.ai) return;
		if (data.ai.status === "tool" && data.ai.tool) {
			renderToolResult(stream, data.ai.tool);
			return;
		}
		if (data.ai.status === "credentials" && data.ai.credential) {
			stream.element.classList.remove("pending");
			conversationId = data.ai.conversation_id || conversationId;
			activateThread(conversationId);
			renderCredentialCard(stream, data.ai.credential);
			setStatus("API key required", "error");
			return;
		}

		if (data.ai.status === "streaming") {
			stream.content += data.ai.delta || "";
			if (!stream.renderFrame) {
				stream.renderFrame = requestAnimationFrame(() => {
					renderMessageContent(stream.body, stream.content);
					scrollDown();
					stream.renderFrame = null;
				});
			}
			return;
		}

		stream.element.classList.remove("pending");
		if (stream.renderFrame) cancelAnimationFrame(stream.renderFrame);
		if (data.ai.status === "complete") {
			renderMessageContent(stream.body, data.ai.content || stream.content);
			conversationId = data.ai.conversation_id || conversationId;
			activateThread(conversationId);
			setStatus("Connected", "connected");
		} else if (data.ai.status === "error") {
			stream.element.classList.add("error");
			renderMessageContent(stream.body, data.ai.message || "AI request failed.");
			setStatus("Request failed", "error");
		}
		const onComplete = stream.onComplete;
		streams.delete(data.stream_id);
		setBusy(false);
		if (onComplete) {
			void onComplete();
		} else {
			prompt.focus();
		}
	};

	const connect = () => {
		socket = window.CoCreate?.socket;
		if (!socket?.send || !socket?.listen) return false;
		socket.listen("ai.chat", onChat);
		setStatus("Connected", "connected");
		return true;
	};

	updateModels();

	const submitPrompt = async (
		message,
		{ display = true, persist = true, signal } = {}
	) => {
		const text = message.trim();
		if (!text || send.disabled || !socket) return;

		const streamId = makeId();
		const context = { messages: getConversationContext() };
		if (display) addMessage("user", text);
		const assistant = addMessage("assistant");
		assistant.element.classList.add("pending");
		streams.set(streamId, {
			...assistant,
			streamId,
			content: "",
			prompt: text
		});
		if (display && prompt.value.trim() === text) prompt.value = "";
		resizePrompt();
		setBusy(true);
		setStatus("Generating…", "connected");

		try {
			await socket.send({
				method: "ai.chat",
				uuid: streamId,
				ai: {
					prompt: text,
					persist,
					...(signal && { signal }),
					conversation_id: conversationId,
					provider: provider.value,
					model: model.value,
					context
				}
			});
		} catch (error) {
			onChat({
				stream_id: streamId,
				ai: { status: "error", message: error.message }
			});
		}
	};

	form.addEventListener("submit", (event) => {
		event.preventDefault();
		void submitPrompt(prompt.value);
	});

	prompt.addEventListener("input", resizePrompt);
	threadList.addEventListener("click", (event) => {
		const button = event.target.closest(".ai-thread[data-conversation-id]");
		if (button) loadConversation(button);
	});
	new MutationObserver(() => {
		if (conversationId) activateThread(conversationId);
	}).observe(threadList, { childList: true, subtree: true });
	prompt.addEventListener("keydown", (event) => {
		if (event.key === "Enter" && !event.shiftKey) {
			event.preventDefault();
			form.requestSubmit();
		}
	});

	shell.querySelector(".ai-new-chat").addEventListener("click", () => {
		conversationLoadId = undefined;
		conversationId = undefined;
		messages.replaceChildren(emptyView.cloneNode(true));
		for (const item of threadList.querySelectorAll(".ai-thread")) {
			item.classList.remove("active");
		}
		prompt.focus();
	});

	if (!connect()) {
		let attempts = 0;
		const timer = setInterval(() => {
			if (connect() || ++attempts >= 40) {
				clearInterval(timer);
				if (!socket) {
					setStatus("Socket unavailable", "error");
					send.disabled = true;
				}
			}
		}, 250);
	}
})();
