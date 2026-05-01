import React, { useEffect } from 'react';
import Spline from '@splinetool/react-spline';
import { attract } from '../utils/antigravity';

/**
 * Robot Component
 * 
 * Renders a high-fidelity 3D robot using Spline
 * with premium Antigravity interaction effects.
 */
export default function Robot() {
  useEffect(() => {
    // Initialize the antigravity "attract" interaction
    const cleanup = attract('.robot-container', {
      strength: 0.05,
      radius: 400 // Slightly larger radius for better feel
    });

    return () => cleanup();
  }, []);

  return (
    <div className="robot-container">
      <Spline 
        scene="https://prod.spline.design/uZsNxq6Oog3X0ms4/scene.splinecode" 
      />
    </div>
  );
}
