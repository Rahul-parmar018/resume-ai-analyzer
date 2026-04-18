import axios from "axios";
import { auth } from "./firebase";

// Build the Candidex API Orchestrator
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

// IDENTITY INTERCEPTOR: Always get a fresh token from the current Firebase user
// We call getIdToken() directly — it auto-refreshes if expired
api.interceptors.request.use(async (config) => {
    try {
        // auth.currentUser is populated synchronously after Firebase restores session
        const currentUser = auth.currentUser;
        if (currentUser) {
            // forceRefresh=false means it returns cached token unless expiring soon
            const token = await currentUser.getIdToken(false);
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            console.warn("[API] No authenticated user — request will be unauthenticated.");
        }
    } catch (error) {
        console.error("[API] Token retrieval failed:", error);
    }
    return config;
}, (error) => Promise.reject(error));

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.warn("[API] 401 Unauthorized — token may be missing or expired.");
        }
        return Promise.reject(error);
    }
);

export default api;
