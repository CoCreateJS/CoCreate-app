(async () => {
    const shell = document.currentScript?.closest(
        "[data-ai-chat]:not([data-ai-initialized]):not([data-ai-initializing])"
    ) || document.querySelector(
        "[data-ai-chat]:not([data-ai-initialized]):not([data-ai-initializing])"
    );
    if (!shell) return;
    shell.setAttribute("data-ai-initializing", "");

    await new Promise((resolve) => {
        const ready = () => shell.querySelector(".ai-composer .ai-prompt") &&
            shell.querySelector(".ai-stream-output .ai-stream-content") &&
            shell.querySelector(".ai-stream-output .ai-credential-card");
        if (ready()) return resolve();
        const observer = new MutationObserver(() => {
            if (!ready()) return;
            observer.disconnect();
            resolve();
        });
        observer.observe(shell, { childList: true, subtree: true });
    });

    const form = shell.querySelector(".ai-composer");
    const prompt = form?.querySelector(".ai-prompt");
    const send = form?.querySelector(".ai-send");
    const socketSend = form?.querySelector(".ai-socket-send");
    const stop = form?.querySelector(".ai-stop");
    const dictate = form?.querySelector(".ai-dictate");
    const model = form?.querySelector(".ai-model");
    const status = form?.querySelector(".ai-status");
    const messages = shell.querySelector(".ai-messages");
    const streamOutput = shell.querySelector(".ai-stream-output");
    const streamContent = streamOutput?.querySelector(".ai-stream-content");
    const streamProgress = streamOutput?.querySelector(".ai-stream-progress");
    const credentialCard = streamOutput?.querySelector(".ai-credential-card");
    const credentialSave = credentialCard?.querySelector('[actions="save"]');
    const steerQueue = shell.querySelector(".ai-message-queue");
    const steerCount = steerQueue?.querySelector(".ai-steer-count");
    const steerItems = steerQueue?.querySelector(".ai-steer-items");
    if (!form || !prompt || !send || !socketSend || !stop ||
        !messages || !streamOutput || !streamContent || !streamProgress ||
        !credentialCard || !credentialSave || !steerQueue || !steerCount || !steerItems) {
        shell.removeAttribute("data-ai-initializing");
        return;
    }
    shell.removeAttribute("data-ai-initializing");
    shell.setAttribute("data-ai-initialized", "");

    const activeStreams = new Map();
    const queuedSteers = new Map();
    const makeId = () => crypto.randomUUID?.() ||
        `ai-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    let socket;
    let listeningSocket;
    let socketRetryTimer;
    let socketRetryDelay = 250;
    let latestMessage;
    let visibleStreamId;
    let visibleStreamConversationId;
    let pendingMessageObserver;
    let pendingCredential;

    const findActiveStream = (conversationId = getConversationId()) =>
        Array.from(activeStreams).find(([, stream]) =>
            stream.conversationId === conversationId)?.[0];

    const setStatus = (label, state = "") => {
        if (!status) return;
        status.textContent = label;
        status.className = `ai-status ${state}`;
    };
    const setBusy = (busy) => {
        send.disabled = false;
        stop.hidden = !busy;
        stop.disabled = false;
        prompt.disabled = false;
    };
    const getConversationId = () => shell.getAttribute("conversation-id") || "";
    const setConversationId = (id) => {
        if (!id || getConversationId() === id) return;
        shell.setAttribute("conversation-id", id);
        const stateAction = document.createElement("button");
        stateAction.type = "button";
        stateAction.hidden = true;
        stateAction.setAttribute("state-to", "aiChat");
        stateAction.setAttribute("state.conversation-id", id);
        document.body.append(stateAction);
        stateAction.click();
        stateAction.remove();
    };
    const getParentId = () => {
        const conversationId = getConversationId();
        if (latestMessage?.conversationId === conversationId) {
            return latestMessage.messageId;
        }
        if (!conversationId ||
            messages?.getAttribute("filter-query-value") !== conversationId) return;
        return Array.from(messages.querySelectorAll(
            ".ai-message[data-message-id]:not([template])"
        )).at(-1)?.dataset.messageId;
    };
    const getSelectedModel = () => model?.selectedOptions?.[0];
    const setSocketField = (key, value) => {
        const field = form.querySelector(`[data-ai-socket-field="${key}"]`);
        if (!field) return;
        if (value === undefined || value === null || value === "") {
            field.removeAttribute("socket-key");
            field.value = "";
            return;
        }
        field.setAttribute("socket-key", key);
        field.value = typeof value === "object" ? JSON.stringify(value) : String(value);
    };

    if (dictate) {
        shell.addEventListener("speechRecognitionStart", (event) => {
            if (event.target !== dictate) return;
            dictate.setAttribute("aria-label", "Stop dictation");
            dictate.setAttribute("title", "Listening… click to stop");
        });
        shell.addEventListener("speechRecognitionEnd", (event) => {
            if (event.target !== dictate) return;
            dictate.setAttribute("aria-label", "Start dictation");
            dictate.setAttribute("title", "Start dictation");
        });
        shell.addEventListener("speechRecognitionError", (event) => {
            if (event.target !== dictate) return;
            const error = event.detail?.event?.error || event.detail?.error?.message;
            dictate.setAttribute("aria-label", "Start dictation");
            dictate.setAttribute("title", error
                ? `Dictation failed ${error}`
                : "Start dictation");
        });
    }

    const updateSteerQueue = () => {
        const conversationId = getConversationId();
        const activeStreamId = findActiveStream(conversationId);
        let count = 0;
        for (const queued of queuedSteers.values()) {
            const visible = queued.conversationId === conversationId;
            queued.element.hidden = !visible;
            queued.button.disabled = queued.pending || !activeStreamId;
            if (visible) count++;
        }
        steerQueue.hidden = count === 0;
        steerCount.textContent = `${count} queued message${
            count === 1 ? "" : "s"
        }`;
    };
    const removeQueuedSteer = (queueId) => {
        queuedSteers.get(queueId)?.element.remove();
        queuedSteers.delete(queueId);
        updateSteerQueue();
    };
    const addQueuedSteer = (queueId, content) => {
        const item = document.createElement("article");
        item.className = "ai-message user ai-steer-item";
        item.dataset.queueId = queueId;
        const label = document.createElement("span");
        label.className = "ai-message-content ai-steer-item-content";
        label.textContent = content;
        const steer = document.createElement("button");
        steer.type = "button";
        steer.className = "ai-steer-now";
        steer.setAttribute("aria-label", "Steer queued message");
        steer.title = "Steer now";
        const icon = document.createElement("i");
        icon.setAttribute("src", "/assets/svg/remix/arrow-go-forward-line.svg");
        icon.setAttribute("aria-hidden", "true");
        steer.append(icon);
        steer.addEventListener("click", () => {
            const streamId = findActiveStream(queuedSteers.get(queueId)?.conversationId);
            if (streamId) void submitSteer(queueId, streamId);
        });
        item.append(label, steer);
        queuedSteers.set(queueId, {
            content,
            element: item,
            button: steer,
            conversationId: getConversationId(),
            pending: false
        });
        steerItems.append(item);
        updateSteerQueue();
    };

    const syncConversationView = () => {
        streamOutput.hidden = !visibleStreamId ||
            visibleStreamConversationId !== getConversationId();
        updateSteerQueue();
    };
    new MutationObserver(syncConversationView).observe(shell, {
        attributes: true,
        attributeFilter: ["conversation-id"]
    });

    const prepareStream = (streamId) => {
        pendingMessageObserver?.disconnect();
        pendingMessageObserver = undefined;
        visibleStreamId = streamId;
        visibleStreamConversationId = getConversationId();
        streamContent.textContent = "";
        streamProgress.textContent = "Working…";
        streamOutput.querySelector(".ai-stream-message")?.classList.add("pending");
        credentialCard.hidden = true;
        for (const receiver of streamOutput.querySelectorAll(
            "[data-ai-stream-status][socket-on]"
        )) {
            receiver.setAttribute("socket-on-matches", JSON.stringify({
                stream_id: streamId,
                "ai.status": receiver.dataset.aiStreamStatus
            }));
        }
        syncConversationView();
    };

    const continueAfterCredentialSave = () => {
        const pending = pendingCredential;
        if (!pending?.saved || activeStreams.size || !socket?.send ||
            pending.conversationId !== getConversationId()) return false;
        pendingCredential = undefined;
        if (pending.initial) {
            // Provider credentials are requested before the server creates the
            // conversation or stores the original user turn. Retry that turn so
            // it becomes the conversation title and persisted user message.
            queueMicrotask(() => void submitPrompt(pending.prompt, {
                provider: pending.provider,
                model: pending.model
            }));
        } else {
            // Tool credentials are requested inside an active turn whose prompt
            // is already stored. Continue through a system signal to avoid a
            // duplicate user message.
            queueMicrotask(() => void submitPrompt(
                `The ${pending.name} API credentials were saved. ` +
                "Continue the pending integration setup.",
                {
                    persist: false,
                    signal: "credential.saved",
                    provider: pending.provider,
                    model: pending.model
                }
            ));
        }
        return true;
    };

    credentialSave.addEventListener("saved", () => {
        const pending = pendingCredential;
        if (!pending) return;
        pending.saved = true;
        credentialCard.querySelectorAll('input[type="password"]').forEach((input) => {
            input.value = "";
        });
        credentialCard.hidden = true;
        setStatus("Credential saved", "connected");
        continueAfterCredentialSave();
    });

    const hideStreamWhenStored = (messageId) => {
        if (!messageId) return;
        const hasStoredMessage = () => Array.from(messages.querySelectorAll(
            ".ai-message[data-message-id]:not([template])"
        )).some((message) => message.dataset.messageId === messageId);
        const hide = () => {
            pendingMessageObserver?.disconnect();
            pendingMessageObserver = undefined;
            visibleStreamId = undefined;
            syncConversationView();
        };
        if (hasStoredMessage()) return hide();
        pendingMessageObserver = new MutationObserver(() => {
            if (hasStoredMessage()) hide();
        });
        pendingMessageObserver.observe(messages, { childList: true, subtree: true });
    };

    const finishStream = (streamId, data) => {
        const stream = activeStreams.get(streamId);
        if (!stream) return;
        activeStreams.delete(streamId);
        setBusy(activeStreams.size > 0);
        if (data.ai.status === "complete" && typeof data.ai.content === "string") {
            streamContent.textContent = data.ai.content;
        }
        if (data.ai.status === "complete" && !pendingCredential) {
            credentialCard.hidden = true;
        }
        if (visibleStreamId === streamId) {
            streamOutput.querySelector(".ai-stream-message")?.classList.remove("pending");
            streamProgress.textContent = data.ai.status === "stopped" ? "Stopped" :
                data.ai.status === "error" ? (data.ai.message || "Request failed") : "";
        }
        if (data.ai.status === "complete") {
            if (data.ai.message_id) {
                latestMessage = {
                    conversationId: data.ai.conversation_id || stream.conversationId,
                    messageId: data.ai.message_id
                };
            }
            if (data.ai.conversation_id &&
                getConversationId() === stream.conversationId) {
                if (visibleStreamId === streamId) {
                    visibleStreamConversationId = data.ai.conversation_id;
                }
                for (const queued of queuedSteers.values()) {
                    if (queued.conversationId === stream.conversationId) {
                        queued.conversationId = data.ai.conversation_id;
                    }
                }
                setConversationId(data.ai.conversation_id);
            }
            if (pendingCredential?.streamId === streamId) {
                pendingCredential.conversationId = data.ai.conversation_id ||
                    stream.conversationId;
            }
            if (visibleStreamId === streamId &&
                (!pendingCredential || pendingCredential.saved)) {
                hideStreamWhenStored(data.ai.message_id);
            }
            setStatus("Connected", "connected");
        } else if (data.ai.status === "stopped") {
            setStatus("Stopped", "connected");
        } else if (data.ai.status === "credentials") {
            setStatus("API key required", "error");
            updateSteerQueue();
            return;
        } else {
            setStatus(data.ai.message || "Request failed", "error");
        }

        if (continueAfterCredentialSave()) return;
        if (pendingCredential && !pendingCredential.saved) {
            updateSteerQueue();
            return;
        }

        for (const [queueId, queued] of queuedSteers) {
            if (queued.conversationId !== getConversationId() || queued.pending) continue;
            removeQueuedSteer(queueId);
            queueMicrotask(() => void submitPrompt(queued.content));
            return;
        }
        updateSteerQueue();
        prompt.focus();
    };
    const onChat = (data = {}) => {
        if (!shell.isConnected || !data.ai) return;
        const streamId = data.stream_id;
        if (data.ai.status === "queued") {
            if (!queuedSteers.has(data.ai.queue_id)) return;
            removeQueuedSteer(data.ai.queue_id);
            setStatus("Instruction sent", "connected");
            return;
        }
        if (data.ai.status === "steer-error" ||
            data.ai.status === "steer-unavailable") {
            const queued = queuedSteers.get(data.ai.queue_id);
            if (!queued) return;
            queued.pending = false;
            updateSteerQueue();
            setStatus(data.ai.message || "Instruction could not be queued",
                data.ai.status === "steer-error" ? "error" : "connected");
            if (!activeStreams.size && !pendingCredential &&
                queued.conversationId === getConversationId()) {
                removeQueuedSteer(data.ai.queue_id);
                queueMicrotask(() => void submitPrompt(queued.content));
            }
            return;
        }
        if (!activeStreams.has(streamId)) return;

        switch (data.ai.status) {
            case "progress":
                activeStreams.get(streamId).started = true;
                if (!pendingCredential || pendingCredential.saved) {
                    credentialCard.hidden = true;
                }
                setStatus(data.ai.message || "Working…", "connected");
                break;
            case "streaming":
                activeStreams.get(streamId).started = true;
                if (!pendingCredential || pendingCredential.saved) {
                    credentialCard.hidden = true;
                }
                break;
            case "complete":
            case "stopped":
            case "error":
                finishStream(streamId, data);
                break;
            case "credentials":
                pendingCredential = {
                    streamId,
                    conversationId: activeStreams.get(streamId).conversationId,
                    prompt: activeStreams.get(streamId).prompt,
                    provider: activeStreams.get(streamId).provider,
                    model: activeStreams.get(streamId).model,
                    initial: data.ai.credential?.source
                        ? data.ai.credential.source === "provider"
                        : !activeStreams.get(streamId).started,
                    name: data.ai.credential?.name || "provider",
                    saved: false
                };
                if (!pendingCredential.initial) {
                    setStatus("API key required", "error");
                } else {
                    finishStream(streamId, data);
                }
                break;
        }
    };
    const connect = () => {
        const candidate = window.CoCreate?.socket;
        if (!candidate?.send || !candidate?.listen) {
            setStatus("Connecting");
            return;
        }
        socket = candidate;
        if (listeningSocket !== candidate) {
            candidate.listen("ai.chat", onChat);
            listeningSocket = candidate;
        }
        setStatus(candidate.connected ? "Connected" : "Connecting",
            candidate.connected ? "connected" : "");
    };

    const submitPrompt = async (
        message,
        { persist = true, signal, provider, model: requestedModel } = {}
    ) => {
        const text = message.trim();
        if (!text || !socket?.send || activeStreams.size) return;
        const selectedOption = getSelectedModel();
        const selectedProvider = provider ||
            selectedOption?.dataset.provider || "openai";
        const selectedModel = requestedModel ||
            selectedOption?.dataset.model || "gpt-5.6-terra";
        const streamId = makeId();
        activeStreams.set(streamId, {
            conversationId: getConversationId(),
            prompt: text,
            provider: selectedProvider,
            model: selectedModel
        });
        prepareStream(streamId);
        if (prompt.value.trim() === text) prompt.value = "";
        setBusy(true);
        setStatus("Sending…", "connected");

        try {
            setSocketField("uuid", streamId);
            setSocketField("ai.prompt", text);
            setSocketField("ai.persist", persist);
            setSocketField("ai.signal", signal);
            setSocketField("ai.parent_id", getParentId());
            setSocketField("ai.conversation_id", getConversationId());
            setSocketField("ai.provider", selectedProvider);
            setSocketField("ai.model", selectedModel);

            const response = new Promise((resolve, reject) => {
                const controller = new AbortController();
                socketSend.addEventListener("send", (event) => {
                    controller.abort();
                    resolve(event.detail?.response);
                }, { signal: controller.signal });
                socketSend.addEventListener("socketerror", (event) => {
                    controller.abort();
                    reject(event.detail?.error || new Error("Socket send failed."));
                }, { signal: controller.signal });
            });
            socketSend.click();
            await response;
        } catch (error) {
            finishStream(streamId, {
                ai: { status: "error", message: error.message }
            });
        }
    };
    const submitSteer = async (queueId, streamId) => {
        const queued = queuedSteers.get(queueId);
        const text = queued?.content.trim();
        if (!text || queued.pending || !streamId || !socket?.send ||
            activeStreams.get(streamId)?.conversationId !== queued.conversationId) return;
        queued.pending = true;
        updateSteerQueue();
        setStatus("Steering…", "connected");
        try {
            await socket.send({
                method: "ai.steer",
                uuid: queueId,
                stream_id: streamId,
                ai: { stream_id: streamId, queue_id: queueId, prompt: text }
            });
        } catch (error) {
            queued.pending = false;
            updateSteerQueue();
            setStatus(error.message, "error");
        }
    };

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const text = prompt.value.trim();
        if (!text) return;
        if (activeStreams.size) {
            addQueuedSteer(makeId(), text);
            prompt.value = "";
            setStatus("Message queued", "connected");
        } else {
            void submitPrompt(text);
        }
    });
    stop.addEventListener("click", async () => {
        const streamId = activeStreams.keys().next().value;
        if (!streamId || !socket?.send) return;
        stop.disabled = true;
        setStatus("Stopping…", "connected");
        try {
            await socket.send({
                method: "ai.stop",
                stream_id: streamId,
                ai: { stream_id: streamId }
            });
        } catch (error) {
            stop.disabled = false;
            setStatus(error.message, "error");
        }
    });
    prompt.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            form.requestSubmit();
        }
    });

    const retrySocketConnection = () => {
        clearTimeout(socketRetryTimer);
        if (!shell.isConnected) return;
        connect();
        if (socket?.connected) {
            socketRetryDelay = 250;
            return;
        }
        socketRetryTimer = setTimeout(retrySocketConnection, socketRetryDelay);
        socketRetryDelay = Math.min(socketRetryDelay * 2, 5000);
    };
    document.addEventListener("socketLoaded", retrySocketConnection);
    window.addEventListener("online", retrySocketConnection);
    window.addEventListener("focus", retrySocketConnection);
    retrySocketConnection();
})();
