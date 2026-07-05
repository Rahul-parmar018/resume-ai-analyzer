import React from "react";

export default function FullScreenLoader() {
  return (
    <div className="fixed inset-0 z-[100] bg-[#0A0A0B] flex flex-col items-center justify-center space-y-4">
      <div className="relative flex items-center justify-center">
        {/* Outer glowing ring */}
        <div className="w-16 h-16 rounded-full border-4 border-purple-500/10 border-t-purple-500 animate-spin"></div>
        {/* Innermost static branding */}
        <div className="absolute w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/30">
          <span className="text-white font-black text-sm italic tracking-tighter">C</span>
        </div>
      </div>
      <span className="text-xs font-black uppercase tracking-widest text-slate-400 animate-pulse">
        Stabilizing Connection...
      </span>
    </div>
  );
}
