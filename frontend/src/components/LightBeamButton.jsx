import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * LightBeamButton
 * 
 * A high-performance button with a rotating light beam border effect.
 * Adapted for Candidex AI Voxr theme (Purple/Obsidian).
 */
export function LightBeamButton({
  children,
  className,
  onClick,
  gradientColors = ["#a855f7", "#ec4899", "#a855f7"], // Purple -> Pink -> Purple
  ...props
}) {
  // Construct the gradient string dynamically based on props
  const gradientString = `conic-gradient(from var(--gradient-angle), transparent 0%, ${gradientColors[0]} 40%, ${gradientColors[1]} 50%, transparent 60%, transparent 100%)`;

  return (
    <>
      <style>{`
        @property --gradient-angle {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }
        @keyframes border-spin {
          from { --gradient-angle: 0deg; }
          to { --gradient-angle: 360deg; }
        }
        .animate-border-spin {
          animation: border-spin 2s linear infinite;
        }
      `}</style>

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onClick}
        className={cn(
          "group relative isolate overflow-hidden rounded-full bg-black/80 px-8 py-3 text-sm font-bold text-white transition-all hover:bg-black/90 backdrop-blur-md",
          "shadow-[0_0_20px_-5px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_-5px_rgba(168,85,247,0.6)]",
          "border border-white/10",
          className
        )}
        {...props}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>

        {/* Gradient Border Simulation */}
        <div
          className="absolute inset-0 -z-10 rounded-full p-[1px] animate-border-spin"
          style={{
            '--gradient-angle': '0deg',
            background: gradientString
          }}
        />

        {/* Inner Background (keeps text readable) */}
        <div className="absolute inset-[1px] -z-10 rounded-full bg-black/90" />

        {/* Shine Effect Overlay */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(168,85,247,0.15)_0%,transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </motion.button>
    </>
  );
}

export default LightBeamButton;
