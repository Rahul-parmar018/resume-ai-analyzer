import api from "../api-client";

const buildQueryTextFromProfile = (profile) => {
  const jobTitle = profile?.job_title || "";
  const req = Array.isArray(profile?.required_skills) ? profile.required_skills.join(", ") : "";
  const opt = Array.isArray(profile?.optional_skills) ? profile.optional_skills.join(", ") : "";
  const tools = Array.isArray(profile?.tools) ? profile.tools.join(", ") : "";
  const exp = profile?.experience_level || "";
  const notes = profile?.notes || "";

  return [
    `Role: ${jobTitle}`,
    exp ? `Experience: ${exp}` : "",
    req ? `Required Skills: ${req}` : "",
    opt ? `Optional Skills: ${opt}` : "",
    tools ? `Tools: ${tools}` : "",
    notes ? `Notes: ${notes}` : "",
  ].filter(Boolean).join("\n");
};

/**
 * Main Resume Optimization API
 */
export const analyzeResume = async (file, jdOrProfile, resumeText = "") => {
  const formData = new FormData();
  if (file) formData.append("file", file);
  if (resumeText) formData.append("resume_text", resumeText);

  if (typeof jdOrProfile === "string") {
    if (jdOrProfile.trim()) formData.append("job_description", jdOrProfile);
  } else if (jdOrProfile && typeof jdOrProfile === "object") {
    formData.append("job_profile", JSON.stringify(jdOrProfile));
    formData.append("job_description", buildQueryTextFromProfile(jdOrProfile));
  }

  const res = await api.post("/optimize/", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return res.data;
};

/**
 * Fetch historical analyses
 */
export const fetchHistory = async () => {
  const res = await api.get("/history/");
  return res.data;
};

/**
 * Fetch dashboard aggregated analytics
 */
export const fetchDashboardAnalytics = async () => {
  const res = await api.get("/dashboard/");
  return res.data;
};

/**
 * Natural Language Talent Search
 */
export const executeSemanticSearch = async (query) => {
  const res = await api.post("/semantic-search/", { query });
  return res.data;
};

/**
 * Recruiter Batch Processing
 */
export const bulkAnalyzeResumes = async (files, jdOrProfile) => {
  const formData = new FormData();
  Array.from(files).forEach((file) => formData.append("files", file));
  
  if (typeof jdOrProfile === "string") {
    formData.append("job_description", jdOrProfile);
  } else if (jdOrProfile && typeof jdOrProfile === "object") {
    formData.append("job_profile", JSON.stringify(jdOrProfile));
    formData.append("job_description", buildQueryTextFromProfile(jdOrProfile));
  }

  const res = await api.post("/bulk-analyze/", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return res.data;
};

/**
 * Delete a specific analysis record
 */
export const deleteAnalysis = async (id) => {
  const res = await api.delete(`/analysis/${id}/`);
  return res.data;
};

/**
 * AI-powered Bullet Point Rewriting
 */
export const rewriteResume = async (resumeText) => {
  const res = await api.post("/rewrite-resume/", { resume_text: resumeText });
  return res.data;
};

