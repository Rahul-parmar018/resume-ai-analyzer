import React from "react";

export default function PageLoader() {
  return (
    <div className="w-full h-64 flex flex-col items-center justify-center space-y-3">
      {/* Small CSS Spinner */}
      <div className="w-8 h-8 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
        Loading Component...
      </span>
    </div>
  );
}
