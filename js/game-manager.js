/* ==========================================================
LOVEPLAY v0.1-alpha
game-manager.js
========================================================== */

window.GameManager = (() => {

    const state = {
        currentGame: null,
        score: {
            novio: 0,
            novia: 0,
            empates: 0
        }
    };

    const games = {};

    function registerGame(name, game) {
        games[name] = game;
    }

    function getGame(name) {
        return games[name];
    }

    function getCurrentGame() {
        return state.currentGame;
    }

    function startGame(name) {
        const game = getGame(name);

        if (!game) {
            UI.showNotification("Juego no encontrado");
            return false;
        }

        state.currentGame = name;

        clearContainer();

        if (typeof game.init === "function") {
            game.init();
        }

        UI.addActivity(`🎮 Juego iniciado: ${game.displayName || name}`);

        return true;
    }

    function addPoint(player) {
        if (!(player in state.score)) return;

        state.score[player]++;
        updateScoreboard();
    }

    function addDraw() {
        state.score.empates++;
        updateScoreboard();
    }

    function resetScoreboard() {
        state.score = { novio: 0, novia: 0, empates: 0 };
        updateScoreboard();
    }

    function getScore() {
        return JSON.parse(JSON.stringify(state.score));
    }

    function updateScoreboard() {
        UI.updateScoreboard(state.score);
    }

    function declareWinner(player) {
        addPoint(player);

        UI.setGameStatus(`🏆 Ganó ${capitalize(player)}`);
        UI.addActivity(`🏆 ${capitalize(player)} ganó la partida`);
        UI.showNotification(`${capitalize(player)} ganó`);
    }

    function declareDraw() {
        addDraw();

        UI.setGameStatus("🤝 Empate");
        UI.addActivity("🤝 La partida terminó en empate");
        UI.showNotification("Empate");
    }

    function clearContainer() {
        const container = document.getElementById("game-container");
        if (!container) return;
        container.innerHTML = "";
    }

    function getContainer() {
        return document.getElementById("game-container");
    }

    function setTurn(player) {
        UI.setGameStatus(`🎯 Turno de ${capitalize(player)}`);
    }

    function setCustomStatus(text) {
        UI.setGameStatus(text);
    }

    function capitalize(value) {
        if (!value) return "";
        return value.charAt(0).toUpperCase() + value.slice(1);
    }

    function getState() {
        return JSON.parse(JSON.stringify({
            currentGame: state.currentGame,
            score: state.score,
            registeredGames: Object.keys(games)
        }));
    }

    function initialize() {
        updateScoreboard();
        startGame(AppConfig.DEFAULT_GAME);
    }

    return {
        registerGame,
        getGame,
        getCurrentGame,
        startGame,
        addPoint,
        addDraw,
        declareWinner,
        declareDraw,
        resetScoreboard,
        getScore,
        setTurn,
        setCustomStatus,
        getContainer,
        initialize,
        getState
    };

})();
