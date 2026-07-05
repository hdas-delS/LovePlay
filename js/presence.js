/* ==========================================================
LOVEPLAY v0.1-alpha
presence.js
========================================================== */

window.Presence = (() => {

    const state = {
        users: [],
        roomActive: true,
        roomResetTimer: null,
        lastActivity: null
    };

    function now() {
        return Date.now();
    }

    function getResetTime() {
        return AppConfig.ROOM_RESET_MINUTES * 60 * 1000;
    }

    function addUser(user) {
        if (state.users.includes(user)) {
            return false;
        }

        if (state.users.length >= AppConfig.MAX_USERS) {
            return false;
        }

        state.users.push(user);
        state.lastActivity = now();

        stopResetTimer();
        updateUI();

        return true;
    }

    function removeUser(user) {
        state.users = state.users.filter(current => current !== user);
        state.lastActivity = now();

        updateUI();

        if (state.users.length === 0) {
            startResetTimer();
        }
    }

    function hasUser(user) {
        return state.users.includes(user);
    }

    function getUsers() {
        return [...state.users];
    }

    function getUserCount() {
        return state.users.length;
    }

    function isRoomEmpty() {
        return state.users.length === 0;
    }

    function isRoomFull() {
        return state.users.length >= AppConfig.MAX_USERS;
    }

    function startResetTimer() {
        stopResetTimer();

        state.roomResetTimer = setTimeout(resetRoom, getResetTime());

        UI.addActivity(`⏳ Sala vacía. Reinicio en ${AppConfig.ROOM_RESET_MINUTES} minutos`);
    }

    function stopResetTimer() {
        if (!state.roomResetTimer) return;
        clearTimeout(state.roomResetTimer);
        state.roomResetTimer = null;
    }

    function resetRoom() {
        state.users = [];
        state.roomActive = true;
        state.lastActivity = now();

        updateUI();

        UI.addActivity("🧹 Sala reiniciada automáticamente");
        UI.showNotification("Sala reiniciada");
    }

    function updateUI() {
        UI.renderUsers(state.users);
        updateRoomStatus();
    }

    function updateRoomStatus() {
        if (state.users.length === 0) {
            UI.updateRoomStatus("Sala vacía");
            return;
        }

        if (state.users.length === 1) {
            UI.updateRoomStatus("Esperando a la otra persona ❤️");
            return;
        }

        UI.updateRoomStatus("❤️ Ambos conectados");
    }

    function markActivity() {
        state.lastActivity = now();
    }

    function getLastActivity() {
        return state.lastActivity;
    }

    function getState() {
        return JSON.parse(JSON.stringify({
            users: state.users,
            roomActive: state.roomActive,
            lastActivity: state.lastActivity
        }));
    }

    return {
        addUser,
        removeUser,
        hasUser,
        getUsers,
        getUserCount,
        isRoomEmpty,
        isRoomFull,
        markActivity,
        getLastActivity,
        getState
    };

})();
