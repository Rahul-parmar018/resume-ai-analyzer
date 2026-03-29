import React from "react";
import { Link } from "react-router-dom";

const EmptyState = ({ icon, title, description, actionLabel, actionLink, onAction }) => {
  return (
    <div className="flex flex-col items-center justify-center p-16 text-center bg-white rounded-3xl border border-gray-100 shadow-sm w-full max-w-2xl mx-auto my-8 border-dashed">
      <div className="w-20 h-20 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mb-6 shadow-inner pointer-events-none transition-transform hover:scale-105 duration-300">
        <span className="material-symbols-outlined text-4xl">{icon}</span>
      </div>
      
      <h3 className="font-heading text-2xl font-bold text-primary mb-2">{title}</h3>
      <p className="text-secondary mb-8 max-w-md mx-auto leading-relaxed">{description}</p>
      
      {actionLabel && (
        actionLink ? (
          <Link to={actionLink}>
            <button className="bg-primary text-white px-8 py-3 rounded-lg font-bold shadow-md shadow-primary/20 hover:bg-slate-800 transition-all hover:-translate-y-0.5 active:translate-y-0 text-sm">
              {actionLabel}
            </button>
          </Link>
        ) : (
          <button 
            onClick={onAction}
            className="bg-primary text-white px-8 py-3 rounded-lg font-bold shadow-md shadow-primary/20 hover:bg-slate-800 transition-all hover:-translate-y-0.5 active:translate-y-0 text-sm"
          >
            {actionLabel}
          </button>
        )
      )}
    </div>
  );
};

export default EmptyState;
