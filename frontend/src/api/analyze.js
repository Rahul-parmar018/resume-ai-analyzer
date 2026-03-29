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
