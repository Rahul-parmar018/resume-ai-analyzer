import { auth } from "../firebase";

export const analyzeResume = async (file, jd) => {
  const token = await auth.currentUser.getIdToken();
  const formData = new FormData();
  formData.append("file", file);
  if (jd.trim()) {
    formData.append("job_description", jd);
  }

  const res = await fetch(`${import.meta.env.VITE_API_URL}/analyze/`, {
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
