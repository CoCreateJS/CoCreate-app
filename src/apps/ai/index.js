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
	const form = shell.querySelector(".ai-composer");
	const prompt = shell.querySelector(".ai-prompt");
	const send = shell.querySelector(".ai-send");
	const provider = shell.querySelector(".ai-provider");
	const model = shell.querySelector(".ai-model");
	const status = shell.querySelector(".ai-status");
	const threadList = shell.querySelector(".ai-thread-list");
	const streams = new Map();
	const threads = new Map();
	let socket;
	let conversationId;

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

	const rememberThread = (id, title) => {
		if (!id || threads.has(id)) return;
		const button = document.createElement("button");
		button.type = "button";
		button.className = "ai-thread active";
		button.textContent = title;
		button.addEventListener("click", () => {
			conversationId = id;
			for (const item of threadList.children) {
				item.classList.toggle("active", item === button);
			}
			prompt.focus();
		});
		for (const item of threadList.children) {
			item.classList.remove("active");
		}
		threadList.prepend(button);
		threads.set(id, button);
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
			rememberThread(conversationId, stream.prompt.slice(0, 42));
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
					model: model.value
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
	prompt.addEventListener("keydown", (event) => {
		if (event.key === "Enter" && !event.shiftKey) {
			event.preventDefault();
			form.requestSubmit();
		}
	});

	shell.querySelector(".ai-new-chat").addEventListener("click", () => {
		conversationId = undefined;
		messages.replaceChildren();
		for (const item of threadList.children) {
			item.classList.remove("active");
		}
		addMessage(
			"assistant",
			"New conversation ready. What would you like to test?"
		);
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
