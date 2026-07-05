/* ==========================================================
LOVEPLAY v0.1-alpha
crypto.js
========================================================== */

window.LoveCrypto = (() => {

    let encryptionKey = null;

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    function stringToBuffer(value) {
        return encoder.encode(value);
    }

    function bufferToString(buffer) {
        return decoder.decode(buffer);
    }

    function arrayBufferToBase64(buffer) {
        const bytes = new Uint8Array(buffer);
        let binary = "";
        bytes.forEach(byte => {
            binary += String.fromCharCode(byte);
        });
        return btoa(binary);
    }

    function base64ToArrayBuffer(value) {
        const binary = atob(value);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return bytes.buffer;
    }

    async function deriveKey(password) {
        const keyMaterial = await crypto.subtle.importKey(
            "raw",
            stringToBuffer(password),
            { name: "PBKDF2" },
            false,
            ["deriveKey"]
        );

        return crypto.subtle.deriveKey(
            {
                name: "PBKDF2",
                salt: stringToBuffer(AppConfig.CRYPTO_SALT),
                iterations: AppConfig.PBKDF2_ITERATIONS,
                hash: "SHA-256"
            },
            keyMaterial,
            {
                name: "AES-GCM",
                length: AppConfig.AES_KEY_LENGTH
            },
            false,
            ["encrypt", "decrypt"]
        );
    }

    async function initialize(password) {
        encryptionKey = await deriveKey(password);
        return true;
    }

    function isReady() {
        return encryptionKey !== null;
    }

    async function encrypt(plainText) {
        if (!encryptionKey) {
            throw new Error("Encryption key not initialized");
        }

        const iv = crypto.getRandomValues(new Uint8Array(12));

        const encrypted = await crypto.subtle.encrypt(
            { name: "AES-GCM", iv },
            encryptionKey,
            stringToBuffer(plainText)
        );

        return {
            iv: arrayBufferToBase64(iv),
            data: arrayBufferToBase64(encrypted)
        };
    }

    async function decrypt(payload) {
        if (!encryptionKey) {
            throw new Error("Encryption key not initialized");
        }

        const decrypted = await crypto.subtle.decrypt(
            { name: "AES-GCM", iv: new Uint8Array(base64ToArrayBuffer(payload.iv)) },
            encryptionKey,
            base64ToArrayBuffer(payload.data)
        );

        return bufferToString(decrypted);
    }

    function destroyKey() {
        encryptionKey = null;
    }

    function getStatus() {
        return {
            ready: isReady(),
            algorithm: "AES-GCM",
            keyLength: AppConfig.AES_KEY_LENGTH
        };
    }

    return {
        initialize,
        encrypt,
        decrypt,
        destroyKey,
        isReady,
        getStatus
    };

})();
