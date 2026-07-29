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

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse tracking
      if (targetMouseX !== -1000) {
        currentMouseX += (targetMouseX - currentMouseX) * 0.1;
        currentMouseY += (targetMouseY - currentMouseY) * 0.1;
      } else {
        currentMouseX += (-1000 - currentMouseX) * 0.1;
        currentMouseY += (-1000 - currentMouseY) * 0.1;
      }

      // Grid settings
      const spacing = 45; // Space between crosses
      const cols = Math.ceil(width / spacing) + 1;
      const rows = Math.ceil(height / spacing) + 1;
      
      const offsetX = (width - (cols - 1) * spacing) / 2;
      const offsetY = (height - (rows - 1) * spacing) / 2;
      
      // 1. Draw base grid (faint white/gray)
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const baseX = offsetX + c * spacing;
          const baseY = offsetY + r * spacing;
          
          let x = baseX;
          let y = baseY;
          const size = 4;
          
          const dx = currentMouseX - baseX;
          const dy = currentMouseY - baseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const magnetRadius = 250;
          
          let force = 0;
          if (dist < magnetRadius) {
            force = Math.pow((magnetRadius - dist) / magnetRadius, 2);
          }
          
          // Only draw in the base path if it's NOT strongly affected by the mouse
          if (force < 0.02) {
             ctx.moveTo(x - size, y);
             ctx.lineTo(x + size, y);
             ctx.moveTo(x, y - size);
             ctx.lineTo(x, y + size);
          }
        }
      }
      ctx.stroke();

      // 2. Draw highlighted/active crosses (Cyan + rotated + pushed away)
      if (currentMouseX !== -1000) {
        ctx.beginPath();
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const baseX = offsetX + c * spacing;
            const baseY = offsetY + r * spacing;
            
            const dx = currentMouseX - baseX;
            const dy = currentMouseY - baseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const magnetRadius = 250;
            
            if (dist < magnetRadius) {
              const force = Math.pow((magnetRadius - dist) / magnetRadius, 2);
              
              if (force >= 0.02) {
                  // Push away slightly
                  const pushDist = force * 20;
                  const x = baseX - (dx / dist) * pushDist;
                  const y = baseY - (dy / dist) * pushDist;
                  
                  // Scale up based on force
                  const size = 4 + force * 6;
                  
                  // Rotate based on force (up to 45 degrees so it looks like an 'x' when close)
                  const angle = force * Math.PI / 4;
                  const cosA = Math.cos(angle);
                  const sinA = Math.sin(angle);
                  
                  // Calculate rotated horizontal line of the '+'
                  const hx1 = x - size * cosA;
                  const hy1 = y - size * sinA;
                  const hx2 = x + size * cosA;
                  const hy2 = y + size * sinA;
                  
                  // Calculate rotated vertical line of the '+'
                  const vx1 = x + size * sinA;
                  const vy1 = y - size * cosA;
                  const vx2 = x - size * sinA;
                  const vy2 = y + size * cosA;
                  
                  ctx.moveTo(hx1, hy1);
                  ctx.lineTo(hx2, hy2);
                  ctx.moveTo(vx1, vy1);
                  ctx.lineTo(vx2, vy2);
              }
            }
          }
        }
        
        // Draw all active crosses using a smooth radial gradient centered on the mouse!
        const grad = ctx.createRadialGradient(currentMouseX, currentMouseY, 0, currentMouseX, currentMouseY, 250);
        grad.addColorStop(0, 'rgba(0, 240, 255, 1)');
        grad.addColorStop(0.5, 'rgba(0, 240, 255, 0.4)');
        grad.addColorStop(1, 'rgba(0, 240, 255, 0)');
        
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

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
