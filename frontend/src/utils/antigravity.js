/**
 * Antigravity Utility - Premium AI Interactions
 * 
 * Implements high-performance, subtle "attract" interactions
 * designed for the Robot component and other premium UI elements.
 */

export function attract(selector, options = {}) {
  const { 
    strength = 0.05, 
    radius = 200,
    lerp = 0.1 
  } = options;

  const elements = document.querySelectorAll(selector);
  if (!elements.length) return;

  const state = new Map();

  // Initialize state for each element
  elements.forEach(el => {
    state.set(el, {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0
    });
  });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;

    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = clientX - centerX;
      const dy = clientY - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      const elState = state.get(el);

      if (distance < radius) {
        // Subtle pull effect
        const power = (radius - distance) / radius;
        elState.targetX = dx * strength * power;
        elState.targetY = dy * strength * power;
      } else {
        elState.targetX = 0;
        elState.targetY = 0;
      }
    });
  };

  const animate = () => {
    elements.forEach(el => {
      const elState = state.get(el);
      
      // Interpolate current position to target
      elState.x += (elState.targetX - elState.x) * lerp;
      elState.y += (elState.targetY - elState.y) * lerp;

      // Apply transform - Using translate3d for hardware acceleration
      el.style.transform = `translate3d(${elState.x}px, ${elState.y}px, 0) translateY(-50%)`;
    });

    requestAnimationFrame(animate);
  };

  window.addEventListener('mousemove', handleMouseMove);
  const animationId = requestAnimationFrame(animate);

  // Return cleanup function
  return () => {
    window.removeEventListener('mousemove', handleMouseMove);
    cancelAnimationFrame(animationId);
  };
}
