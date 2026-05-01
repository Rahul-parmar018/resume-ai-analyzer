import React, { useEffect, useRef, useState } from 'react';

/**
 * Interactive 3D Neon Tubes Background
 * Based on threejs-components TubesCursor by Kevin Levron
 * Adapted with Voxr-purple color scheme for Candidex AI
 */

const randomColors = (count) => {
  return new Array(count)
    .fill(0)
    .map(() => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'));
};

export default function TubesBackground({ 
  children, 
  className = '',
  enableClickInteraction = true 
}) {
  const canvasRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const tubesRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    let cleanup;

    const initTubes = async () => {
      if (!canvasRef.current) return;

      try {
        // Dynamic import from CDN — threejs-components neon tube cursor effect
        const module = await import(
          /* @vite-ignore */
          'https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js'
        );
        const TubesCursor = module.default;

        if (!mounted) return;

        const app = TubesCursor(canvasRef.current, {
          tubes: {
            // Purple/Violet Voxr color scheme
            colors: ["#a855f7", "#7c3aed", "#c084fc"],
            lights: {
              intensity: 200,
              colors: ["#a855f7", "#ec4899", "#6366f1", "#8b5cf6"]
            }
          }
        });

        tubesRef.current = app;
        setIsLoaded(true);
      } catch (error) {
        console.error("Failed to load TubesCursor:", error);
      }
    };

    initTubes();

    return () => {
      mounted = false;
      if (cleanup) cleanup();
    };
  }, []);

  const handleClick = () => {
    if (!enableClickInteraction || !tubesRef.current) return;
    
    const colors = randomColors(3);
    const lightsColors = randomColors(4);
    
    tubesRef.current.tubes.setColors(colors);
    tubesRef.current.tubes.setLightsColors(lightsColors);
  };

  return (
    <>
      {/* Fixed Background Canvas */}
      <div 
        className={`fixed inset-0 w-full h-full overflow-hidden bg-[#0a0a0f] z-0 ${className}`}
        onClick={handleClick}
      >
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full block"
          style={{ touchAction: 'none' }}
        />
      </div>
      
      {/* Content Layer */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </>
  );
}
