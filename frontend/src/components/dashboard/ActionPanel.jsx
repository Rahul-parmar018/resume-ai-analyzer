import React from 'react';
import { useNavigate } from 'react-router-dom';

import { 
  AlertCircle, 
  CheckCircle2, 
  TrendingUp, 
  Layout, 
  Zap,
  Target
} from "lucide-react";

const ActionPanel = ({ suggestions, missingSkills, role }) => {
  const navigate = useNavigate();

  const getSmartActions = () => {
    const actions = [];
    
    if (missingSkills?.length > 0) {
      actions.push({
        text: `Add ${missingSkills[0]} expertise`,
        sub: `Missing in 83% of top candidates for this role.`,
        icon: <Target className="w-5 h-5 text-rose-500" />,
        bg: "bg-rose-50"
      });
    }

    actions.push({
      text: "Quantify experience metrics",
      sub: "Add % and $ values to 3+ bullets to pass impact screeners.",
      icon: <TrendingUp className="w-5 h-5 text-blue-500" />,
      bg: "bg-blue-50"
    });

    actions.push({
      text: "Improve ATS structure",
      sub: "Your formatting score is currently 32% below benchmark.",
      icon: <Layout className="w-5 h-5 text-amber-500" />,
      bg: "bg-amber-50"
    });

    return actions.slice(0, 3);
  };

  const smartActions = getSmartActions();

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="font-headline text-xl font-bold text-slate-900 leading-none">Priority Fixes</h3>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-2 italic">Based on your latest scan</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center animate-bounce">
           <AlertCircle className="w-6 h-6" />
        </div>
      </div>

      <div className="space-y-4 flex-1">
        {smartActions.map((action, i) => (
          <div 
            key={i} 
            className="group flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-100 transition-all cursor-pointer"
            onClick={() => navigate('/app/optimize')}
          >
            <div className={`w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center transition-transform group-hover:scale-110 ${action.bg}`}>
              {action.icon}
            </div>
            <div className="flex-1">
              <p className="font-bold text-slate-900 group-hover:text-primary transition-colors text-sm">
                {action.text}
              </p>
              <p className="text-slate-400 text-[11px] mt-1 leading-normal font-medium">
                {action.sub}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={() => navigate('/app/optimize')}
        className="w-full mt-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group shadow-xl shadow-slate-900/10"
      >
        <span>Fix My Resume Automatically</span>
        <Zap className="w-4 h-4 text-emerald-400 group-hover:animate-pulse" />
      </button>
    </div>
  );
};

export default ActionPanel;
