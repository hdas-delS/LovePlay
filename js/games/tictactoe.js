/* ==========================================================
LOVEPLAY v0.1-alpha
games/tictactoe.js
========================================================== */

/*

TEMPORAL

X = Novio
O = Novia

Cuando exista sincronización Firebase,
los roles se asignarán dinámicamente.

=============================================================
*/

window.TicTacToe = (() => {

    const state = {
        board: ["", "", "", "", "", "", "", "", ""],
        currentPlayer: "novio",
        gameOver: false
    };

    const WIN_PATTERNS = [
        [0,1,2], [3,4,5], [6,7,8],
        [0,3,6], [1,4,7], [2,5,8],
        [0,4,8], [2,4,6]
    ];

    function init() {
        resetState();
        renderBoard();
        GameManager.setTurn(state.currentPlayer);
    }

    function resetState() {
        state.board = ["", "", "", "", "", "", "", "", ""];
        state.currentPlayer = "novio";
        state.gameOver = false;
    }

    function renderBoard() {
        const container = GameManager.getContainer();
        if (!container) return;

        container.innerHTML = "";

        const board = document.createElement("div");
        board.className = "ttt-board";

        state.board.forEach((value, index) => {
            const cell = document.createElement("button");
            cell.className = "ttt-cell";
            cell.textContent = value;
            cell.addEventListener("click", () => handleMove(index));
            board.appendChild(cell);
        });

        container.appendChild(board);

        renderControls(container);
    }

    function renderControls(container) {
        const controls = document.createElement("div");
        controls.className = "ttt-controls";

        const resetButton = document.createElement("button");
        resetButton.className = "button primary-button";
        resetButton.textContent = "Nueva Partida";
        resetButton.addEventListener("click", resetGame);

        controls.appendChild(resetButton);
        container.appendChild(controls);
    }

    function handleMove(index) {
        if (state.gameOver) return;
        if (state.board[index] !== "") return;

        state.board[index] = getSymbol(state.currentPlayer);

        renderBoard();

        if (checkWinner()) {
            state.gameOver = true;
            GameManager.declareWinner(state.currentPlayer);
            return;
        }

        if (checkDraw()) {
            state.gameOver = true;
            GameManager.declareDraw();
            return;
        }

        switchPlayer();
        GameManager.setTurn(state.currentPlayer);
    }

    function switchPlayer() {
        state.currentPlayer = state.currentPlayer === "novio" ? "novia" : "novio";
    }

    function getSymbol(player) {
        return player === "novio" ? "X" : "O";
    }

    function checkWinner() {
        return WIN_PATTERNS.some(pattern => {
            const [a, b, c] = pattern;
            const first = state.board[a];
            if (first === "") return false;
            return first === state.board[b] && first === state.board[c];
        });
    }

    function checkDraw() {
        return state.board.every(cell => cell !== "");
    }

    function resetGame() {
        resetState();
        renderBoard();
        GameManager.setTurn(state.currentPlayer);
        UI.addActivity("🔄 Nueva partida de Tres en Raya");
    }

    function destroy() {
        const container = GameManager.getContainer();
        if (container) container.innerHTML = "";
    }

    function getState() {
        return JSON.parse(JSON.stringify({
            board: state.board,
            currentPlayer: state.currentPlayer,
            gameOver: state.gameOver
        }));
    }

    return {
        displayName: "Tres en Raya",
        init,
        resetGame,
        destroy,
        getState
    };

})();

GameManager.registerGame("tictactoe", TicTacToe);
