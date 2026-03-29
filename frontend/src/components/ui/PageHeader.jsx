import React from "react";
import { Link } from "react-router-dom";

const PageHeader = ({ title, subtitle, actionLabel, actionIcon, actionLink, onAction, secondaryActionLabel, secondaryActionIcon, onSecondaryAction }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 w-full border-b border-gray-100 pb-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-primary tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-secondary mt-1">{subtitle}</p>}
      </div>
      
      <div className="flex gap-3">
        {secondaryActionLabel && (
          <button 
            onClick={onSecondaryAction}
            className="px-5 py-2.5 bg-white border border-gray-200 text-primary font-bold text-sm rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2"
          >
            {secondaryActionIcon && <span className="material-symbols-outlined text-[18px]">{secondaryActionIcon}</span>}
            {secondaryActionLabel}
          </button>
        )}

        {actionLabel && (
          actionLink ? (
            <Link to={actionLink}>
              <button className="px-5 py-2.5 bg-primary text-white font-bold text-sm rounded-xl hover:bg-slate-800 transition-all shadow-md shadow-primary/20 flex items-center gap-2 hover:-translate-y-0.5">
                {actionIcon && <span className="material-symbols-outlined text-[18px]">{actionIcon}</span>}
                {actionLabel}
              </button>
            </Link>
          ) : (
            <button 
              onClick={onAction}
              className="px-5 py-2.5 bg-primary text-white font-bold text-sm rounded-xl hover:bg-slate-800 transition-all shadow-md shadow-primary/20 flex items-center gap-2 hover:-translate-y-0.5"
            >
              {actionIcon && <span className="material-symbols-outlined text-[18px]">{actionIcon}</span>}
              {actionLabel}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default PageHeader;
