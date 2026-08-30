(() => {
	const shell = document.querySelector("[data-ai-chat]:not([data-ai-initialized])");
	if (!shell) return;
	shell.setAttribute("data-ai-initialized", "");

	const models = {
		copilot: ["gpt-5-mini"],
		openai: ["gpt-5-mini", "gpt-4.1", "gpt-5"],
		gemini: ["gemini-1.5-flash", "gemini-1.5-pro"]
	};
	const messages = shell.querySelector(".ai-messages");
	const emptyView = messages.querySelector(".ai-empty").cloneNode(true);
	const form = shell.querySelector(".ai-composer");
	const prompt = shell.querySelector(".ai-prompt");
	const send = shell.querySelector(".ai-send");
	const provider = shell.querySelector(".ai-provider");
	const model = shell.querySelector(".ai-model");
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

	const updateModels = () => {
		model.replaceChildren(
			...models[provider.value].map((name) => {
				const option = document.createElement("option");
				option.value = option.textContent = name;
				return option;
			})
		);
	};

	const addMessage = (role, content = "") => {
		shell.querySelector(".ai-empty")?.remove();
		const element = document.createElement("article");
		element.className = `ai-message ${role}`;
		const body = document.createElement("div");
		body.className = "ai-message-content";
		body.textContent = content;
		element.append(body);
		messages.append(element);
		scrollDown();
		return { element, body };
	};

	const getConversationContext = () =>
		Array.from(messages.querySelectorAll(".ai-message"))
			.map((element) => ({
				role: element.classList.contains("user") ? "user" : "assistant",
				content: element.querySelector(".ai-message-content")?.textContent || ""
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

	const readObjects = async (array, $filter) => {
		const crud = window.CoCreate?.crud;
		if (!crud?.send) throw new Error("CoCreate CRUD is unavailable.");
		const data = await crud.send({
			method: "object.read",
			array,
			object: [],
			$filter
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
			updateModels();
		}
		if (button.dataset.model) model.value = button.dataset.model;
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

		if (data.ai.status === "streaming") {
			stream.content += data.ai.delta || "";
			stream.body.textContent = stream.content;
			scrollDown();
			return;
		}

		stream.element.classList.remove("pending");
		if (data.ai.status === "complete") {
			stream.body.textContent = data.ai.content || stream.content;
			conversationId = data.ai.conversation_id || conversationId;
			activateThread(conversationId);
			setStatus("Connected", "connected");
		} else if (data.ai.status === "error") {
			stream.element.classList.add("error");
			stream.body.textContent = data.ai.message || "AI request failed.";
			setStatus("Request failed", "error");
		}
		streams.delete(data.stream_id);
		setBusy(false);
		prompt.focus();
	};

	const connect = () => {
		socket = window.CoCreate?.socket;
		if (!socket?.send || !socket?.listen) return false;
		socket.listen("ai.chat", onChat);
		setStatus("Connected", "connected");
		return true;
	};

	provider.addEventListener("change", updateModels);
	updateModels();

	form.addEventListener("submit", async (event) => {
		event.preventDefault();
		const text = prompt.value.trim();
		if (!text || send.disabled || !socket) return;

		const streamId = makeId();
		const context = { messages: getConversationContext() };
		addMessage("user", text);
		const assistant = addMessage("assistant");
		assistant.element.classList.add("pending");
		streams.set(streamId, {
			...assistant,
			content: "",
			prompt: text
		});
		prompt.value = "";
		resizePrompt();
		setBusy(true);
		setStatus("Generating…", "connected");

		try {
			await socket.send({
				method: "ai.chat",
				uuid: streamId,
				ai: {
					prompt: text,
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
