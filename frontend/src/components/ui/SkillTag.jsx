import React from "react";

const SkillTag = ({ label, status = "neutral", details = null }) => {
  let styleClasses = "bg-gray-100 text-gray-700 border-gray-200";
  let icon = null;

  if (status === "matched") {
    styleClasses = "bg-green-50 text-green-700 border-green-200 shadow-sm shadow-green-100/50";
    icon = <span className="material-symbols-outlined text-[14px] text-green-600 mr-1.5 align-middle">check_circle</span>;
  } else if (status === "missing") {
    styleClasses = "bg-red-50 text-red-600 border-red-200 shadow-sm shadow-red-100/50";
    icon = <span className="material-symbols-outlined text-[14px] text-red-500 mr-1.5 align-middle">error</span>;
  } else if (status === "bonus" || status === "partial") {
    styleClasses = "bg-yellow-50 text-yellow-700 border-yellow-200 shadow-sm shadow-yellow-100/50";
    icon = <span className="material-symbols-outlined text-[14px] text-yellow-600 mr-1.5 align-middle">star</span>;
  }

  return (
    <div className={`group inline-flex items-center border px-3 py-1.5 rounded-full text-sm font-medium transition-all hover:brightness-95 cursor-default relative overflow-visible ${styleClasses}`}>
      {icon}
      <span>{label}</span>
      
      {/* Tooltip for extra context if provided */}
      {details && (
        <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-primary text-white text-xs rounded-lg p-2 -top-10 left-1/2 -translate-x-1/2 min-w-[150px] text-center pointer-events-none z-50 whitespace-nowrap shadow-xl">
          {details}
          <div className="absolute w-2 h-2 bg-primary rotate-45 -bottom-1 left-1/2 -translate-x-1/2"></div>
        </div>
      )}
    </div>
  );
};

export default SkillTag;
