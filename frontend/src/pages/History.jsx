import { useState, useEffect } from "react";
import { useAuth } from "../components/AuthProvider";
import { getAnalysisHistory } from "../db";
import { useNavigate } from "react-router-dom";

import PageHeader from "../components/ui/PageHeader";
import DataTable from "../components/ui/DataTable";
import EmptyState from "../components/ui/EmptyState";

const History = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getAnalysisHistory(user.uid)
        .then(setHistory)
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  const columns = ["Candidate File", "Processed On", "Match Score", "Actions"];

  const renderRow = (row) => (
    <>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-red-50 text-red-500 flex items-center justify-center border border-red-100">
            <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
          </div>
          <span className="font-bold text-primary">{row.file_name}</span>
        </div>
      </td>
      <td className="px-6 py-4 text-secondary text-sm">{row.date}</td>
      <td className="px-6 py-4">
        {row.score ? (
          <span className={`font-heading font-bold ${row.score >= 80 ? 'text-accent' : 'text-primary'}`}>{row.score}%</span>
        ) : (
          <span className="text-slate-300">-</span>
        )}
      </td>
      <td className="px-6 py-4 text-right">
        <button 
          onClick={() => navigate("/app/analyze")}
          className="text-xs font-bold text-primary bg-slate-50 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-white hover:border-primary transition-all flex items-center gap-1 w-max ml-auto"
        >
          <span className="material-symbols-outlined text-[14px]">refresh</span> Re-analyze
        </button>
      </td>
    </>
  );

  return (
    <div className="space-y-6 pb-8">
      
      <PageHeader 
        title="Analysis History"
        subtitle="Review and re-evaluate past candidate reports processed by ResumeAI."
        actionLabel="New Analysis"
        actionIcon="add"
        actionLink="/app/analyze"
      />

      {loading ? (
        <div className="flex justify-center p-20">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : history.length === 0 ? (
        <EmptyState 
          icon="history_toggle_off"
          title="No history yet"
          description="It looks like you haven't processed any resumes with the intelligence engine yet. Upload a candidate to see their historical record here."
          actionLabel="Go to Analyzer"
          actionLink="/app/analyze"
        />
      ) : (
        <DataTable 
          columns={columns}
          data={history}
          renderRow={renderRow}
        />
      )}

    </div>
  );
};

export default History;
