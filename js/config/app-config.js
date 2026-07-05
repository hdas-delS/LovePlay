/* ==========================================================
LOVEPLAY v0.1-alpha
app-config.js
========================================================== */

window.AppConfig = {

    APP_NAME: "LovePlay",
    APP_VERSION: "0.1-alpha",
    ENVIRONMENT: "development",

    ACCESS_PASSWORD: "2041thAS",

    ROOM_NAME: "Sala Principal",
    ROOM_RESET_MINUTES: 7,
    MAX_USERS: 2,

    MAX_CHAT_MESSAGES: 50,
    MAX_MESSAGE_LENGTH: 500,

    MAX_ACTIVITY_ITEMS: 30,

    DEFAULT_GAME: "tictactoe",

    CRYPTO_SALT: "LOVEPLAY_V1",
    PBKDF2_ITERATIONS: 100000,
    AES_KEY_LENGTH: 256,

    TOKEN_LENGTH: 8,
    TOKEN_DURATION_MINUTES: 60,

    ENABLE_PWA: false,

    DEBUG_MODE: true

};
