import { auth } from "../firebase";

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

export const analyzeResume = async (file, jdOrProfile) => {
  const token = await auth.currentUser.getIdToken();
  const formData = new FormData();
  formData.append("file", file);

  if (typeof jdOrProfile === "string") {
    if (jdOrProfile.trim()) formData.append("job_description", jdOrProfile);
  } else if (jdOrProfile && typeof jdOrProfile === "object") {
    formData.append("job_profile", JSON.stringify(jdOrProfile));
    formData.append("job_description", buildQueryTextFromProfile(jdOrProfile));
  }

  const res = await fetch(`${import.meta.env.VITE_API_URL}/optimize/`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`
    },
    body: formData,
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Analysis failed");
  }

  return res.json();
};

export const fetchHistory = async () => {
  const token = await auth.currentUser.getIdToken();
  const res = await fetch(`${import.meta.env.VITE_API_URL}/history/`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Failed to fetch history");
  }

  return res.json();
};

export const fetchDashboardAnalytics = async () => {
  const token = await auth.currentUser.getIdToken();
  const res = await fetch(`${import.meta.env.VITE_API_URL}/dashboard/`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Failed to fetch dashboard intelligence");
  }

  return res.json();
};

export const executeSemanticSearch = async (query) => {
  const token = await auth.currentUser.getIdToken();
  const res = await fetch(`${import.meta.env.VITE_API_URL}/semantic-search/`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ query })
  });
  
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Failed to execute semantic search");
  }
  
  return res.json();
};

export const bulkAnalyzeResumes = async (files, jdOrProfile) => {
  const token = await auth.currentUser.getIdToken();
  const formData = new FormData();
  
  // Attach all files securely to the array payload
  Array.from(files).forEach((file) => {
    formData.append("files", file);
  });
  
  if (typeof jdOrProfile === "string") {
    formData.append("job_description", jdOrProfile);
  } else if (jdOrProfile && typeof jdOrProfile === "object") {
    formData.append("job_profile", JSON.stringify(jdOrProfile));
    formData.append("job_description", buildQueryTextFromProfile(jdOrProfile));
  }

  const res = await fetch(`${import.meta.env.VITE_API_URL}/bulk-analyze/`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`
    },
    body: formData
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Bulk analysis failed");
  }

  return res.json();
};

export const deleteAnalysis = async (id) => {
  const token = await auth.currentUser.getIdToken();
  const res = await fetch(`${import.meta.env.VITE_API_URL}/analysis/${id}/`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Failed to delete analysis");
  }

  return res.json();
};

export const rewriteResume = async (resumeText) => {
  const token = await auth.currentUser.getIdToken();
  const res = await fetch(`${import.meta.env.VITE_API_URL}/rewrite-resume/`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ resume_text: resumeText })
  });
  
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Rewrite failed");
  }
  
  return res.json();
};
