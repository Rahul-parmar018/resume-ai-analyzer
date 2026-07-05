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
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const currentUser = auth.currentUser;
                if (currentUser) {
                    // Force refresh Firebase token
                    const token = await currentUser.getIdToken(true);
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    // Retry request with fresh token
                    return api(originalRequest);
                }
            } catch (refreshError) {
                console.error("[API] Token refresh during 401 failed:", refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
