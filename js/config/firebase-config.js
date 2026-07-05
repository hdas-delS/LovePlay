/* ==========================================================
LOVEPLAY v0.1-alpha
firebase-config.js
========================================================== */

window.FirebaseConfig = {

    ENABLED: true,

    apiKey: "AIzaSyCqHX5sZUDhZF-AdIv28EObKqofXGgW5fY",
    authDomain: "loveplay-app.firebaseapp.com",
    databaseURL: "https://loveplay-app-default-rtdb.firebaseio.com",
    projectId: "loveplay-app",
    storageBucket: "loveplay-app.firebasestorage.app",
    messagingSenderId: "222729208979",
    appId: "1:222729208979:web:ddcd25c4d5a2a51cb9b966"
};

/* ==========================================================
INICIALIZACIÓN
========================================================== */

firebase.initializeApp(window.FirebaseConfig);

window.FirebaseState = {

    initialized: true,
    connected: false
};

window.FirebaseDB = firebase.database();

/* ==========================================================
AUTENTICACIÓN ANÓNIMA
========================================================== */

firebase.auth().signInAnonymously()

    .then(() => {

        window.FirebaseState.connected = true;

        if (window.UI) {
            UI.showNotification("✅ Firebase conectado");
        }

        console.log("Firebase: sesión anónima iniciada");
    })

    .catch(error => {

        if (window.UI) {
            UI.showNotification("❌ Error de conexión Firebase");
        }

        console.error("Firebase auth error:", error);
    });
