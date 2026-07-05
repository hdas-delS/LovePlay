/* ==========================================================
LOVEPLAY v0.1-alpha
ui.js
========================================================== */

window.UI = (() => {

    const elements = {

        accessScreen: document.getElementById("screen-access"),
        identityScreen: document.getElementById("screen-identity"),
        roomScreen: document.getElementById("screen-room"),

        roomStatus: document.getElementById("room-status"),
        usersList: document.getElementById("users-list"),

        chatMessages: document.getElementById("chat-messages"),

        activityFeed: document.getElementById("activity-feed"),

        scoreNovio: document.getElementById("score-novio"),
        scoreNovia: document.getElementById("score-novia"),
        scoreDraws: document.getElementById("score-draws"),

        gameStatus: document.getElementById("game-status"),

        notifications: document.getElementById("notifications")
    };

    function hideAllScreens() {
        elements.accessScreen?.classList.remove("active-screen");
        elements.identityScreen?.classList.remove("active-screen");
        elements.roomScreen?.classList.remove("active-screen");
    }

    function showScreen(screenId) {
        hideAllScreens();

        switch (screenId) {
            case "access":
                elements.accessScreen?.classList.add("active-screen");
                break;
            case "identity":
                elements.identityScreen?.classList.add("active-screen");
                break;
            case "room":
                elements.roomScreen?.classList.add("active-screen");
                break;
        }
    }

    function updateRoomStatus(text) {
        if (!elements.roomStatus) return;
        elements.roomStatus.textContent = text;
    }

    function renderUsers(users) {
        if (!elements.usersList) return;

        elements.usersList.innerHTML = "";

        users.forEach(user => {
            const item = document.createElement("div");
            item.className = "user-item";
            item.textContent = user;
            elements.usersList.appendChild(item);
        });
    }

    /* ======================================================
       CHAT (corregido: textContent en vez de innerHTML)
    ====================================================== */

    function addUserMessage(sender, message) {
        if (!elements.chatMessages) return;

        const node = document.createElement("div");
        node.className = "message";
        node.classList.add(sender === "novio" ? "message-own" : "message-other");

        const senderLabel = document.createElement("strong");
        senderLabel.textContent = sender;

        node.appendChild(senderLabel);
        node.appendChild(document.createElement("br"));
        node.appendChild(document.createTextNode(message));

        elements.chatMessages.appendChild(node);

        scrollChatToBottom();
    }

    function addSystemMessage(message) {
        if (!elements.chatMessages) return;

        const node = document.createElement("div");
        node.className = "message message-system";
        node.textContent = message;

        elements.chatMessages.appendChild(node);

        scrollChatToBottom();
    }

    function clearChat() {
        if (!elements.chatMessages) return;
        elements.chatMessages.innerHTML = "";
    }

    function scrollChatToBottom() {
        if (!elements.chatMessages) return;
        elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
    }

    function addActivity(text) {
        if (!elements.activityFeed) return;

        const item = document.createElement("div");
        item.className = "activity-item";

        const now = new Date();
        const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        item.textContent = `[${time}] ${text}`;

        elements.activityFeed.appendChild(item);

        while (elements.activityFeed.children.length > AppConfig.MAX_ACTIVITY_ITEMS) {
            elements.activityFeed.firstElementChild?.remove();
        }

        elements.activityFeed.scrollTop = elements.activityFeed.scrollHeight;
    }

    function updateScoreboard(score) {
        if (!score) return;

        if (elements.scoreNovio) elements.scoreNovio.textContent = score.novio;
        if (elements.scoreNovia) elements.scoreNovia.textContent = score.novia;
        if (elements.scoreDraws) elements.scoreDraws.textContent = score.empates;
    }

    function setGameStatus(text) {
        if (!elements.gameStatus) return;
        elements.gameStatus.textContent = text;
    }

    function showNotification(text, duration = 3000) {
        if (!elements.notifications) {
            console.log(text);
            return;
        }

        const notification = document.createElement("div");
        notification.className = "notification";
        notification.textContent = text;

        elements.notifications.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, duration);
    }

    return {
        showScreen,
        updateRoomStatus,
        renderUsers,
        addUserMessage,
        addSystemMessage,
        clearChat,
        addActivity,
        updateScoreboard,
        setGameStatus,
        showNotification
    };

})();
