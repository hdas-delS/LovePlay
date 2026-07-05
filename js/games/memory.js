/* ==========================================================
LOVEPLAY v0.1-alpha
games/memory.js
========================================================== */

window.MemoryGame = (() => {

    const SYMBOLS = [
        "❤️","❤️", "💜","💜", "🌙","🌙", "⭐","⭐",
        "🎵","🎵", "🎮","🎮", "🧸","🧸", "🌸","🌸"
    ];

    const state = {
        cards: [],
        flippedCards: [],
        matchedPairs: 0,
        currentPlayer: "novio",
        gameOver: false,
        score: { novio: 0, novia: 0 }
    };

    function init() {
        resetState();
        createBoard();
        renderBoard();
        updateStatus();
    }

    function resetState() {
        state.cards = shuffle([...SYMBOLS]);
        state.flippedCards = [];
        state.matchedPairs = 0;
        state.currentPlayer = "novio";
        state.gameOver = false;
        state.score = { novio: 0, novia: 0 };
    }

    function createBoard() {
        state.cards = state.cards.map(symbol => ({
            symbol, flipped: false, matched: false
        }));
    }

    function renderBoard() {
        const container = GameManager.getContainer();
        if (!container) return;

        container.innerHTML = "";

        const board = document.createElement("div");
        board.className = "memory-board";

        state.cards.forEach((card, index) => {
            const element = document.createElement("button");
            element.className = "memory-card";
            element.textContent = (card.flipped || card.matched) ? card.symbol : "?";
            element.addEventListener("click", () => flipCard(index));
            board.appendChild(element);
        });

        container.appendChild(board);
        renderScoreboard(container);
    }

    function renderScoreboard(container) {
        const score = document.createElement("div");
        score.className = "memory-score";

        const novioDiv = document.createElement("div");
        novioDiv.textContent = `❤️ Novio: ${state.score.novio}`;

        const noviaDiv = document.createElement("div");
        noviaDiv.textContent = `💜 Novia: ${state.score.novia}`;

        score.appendChild(novioDiv);
        score.appendChild(noviaDiv);

        container.appendChild(score);
    }

    function flipCard(index) {
        if (state.gameOver) return;

        const card = state.cards[index];

        if (card.flipped || card.matched) return;
        if (state.flippedCards.length >= 2) return;

        card.flipped = true;
        state.flippedCards.push(index);

        renderBoard();

        if (state.flippedCards.length === 2) {
            setTimeout(validateMove, 700);
        }
    }

    function validateMove() {
        const [firstIndex, secondIndex] = state.flippedCards;
        const first = state.cards[firstIndex];
        const second = state.cards[secondIndex];

        if (first.symbol === second.symbol) {
            first.matched = true;
            second.matched = true;
            state.score[state.currentPlayer]++;
            state.matchedPairs++;

            UI.addActivity(`${capitalize(state.currentPlayer)} encontró una pareja`);
        } else {
            first.flipped = false;
            second.flipped = false;
            switchPlayer();
        }

        state.flippedCards = [];

        renderBoard();
        updateStatus();
        checkGameEnd();
    }

    function checkGameEnd() {
        if (state.matchedPairs < 8) return;

        state.gameOver = true;

        if (state.score.novio > state.score.novia) {
            GameManager.declareWinner("novio");
            return;
        }

        if (state.score.novia > state.score.novio) {
            GameManager.declareWinner("novia");
            return;
        }

        GameManager.declareDraw();
    }

    function switchPlayer() {
        state.currentPlayer = state.currentPlayer === "novio" ? "novia" : "novio";
    }

    function updateStatus() {
        GameManager.setCustomStatus(`🧠 Turno de ${capitalize(state.currentPlayer)}`);
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function capitalize(text) {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    function resetGame() {
        init();
        UI.addActivity("🧠 Nueva partida de Memorama");
    }

    function destroy() {
        const container = GameManager.getContainer();
        if (container) container.innerHTML = "";
    }

    return {
        displayName: "Memorama",
        init,
        resetGame,
        destroy
    };

})();

GameManager.registerGame("memory", MemoryGame);
