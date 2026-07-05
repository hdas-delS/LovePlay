/* ==========================================================
LOVEPLAY v0.1-alpha
app.js
========================================================== */

window.App = (() => {

    const elements = {

        accessForm: document.getElementById("access-form"),
        accessPassword: document.getElementById("access-password"),

        novioButton: document.getElementById("btn-novio"),
        noviaButton: document.getElementById("btn-novia"),

        chatForm: document.getElementById("chat-form"),
        chatInput: document.getElementById("chat-input"),

        leaveButton: document.getElementById("btn-leave-room"),

        gameSelector: document.getElementById("game-selector")
    };

    async function initialize() {
        try {
            bindEvents();
            initializeUI();
            await initializeCrypto();
            initializeGames();

            UI.addActivity("🚀 LovePlay iniciado");

            console.log(`${AppConfig.APP_NAME} ${AppConfig.APP_VERSION}`);

        } catch (error) {
            console.error(error);
            UI.showNotification("Error al iniciar LovePlay");
        }
    }

    function initializeUI() {
        UI.showScreen("access");
        UI.updateRoomStatus("Sala vacía");
        UI.setGameStatus("Esperando partida");
    }

    async function initializeCrypto() {
        await LoveCrypto.initialize(AppConfig.ACCESS_PASSWORD);
    }

    function initializeGames() {
        GameManager.initialize();
    }

    function bindEvents() {
        bindAccessEvents();
        bindIdentityEvents();
        bindChatEvents();
        bindRoomEvents();
        bindGameEvents();
    }

    function bindAccessEvents() {
        if (!elements.accessForm) return;

        elements.accessForm.addEventListener("submit", handleAccess);
    }

    function handleAccess(event) {
        event.preventDefault();

        const password = elements.accessPassword?.value?.trim();
        const success = Room.authenticate(password);

        if (!success) {
            UI.showNotification("Contraseña incorrecta");
            return;
        }

        UI.showScreen("identity");
        UI.showNotification("Acceso concedido");
    }

    function bindIdentityEvents() {
        elements.novioButton?.addEventListener("click", () => handleIdentity("novio"));
        elements.noviaButton?.addEventListener("click", () => handleIdentity("novia"));
    }

    function handleIdentity(identity) {
        Room.selectIdentity(identity);
        Room.joinRoom();
    }

    function bindChatEvents() {
        if (!elements.chatForm) return;

        elements.chatForm.addEventListener("submit", handleSendMessage);
    }

    async function handleSendMessage(event) {
        event.preventDefault();

        const message = elements.chatInput?.value?.trim();

        if (!message) return;

        const sent = await Chat.sendMessage(message);

        if (sent) {
            elements.chatInput.value = "";
        }
    }

    function bindRoomEvents() {
        elements.leaveButton?.addEventListener("click", handleLeaveRoom);
    }

    function handleLeaveRoom() {
        Chat.sendSystemMessage("👋 Usuario salió de la sala");
        Room.leaveRoom();
    }

    /* ======================================================
       JUEGOS (agregado: conecta el selector de juegos)
    ====================================================== */

    function bindGameEvents() {
        if (!elements.gameSelector) return;

        elements.gameSelector.addEventListener("change", handleGameChange);
    }

    function handleGameChange(event) {
        const selected = event.target.value;
        GameManager.startGame(selected);
    }

    function getState() {
        return {
            room: Room.getRoomState(),
            chat: Chat.getState(),
            game: GameManager.getState(),
            crypto: LoveCrypto.getStatus()
        };
    }

    return {
        initialize,
        getState
    };

})();

document.addEventListener("DOMContentLoaded", () => {
    App.initialize();
});
