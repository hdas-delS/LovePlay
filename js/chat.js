/* ==========================================================
LOVEPLAY v0.1-alpha
chat.js
========================================================== */

window.Chat = (() => {

    const state = {
        messages: []
    };

    function createMessage(sender, text) {
        return {
            id: crypto.randomUUID(),
            sender,
            text,
            timestamp: Date.now()
        };
    }

    function validateMessage(text) {
        if (typeof text !== "string") return false;

        const trimmed = text.trim();

        if (trimmed.length === 0) return false;
        if (trimmed.length > AppConfig.MAX_MESSAGE_LENGTH) return false;

        return true;
    }

    async function sendMessage(text) {
        if (!Room.isInRoom()) return false;

        if (!validateMessage(text)) {
            UI.showNotification("Mensaje inválido");
            return false;
        }

        if (!LoveCrypto.isReady()) {
            UI.showNotification("Cifrado no inicializado");
            return false;
        }

        const sender = Room.getCurrentUser();
        const encrypted = await LoveCrypto.encrypt(text);
        const message = createMessage(sender, text);

        state.messages.push({ ...message, encrypted });

        trimHistory();

        UI.addUserMessage(sender, text);
        UI.addActivity(`${capitalize(sender)} envió un mensaje`);

        return true;
    }

    async function receiveMessage(encryptedPayload, sender) {
        if (!LoveCrypto.isReady()) return false;

        try {
            const text = await LoveCrypto.decrypt(encryptedPayload);
            const message = createMessage(sender, text);

            state.messages.push({ ...message, encrypted: encryptedPayload });

            trimHistory();

            UI.addUserMessage(sender, text);

            return true;
        } catch {
            UI.showNotification("Error al descifrar mensaje");
            return false;
        }
    }

    function trimHistory() {
        while (state.messages.length > AppConfig.MAX_CHAT_MESSAGES) {
            state.messages.shift();
        }
    }

    function clearHistory() {
        state.messages = [];
        UI.clearChat();
    }

    function getMessages() {
        return JSON.parse(JSON.stringify(state.messages));
    }

    function sendSystemMessage(text) {
        UI.addSystemMessage(text);
        UI.addActivity(text);
    }

    function capitalize(value) {
        if (!value) return "";
        return value.charAt(0).toUpperCase() + value.slice(1);
    }

    function getState() {
        return JSON.parse(JSON.stringify({
            count: state.messages.length,
            messages: state.messages
        }));
    }

    return {
        sendMessage,
        receiveMessage,
        sendSystemMessage,
        clearHistory,
        getMessages,
        getState
    };

})();
