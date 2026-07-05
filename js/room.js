/* ==========================================================
LOVEPLAY v0.1-alpha
room.js
========================================================== */

window.Room = (() => {

    const state = {
        currentUser: null,
        authenticated: false,
        roomJoined: false
    };

    function validatePassword(password) {
        return password === AppConfig.ACCESS_PASSWORD;
    }

    function authenticate(password) {
        const valid = validatePassword(password);
        state.authenticated = valid;
        return valid;
    }

    function isAuthenticated() {
        return state.authenticated;
    }

    function selectIdentity(user) {
        if (user !== "novio" && user !== "novia") {
            return false;
        }

        state.currentUser = user;
        return true;
    }

    function getCurrentUser() {
        return state.currentUser;
    }

    function hasIdentity() {
        return state.currentUser !== null;
    }

    function joinRoom() {
        if (!state.authenticated) return false;
        if (!state.currentUser) return false;

        if (Presence.isRoomFull() && !Presence.hasUser(state.currentUser)) {
            UI.showNotification("La sala está llena");
            return false;
        }

        const joined = Presence.addUser(state.currentUser);

        if (!joined) return false;

        state.roomJoined = true;

        UI.showScreen("room");
        UI.addActivity(`${capitalize(state.currentUser)} entró a la sala`);
        UI.addSystemMessage(`${capitalize(state.currentUser)} se conectó ❤️`);
        UI.showNotification("Bienvenido a LovePlay");

        return true;
    }

    function leaveRoom() {
        if (!state.roomJoined) return;

        Presence.removeUser(state.currentUser);

        UI.addActivity(`${capitalize(state.currentUser)} salió de la sala`);
        UI.addSystemMessage(`${capitalize(state.currentUser)} se desconectó`);

        state.roomJoined = false;
        state.currentUser = null;
        state.authenticated = false;

        UI.showScreen("access");
    }

    function isInRoom() {
        return state.roomJoined;
    }

    function getRoomState() {
        return JSON.parse(JSON.stringify({
            currentUser: state.currentUser,
            authenticated: state.authenticated,
            roomJoined: state.roomJoined
        }));
    }

    function capitalize(value) {
        if (!value) return "";
        return value.charAt(0).toUpperCase() + value.slice(1);
    }

    function saveSession() {
        localStorage.setItem("loveplay-session", JSON.stringify({
            user: state.currentUser,
            authenticated: state.authenticated
        }));
    }

    function loadSession() {
        const raw = localStorage.getItem("loveplay-session");
        if (!raw) return false;

        try {
            const data = JSON.parse(raw);
            state.currentUser = data.user;
            state.authenticated = data.authenticated;
            return true;
        } catch {
            return false;
        }
    }

    function clearSession() {
        localStorage.removeItem("loveplay-session");
    }

    return {
        authenticate,
        isAuthenticated,
        selectIdentity,
        getCurrentUser,
        hasIdentity,
        joinRoom,
        leaveRoom,
        isInRoom,
        saveSession,
        loadSession,
        clearSession,
        getRoomState
    };

})();
