import React from "react";

/**
 * Reusable Empty State UI component for table, card lists, and charts.
 * 
 * @param {React.ReactNode} icon - Lucide-react or symbol icon
 * @param {string} title - Main header statement
 * @param {string} description - Clarifying subtitle message
 * @param {React.ReactNode} action - Primary CTA action button (optional)
 */
export default function EmptyState({ icon, title, description, action }) {
  return (
    <div 
      className="flex flex-col items-center justify-center p-8 text-center bg-[#0B0F1A] border border-white/5 rounded-3xl relative overflow-hidden"
      role="region"
      aria-label={title}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.01] to-transparent pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col items-center space-y-6 max-w-sm">
        {/* Icon wrapper */}
        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 text-slate-400">
          {icon}
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h3 className="text-lg font-black tracking-tight text-white">{title}</h3>
          <p className="text-slate-400 text-xs leading-relaxed">{description}</p>
        </div>

        {/* CTA */}
        {action && (
          <div className="pt-2">
            {action}
          </div>
        )}
      </div>
    </div>
  );
}
