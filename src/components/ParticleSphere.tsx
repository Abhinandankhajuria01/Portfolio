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

    // Create particles with random 3D positions and wave phases
    const numParticles = 1000; // Balanced density for visibility and performance

    // Pre-allocate the projected array to avoid memory allocation every frame
    const particles: { 
      x: number; y: number; z: number; size: number; length: number; phaseX: number; phaseY: number;
    }[] = [];
    
    const projected: {
      screenX: number; screenY: number; scale: number; z: number; p: typeof particles[0];
    }[] = [];

    for (let i = 0; i < numParticles; i++) {
      const x = (Math.random() - 0.5) * 3;
      const y = (Math.random() - 0.5) * 3;
      const z = (Math.random() - 0.5) * 3;

      const p = {
        x,
        y,
        z,
        size: Math.random() * 2.5 + 1.5, 
        length: Math.random() * 0.015 + 0.005,
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
      };
      
      particles.push(p);
      projected.push({ screenX: 0, screenY: 0, scale: 0, z: 0, p });
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

    const applyMagneticPull = (x: number, y: number) => {
      if (currentMouseX === -1000) return { x, y, force: 0 };
      
      const dx = currentMouseX - x;
      const dy = currentMouseY - y;
      // Fast distance approximation to avoid Math.sqrt when far away
      if (Math.abs(dx) > 350 || Math.abs(dy) > 350) return { x, y, force: 0 };
      
      const dist = Math.sqrt(dx * dx + dy * dy);
      const magnetRadius = 350; 

      if (dist < magnetRadius && dist > 0) {
        const force = Math.pow((magnetRadius - dist) / magnetRadius, 2);
        const strength = 0.5; 
        return {
          x: x + dx * force * strength,
          y: y + dy * force * strength,
          force
        };
      }
      return { x, y, force: 0 };
    };

    const getWavePosition = (p: typeof particles[0], t: number, scrollOffset: number) => {
      const scrollWave = scrollOffset * 0.001;
      
      const waveX = Math.sin(p.y * 3 + t * 2 + p.phaseX) * 0.2 + Math.cos(p.z * 2 + t) * 0.1;
      const waveY = Math.cos(p.x * 3 + t * 1.5 + scrollWave + p.phaseY) * 0.2;
      const waveZ = Math.sin(p.x * 4 + t * 1.2) * 0.2;

      return {
        x: p.x + waveX,
        y: p.y + waveY,
        z: p.z + waveZ
      };
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      time += 0.002; 
      
      if (targetMouseX !== -1000) {
        currentMouseX += (targetMouseX - currentMouseX) * 0.08;
        currentMouseY += (targetMouseY - currentMouseY) * 0.08;
      } else {
        currentMouseX += (-1000 - currentMouseX) * 0.08;
        currentMouseY += (-1000 - currentMouseY) * 0.08;
      }

      const radius = Math.min(width, height) * 0.6;
      const focalLength = 350;
      
      // Update pre-allocated array (zero allocations = no garbage collection lag)
      for (let i = 0; i < numParticles; i++) {
        const p = particles[i];
        const proj = projected[i];
        
        const pos = getWavePosition(p, time, scrollYOffset);
        const cameraZ = pos.z * 200 + 250;
        
        proj.z = pos.z;
        proj.scale = focalLength / (focalLength + cameraZ);
        proj.screenX = width / 2 + pos.x * radius * proj.scale;
        proj.screenY = height / 2 + pos.y * radius * proj.scale;
      }

      // Sort in-place
      projected.sort((a, b) => b.z - a.z);

      ctx.lineCap = 'round';

      for (let i = 0; i < numParticles; i++) {
        const proj = projected[i];
        if (proj.z > 2.5) continue; 

        ctx.beginPath();

        const dt = proj.p.length;
        const futurePos = getWavePosition(proj.p, time + dt, scrollYOffset);
        
        const futureCameraZ = futurePos.z * 200 + 250;
        const scale2 = focalLength / (focalLength + futureCameraZ);
        
        const screenX2 = width / 2 + futurePos.x * radius * scale2;
        const screenY2 = height / 2 + futurePos.y * radius * scale2;

        const p1 = applyMagneticPull(proj.screenX, proj.screenY);
        const p2 = applyMagneticPull(screenX2, screenY2);

        let alpha = Math.max(0.2, Math.min(1, proj.scale * 1.8));
        const pullForce = Math.max(p1.force, p2.force);
        
        if (pullForce > 0) {
          const cyanIntensity = Math.min(1, pullForce * 2.5);
          ctx.strokeStyle = `rgba(${255 - cyanIntensity * 255}, ${255 - cyanIntensity * 15}, ${255}, ${alpha + pullForce})`;
          // Removed shadowBlur to fix severe rendering lag on some GPUs
        } else {
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        }

        ctx.lineWidth = proj.p.size * proj.scale;
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }

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
