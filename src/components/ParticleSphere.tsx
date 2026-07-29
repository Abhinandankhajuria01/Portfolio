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

    // Create a 60x60 grid for the wireframe terrain
    const cols = 60;
    const rows = 60;
    
    const points: { gridX: number; gridZ: number; }[] = [];
    const projected: { x: number; y: number; z: number; force: number }[] = [];

    for (let z = 0; z < rows; z++) {
      for (let x = 0; x < cols; x++) {
        points.push({
          gridX: (x - cols / 2) * 2.5, // Spread the grid
          gridZ: (z - rows / 2) * 2.5,
        });
        projected.push({ x: 0, y: 0, z: 0, force: 0 });
      }
    }

    let time = 0;
    let animationFrameId: number;

    let targetMouseX = -1000;
    let targetMouseY = -1000;
    let currentMouseX = -1000;
    let currentMouseY = -1000;
    let scrollYOffset = window.scrollY;

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

    const handleScroll = () => {
      scrollYOffset = window.scrollY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      time += 0.015; // Speed of the ocean waves
      
      // Smooth mouse tracking
      if (targetMouseX !== -1000) {
        currentMouseX += (targetMouseX - currentMouseX) * 0.08;
        currentMouseY += (targetMouseY - currentMouseY) * 0.08;
      } else {
        currentMouseX += (-1000 - currentMouseX) * 0.08;
        currentMouseY += (-1000 - currentMouseY) * 0.08;
      }

      const focalLength = 400;
      // Fixed rotation to look down at the terrain, plus slight shift on scroll
      const rotX = 1.25; 
      // Parallax rotation based on mouse X, gives a subtle 3D perspective shift
      const normMouseX = currentMouseX !== -1000 ? (currentMouseX / width) * 2 - 1 : 0;
      const rotY = scrollYOffset * 0.0002 + normMouseX * 0.15; 
      
      // 1. Calculate 3D positions and project to 2D
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        const proj = projected[i];
        
        // Base undulation (ocean waves)
        let y = Math.sin(p.gridX * 0.15 + time) * 1.5 + Math.cos(p.gridZ * 0.15 + time * 0.8) * 1.5;
        
        // 3D Rotations
        const x1 = p.gridX * Math.cos(rotY) - p.gridZ * Math.sin(rotY);
        const z1 = p.gridX * Math.sin(rotY) + p.gridZ * Math.cos(rotY);
        
        const y2 = y * Math.cos(rotX) - z1 * Math.sin(rotX);
        const z2 = y * Math.sin(rotX) + z1 * Math.cos(rotX);
        
        const cameraZ = z2 + 60; // Push terrain into the screen
        
        proj.z = cameraZ;
        proj.force = 0;

        if (cameraZ > 0) {
          const scale = focalLength / (focalLength + cameraZ);
          proj.x = width / 2 + x1 * 20 * scale;
          // Center terrain lower on the screen
          proj.y = height / 2 + 150 + y2 * 20 * scale; 
          
          // Apply magnetic crater effect in screen space
          if (currentMouseX !== -1000) {
            const dx = currentMouseX - proj.x;
            const dy = currentMouseY - proj.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const magnetRadius = 250;
            
            if (dist < magnetRadius) {
              const force = Math.pow((magnetRadius - dist) / magnetRadius, 2);
              proj.force = force;
              // Push points DOWN (bending the terrain) and slightly AWAY
              proj.y += force * 80 * scale;
              proj.x -= (dx / dist) * force * 20 * scale;
            }
          }
        }
      }

      // 2. Draw the base wireframe grid
      ctx.beginPath();
      // Horizontal lines
      for (let z = 0; z < rows; z++) {
        let first = true;
        for (let x = 0; x < cols; x++) {
          const proj = projected[z * cols + x];
          if (proj.z <= 0) { first = true; continue; }
          
          if (first) {
            ctx.moveTo(proj.x, proj.y);
            first = false;
          } else {
            ctx.lineTo(proj.x, proj.y);
          }
        }
      }
      // Vertical lines
      for (let x = 0; x < cols; x++) {
        let first = true;
        for (let z = 0; z < rows; z++) {
          const proj = projected[z * cols + x];
          if (proj.z <= 0) { first = true; continue; }
          
          if (first) {
            ctx.moveTo(proj.x, proj.y);
            first = false;
          } else {
            ctx.lineTo(proj.x, proj.y);
          }
        }
      }
      
      // Global gradient so it fades smoothly into the black distance (top of screen)
      const grad = ctx.createLinearGradient(0, height * 0.1, 0, height * 0.9);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0.25)');
      
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1;
      ctx.lineJoin = 'round';
      ctx.stroke();

      // 3. Draw the active/highlighted grid near the cursor
      ctx.beginPath();
      for (let z = 0; z < rows - 1; z++) {
        for (let x = 0; x < cols - 1; x++) {
          const idx = z * cols + x;
          const proj = projected[idx];
          
          if (proj.force > 0.05 && proj.z > 0) {
            const right = projected[idx + 1];
            const down = projected[idx + cols];
            
            if (right && right.z > 0) {
              ctx.moveTo(proj.x, proj.y);
              ctx.lineTo(right.x, right.y);
            }
            if (down && down.z > 0) {
              ctx.moveTo(proj.x, proj.y);
              ctx.lineTo(down.x, down.y);
            }
          }
        }
      }
      
      // Cyan highlight for the crater area
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.8)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />;
}
