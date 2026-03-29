import { useState, useEffect } from "react";
import { useAuth } from "../components/AuthProvider";
import { auth } from "../firebase";
import { saveAnalysis, getAnalysisHistory } from "../db";

export default function Dashboard() {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [jobDesc, setJobDesc] = useState(""); // Dynamic JD support

  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user]);

  const loadHistory = async () => {
    try {
      const data = await getAnalysisHistory(user.uid);
      setHistory(data);
    } catch (err) {
      console.error("Failed to load history", err);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setErrorMsg("");
    }
  };

  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setErrorMsg("");
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setAnalyzing(true);
    setErrorMsg("");
    
    try {
      const token = await auth.currentUser.getIdToken();
      
      const formData = new FormData();
      formData.append("resume", file);
      if (jobDesc.trim()) {
        formData.append("job_description", jobDesc);
      }
      
      // Update to full URL as requested for cross-origin communication
      const res = await fetch("http://127.0.0.1:8000/api/analyze/", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData,
      });

      const data = await res.json();
      console.log(data); // As requested for testing

      if (!res.ok) {
        throw new Error(data.error || "Failed to analyze resume.");
      }

      setResults({
        score: data.score || 0,
        feedback: data.feedback || "Analysis completed successfully.",
        skills_found: data.skills_found || [],
        missing_skills: data.missing_skills || []
      });

      // Save to Firestore (maintaining existing persistence logic)
      await saveAnalysis({
        user_id: user.uid,
        name: file.name,
        score: data.score || 0,
        feedback: data.feedback || "Analysis completed successfully.",
        date: new Date().toLocaleDateString()
      });

      await loadHistory();

    } catch (err) {
      console.error("Analysis Error:", err);
      setErrorMsg(err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome back</h1>
        <p>Let's get your resume ready for top recruiters.</p>
      </div>

      {errorMsg && <div className="error-msg">{errorMsg}</div>}

      {/* STEP 1: JOB DESCRIPTION */}
      <section className="dashboard-section">
        <h2 className="section-title">Step 1: Target Job Description</h2>
        <div style={{ backgroundColor: 'var(--card-bg)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border)' }}>
          <label style={{ color: 'var(--brand)', display: 'block', marginBottom: '12px', fontSize: '15px', fontWeight: '600' }}>
            Paste the requirements for the job you are targeting:
          </label>
          <textarea
            className="job-desc-input"
            style={{ 
              width: '100%', 
              height: '120px', 
              backgroundColor: 'var(--bg)', 
              border: '1px solid var(--border)', 
              borderRadius: '10px', 
              padding: '14px', 
              fontSize: '14px', 
              color: 'var(--heading)',
              resize: 'none'
            }}
            placeholder="e.g. Looking for a Python Django developer with experience in AWS, Docker, and React..."
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
          />
        </div>
      </section>

      {/* STEP 2: UPLOAD RESUME */}
      <section className="dashboard-section">
        <h2 className="section-title">Step 2: Upload Your Resume</h2>
        <div 
          className="upload-box"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => document.getElementById("resume-upload").click()}
        >
          <div className="upload-icon">📄</div>
          <h3 className="upload-title">
            {file ? file.name : "Drag & drop your resume here"}
          </h3>
          <p className="upload-subtitle">
            {file ? "Ready to analyze!" : "or click to browse (PDF, DOCX)"}
          </p>
          
          <input 
            type="file" 
            id="resume-upload" 
            style={{ display: "none" }} 
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
          />

          <button 
            className="btn btn-brand" 
            style={{ padding: "14px 28px", fontSize: "16px", marginTop: '20px' }}
            onClick={(e) => {
              if (file) {
                e.stopPropagation();
                handleAnalyze();
              }
            }}
            disabled={!file || analyzing}
          >
            {analyzing ? "Analyzing Document..." : "Analyze Resume"}
          </button>
        </div>
      </section>

      {/* SECTION 2: RESULTS (Show only if analysis is complete) */}
      {results && (
        <section className="dashboard-section sa in">
          <h2 className="section-title" style={{ color: "var(--brand)" }}>Analysis Complete</h2>
          <div className="history-card" style={{ display: 'block', padding: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
              <div className="score-badge" style={{ fontSize: '24px', padding: '12px 20px' }}>
                {results.score}% ATS Match
              </div>
              <p style={{ color: "var(--heading)", fontSize: "16px", margin: 0 }}>
                {results.feedback}
              </p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
              {results.matched_skills && results.matched_skills.length > 0 && (
                <div>
                  <h4 style={{ color: "var(--brand)", marginBottom: "10px" }}>Matched Requirements:</h4>
                  <ul style={{ color: "var(--muted)", margin: 0, paddingLeft: "20px" }}>
                    {results.matched_skills.map((skill, idx) => (
                      <li key={idx} style={{ marginBottom: "6px" }}>{skill}</li>
                    ))}
                  </ul>
                </div>
              )}
              {results.missing_skills && results.missing_skills.length > 0 && (
                <div>
                  <h4 style={{ color: "var(--accent)", marginBottom: "10px" }}>Critical Missing Skills:</h4>
                  <ul style={{ color: "var(--muted)", margin: 0, paddingLeft: "20px" }}>
                    {results.missing_skills.map((skill, idx) => (
                      <li key={idx} style={{ marginBottom: "6px", color: "var(--error)" }}>{skill}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {results.suggestions && results.suggestions.length > 0 && (
              <div style={{ marginTop: '30px', padding: '20px', backgroundColor: 'rgba(74, 144, 226, 0.1)', borderRadius: '12px', borderLeft: '4px solid #4A90E2' }}>
                <h4 style={{ color: "#4A90E2", marginBottom: "12px" }}>🚀 Actionable Recommendations:</h4>
                <ul style={{ color: "var(--muted)", margin: 0, paddingLeft: "20px" }}>
                  {results.suggestions.map((suggestion, idx) => (
                    <li key={idx} style={{ marginBottom: "8px" }}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* SECTION 3: HISTORY */}
      <section className="dashboard-section">
        <h2 className="section-title">Previous Resumes</h2>
        <div className="history-list">
          {history.length === 0 ? (
            <p style={{ color: "var(--muted)" }}>No past analyses found. Upload your first resume above!</p>
          ) : (
            history.map((item) => (
              <div className="history-card" key={item.id}>
                <div className="history-info">
                  <h4>{item.name || "Resume Analysis"}</h4>
                  <p style={{ margin: "4px 0 8px 0", color: "var(--muted)", fontSize: "14px", lineBreak: "anywhere" }}>
                    {item.feedback?.substring(0, 80)}...
                  </p>
                  <p style={{ fontSize: "12px", opacity: 0.7 }}>Analyzed on {item.date}</p>
                </div>
                <div className="history-score">
                  <span className="score-badge">{item.score || 0}%</span>
                  <button className="btn btn-outline" style={{ padding: "6px 14px", fontSize: "13px" }}>
                    View
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
