import { useEffect, useRef } from 'react';

export default function ParticleSphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    let animationFrameId: number;

    let targetMouseX = -1000;
    let targetMouseY = -1000;
    let currentMouseX = -1000;
    let currentMouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
      if (currentMouseX === -1000) {
        currentMouseX = targetMouseX;
        currentMouseY = targetMouseY;
      }
    };
    
    const handleMouseLeave = () => {
      targetMouseX = -1000;
      targetMouseY = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseleave', handleMouseLeave);

    // Create the massive fluid orbs
    const orbs = [
      // Cyan orb (Interactive, follows mouse)
      { x: width * 0.5, y: height * 0.5, vx: 0.8, vy: 0.6, radius: Math.max(width, height) * 0.6, color: [0, 240, 255], opacity: 0.6 },
      // White orb (Drifting slowly)
      { x: width * 0.2, y: height * 0.8, vx: -0.4, vy: -0.5, radius: Math.max(width, height) * 0.7, color: [255, 255, 255], opacity: 0.4 },
      // Dark gray orb (Drifting slowly)
      { x: width * 0.8, y: height * 0.2, vx: 0.5, vy: -0.3, radius: Math.max(width, height) * 0.8, color: [150, 150, 150], opacity: 0.5 }
    ];

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      // We want additive blending for a glowing aurora effect
      ctx.globalCompositeOperation = 'screen';

      // Smooth mouse tracking
      if (targetMouseX !== -1000) {
        currentMouseX += (targetMouseX - currentMouseX) * 0.05;
        currentMouseY += (targetMouseY - currentMouseY) * 0.05;
      } else {
        // Slowly drift back to center if mouse leaves
        currentMouseX += (width / 2 - currentMouseX) * 0.02;
        currentMouseY += (height / 2 - currentMouseY) * 0.02;
      }

      for (let i = 0; i < orbs.length; i++) {
        const orb = orbs[i];
        
        // Lazy drifting physics
        orb.x += orb.vx;
        orb.y += orb.vy;
        
        // Gentle bounce off screen edges (with a large buffer so they drift offscreen slightly)
        const buffer = orb.radius * 0.5;
        if (orb.x < -buffer || orb.x > width + buffer) orb.vx *= -1;
        if (orb.y < -buffer || orb.y > height + buffer) orb.vy *= -1;

        // The primary Cyan orb (index 0) acts as a flashlight and gently gravitates toward the cursor
        if (i === 0 && currentMouseX !== -1000) {
            orb.x += (currentMouseX - orb.x) * 0.03;
            orb.y += (currentMouseY - orb.y) * 0.03;
        }
        
        // Draw the massive soft orb using a radial gradient
        const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
        grad.addColorStop(0, `rgba(${orb.color[0]}, ${orb.color[1]}, ${orb.color[2]}, ${orb.opacity})`);
        grad.addColorStop(0.6, `rgba(${orb.color[0]}, ${orb.color[1]}, ${orb.color[2]}, ${orb.opacity * 0.6})`);
        grad.addColorStop(1, `rgba(${orb.color[0]}, ${orb.color[1]}, ${orb.color[2]}, 0)`);
        
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Reset composite operation
      ctx.globalCompositeOperation = 'source-over';

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />;
}
