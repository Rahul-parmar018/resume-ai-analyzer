import React from 'react';

const InsightsBreakdown = ({ scores }) => {
  const breakdown = [
    { label: "Structure", score: scores?.ats || 60, icon: "format_align_left", color: "bg-blue-500" },
    { label: "Skills", score: scores?.skills || 20, icon: "code", color: "bg-emerald-500" },
    { label: "Experience", score: scores?.experience || 10, icon: "work_history", color: "bg-indigo-500" },
    { label: "Context", score: scores?.semantic || 30, icon: "psychology", color: "bg-amber-500" }
  ];

  return (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
      <h4 className="font-headline text-lg font-bold text-slate-900 mb-6">Resume Health Breakdown</h4>
      <div className="space-y-6">
        {breakdown.map((item) => (
          <div key={item.label} className="group">
            <div className="flex justify-between items-center mb-2">
               <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-slate-400">{item.icon}</span>
                  <span className="text-xs font-bold text-slate-600">{item.label}</span>
               </div>
               <span className="text-xs font-black text-slate-900">{item.score}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-50">
               <div 
                 className={`h-full ${item.color} transition-all duration-[1500ms] shadow-[0_0_8px_rgba(37,99,235,0.2)]`}
                 style={{ width: `${item.score}%` }}
               ></div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-100 italic">
         <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
           💡 Tip: Improving your <strong>{breakdown.sort((a,b)=>a.score-b.score)[0].label}</strong> score will provide the highest ROI for your next shortlist.
         </p>
      </div>
    </div>
  );
};

export default InsightsBreakdown;
