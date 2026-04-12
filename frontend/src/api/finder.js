import { auth } from "../firebase";

const API_BASE = `${import.meta.env.VITE_API_URL}`;

/**
 * Fetches all job requisitions from the backend.
 */
export const fetchRequisitions = async () => {
    const res = await fetch(`${API_BASE}/requisitions/`);
    if (!res.ok) throw new Error("Failed to fetch jobs");
    return res.json();
};

/**
 * Creates a new job requisition.
 */
export const createRequisition = async (data) => {
    const res = await fetch(`${API_BASE}/requisition/create/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to create job requirement");
    return res.json();
};

/**
 * Uploads multiple resumes to a specific requisition for ranking.
 */
export const uploadCandidates = async (reqId, files) => {
    const formData = new FormData();
    files.forEach(file => formData.append("files", file));

    const res = await fetch(`${API_BASE}/requisition/${reqId}/analyze/`, {
        method: "POST",
        body: formData
    });
    if (!res.ok) throw new Error("Batch upload failed");
    return res.json();
};

/**
 * Fetches ranked candidates for a specific job.
 */
export const fetchCandidates = async (reqId, filters = {}) => {
    const params = new URLSearchParams(filters);
    const res = await fetch(`${API_BASE}/requisition/${reqId}/candidates/?${params.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch candidate rankings");
    return res.json();
};

/**
 * Fetches intelligence metrics for a job requirement.
 */
export const fetchRequisitionMetrics = async (reqId) => {
    const res = await fetch(`${API_BASE}/requisition/${reqId}/metrics/`);
    if (!res.ok) throw new Error("Failed to fetch requirement metrics");
    return res.json();
};
