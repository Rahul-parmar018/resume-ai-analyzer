import api from "../api-client";

/**
 * Fetches all job requisitions from the backend.
 */
export const fetchRequisitions = async () => {
    const res = await api.get("/requisitions/");
    return res.data;
};

/**
 * Creates a new job requisition.
 */
export const createRequisition = async (data) => {
    const res = await api.post("/requisition/create/", data);
    return res.data;
};

/**
 * Uploads multiple resumes to a specific requisition for ranking.
 */
export const uploadCandidates = async (reqId, files) => {
    const formData = new FormData();
    files.forEach(file => formData.append("files", file));

    const res = await api.post(`/requisition/${reqId}/analyze/`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return res.data;
};

/**
 * Fetches ranked candidates for a specific job.
 */
export const fetchCandidates = async (reqId, filters = {}) => {
    const res = await api.get(`/requisition/${reqId}/candidates/`, {
        params: filters
    });
    return res.data;
};

/**
 * Fetches intelligence metrics for a job requirement.
 */
export const fetchRequisitionMetrics = async (reqId) => {
    const res = await api.get(`/requisition/${reqId}/metrics/`);
    return res.data;
};

