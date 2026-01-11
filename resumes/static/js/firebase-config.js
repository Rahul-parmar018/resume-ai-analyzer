// Firebase configuration
// IMPORTANT: Replace these placeholder values with your actual Firebase project credentials
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// These will be initialized in the script tag of the pages that need them
// or we can initialize them here if we use a module system.
// For this project, we'll keep the config globally available.
window.firebaseConfig = firebaseConfig;
