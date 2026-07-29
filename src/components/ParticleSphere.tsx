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
    const particles: { x: number; y: number; z: number; size: number; length: number; phaseX: number; phaseY: number }[] = [];
    const numParticles = 2000; // Massively increased density for better visibility

    for (let i = 0; i < numParticles; i++) {
      // Random coordinates between -1.5 and 1.5 (a larger volume)
      const x = (Math.random() - 0.5) * 3;
      const y = (Math.random() - 0.5) * 3;
      const z = (Math.random() - 0.5) * 3;

      particles.push({
        x,
        y,
        z,
        size: Math.random() * 3 + 1.5, // Much thicker particles (1.5 to 4.5px)
        length: Math.random() * 0.015 + 0.005,
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
      });
    }

    let time = 0;
    let animationFrameId: number;

    // Use a target mouse coordinate for smooth lerping
    let targetMouseX = -1000;
    let targetMouseY = -1000;
    let currentMouseX = -1000;
    let currentMouseY = -1000;
    let scrollYOffset = window.scrollY;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
      // If mouse is just entering, snap current to target immediately
      if (currentMouseX === -1000) {
        currentMouseX = targetMouseX;
        currentMouseY = targetMouseY;
      }
    };
    
    const handleMouseLeave = () => {
      targetMouseX = -1000;
      targetMouseY = -1000;
      // Allow current to smoothly lerp out of frame
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
      const dist = Math.sqrt(dx * dx + dy * dy);
      const magnetRadius = 350; // Slightly larger attraction field

      if (dist < magnetRadius && dist > 0) {
        // Smoother easing curve
        const force = Math.pow((magnetRadius - dist) / magnetRadius, 2);
        const strength = 0.5; // Stronger pull
        return {
          x: x + dx * force * strength,
          y: y + dy * force * strength,
          force
        };
      }
      return { x, y, force: 0 };
    };

    // Helper to calculate a particle's position in the wave field at a given time
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
      
      // Smoothly interpolate the magnetic center towards the real mouse position
      if (targetMouseX !== -1000) {
        currentMouseX += (targetMouseX - currentMouseX) * 0.08;
        currentMouseY += (targetMouseY - currentMouseY) * 0.08;
      } else {
        // Move current mouse out of bounds smoothly if left
        currentMouseX += (-1000 - currentMouseX) * 0.08;
        currentMouseY += (-1000 - currentMouseY) * 0.08;
      }

      const radius = Math.min(width, height) * 0.6;
      const focalLength = 350;
      
      const projected = particles.map((p) => {
        const pos = getWavePosition(p, time, scrollYOffset);

        const cameraZ = pos.z * 200 + 250;
        const scale = focalLength / (focalLength + cameraZ);

        const screenX = width / 2 + pos.x * radius * scale;
        const screenY = height / 2 + pos.y * radius * scale;

        return { screenX, screenY, scale, z: pos.z, p };
      });

      projected.sort((a, b) => b.z - a.z);

      projected.forEach((proj) => {
        if (proj.z > 2.5) return; 

        ctx.beginPath();

        const dt = proj.p.length;
        const futurePos = getWavePosition(proj.p, time + dt, scrollYOffset);
        
        const futureCameraZ = futurePos.z * 200 + 250;
        const scale2 = focalLength / (focalLength + futureCameraZ);
        
        const screenX2 = width / 2 + futurePos.x * radius * scale2;
        const screenY2 = height / 2 + futurePos.y * radius * scale2;

        const p1 = applyMagneticPull(proj.screenX, proj.screenY);
        const p2 = applyMagneticPull(screenX2, screenY2);

        // Substantially increased base opacity to make them clearly visible
        let alpha = Math.max(0.2, Math.min(1, proj.scale * 1.8));
        
        const pullForce = Math.max(p1.force, p2.force);
        
        if (pullForce > 0) {
          const cyanIntensity = Math.min(1, pullForce * 2.5);
          ctx.strokeStyle = `rgba(${255 - cyanIntensity * 255}, ${255 - cyanIntensity * 15}, ${255}, ${alpha + pullForce})`;
          ctx.shadowBlur = cyanIntensity * 15;
          ctx.shadowColor = '#00f0ff';
        } else {
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.shadowBlur = 0;
        }

        ctx.lineWidth = proj.p.size * proj.scale;
        ctx.lineCap = 'round';

        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      });

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
