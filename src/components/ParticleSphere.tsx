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
    const numParticles = 800; // Good density for a random cloud

    for (let i = 0; i < numParticles; i++) {
      // Random coordinates between -1 and 1 (a cube volume)
      const x = (Math.random() - 0.5) * 2;
      const y = (Math.random() - 0.5) * 2;
      const z = (Math.random() - 0.5) * 2;

      particles.push({
        x,
        y,
        z,
        size: Math.random() * 2 + 1, // Thicker particles (1 to 3px)
        length: Math.random() * 0.015 + 0.005, // Shorter dashes
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
      });
    }

    let time = 0;
    let animationFrameId: number;

    let mouseX = -1000;
    let mouseY = -1000;
    let scrollYOffset = window.scrollY;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    
    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    const handleScroll = () => {
      scrollYOffset = window.scrollY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });

    const applyMagneticPull = (x: number, y: number) => {
      const dx = mouseX - x;
      const dy = mouseY - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const magnetRadius = 300; 

      if (dist < magnetRadius && dist > 0) {
        const force = Math.pow((magnetRadius - dist) / magnetRadius, 2);
        const strength = 0.4;
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
      // Wave parameters influenced by their original position and time
      // Scroll moves the wave vertically
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

      time += 0.002; // Speed of the wave undulation

      const radius = Math.min(width, height) * 0.6; // Spread of the cloud
      const focalLength = 350;
      
      const projected = particles.map((p) => {
        // Calculate position at current time
        const pos = getWavePosition(p, time, scrollYOffset);

        // Push the cloud back slightly so z doesn't cross the camera
        const cameraZ = pos.z * 200 + 250;
        const scale = focalLength / (focalLength + cameraZ);

        const screenX = width / 2 + pos.x * radius * scale;
        const screenY = height / 2 + pos.y * radius * scale;

        return { screenX, screenY, scale, z: pos.z, p };
      });

      projected.sort((a, b) => b.z - a.z);

      projected.forEach((proj) => {
        if (proj.z > 2) return; 

        ctx.beginPath();

        // Calculate a trailing point slightly ahead in time to draw a short dash along the flow
        const dt = proj.p.length;
        const futurePos = getWavePosition(proj.p, time + dt, scrollYOffset);
        
        const futureCameraZ = futurePos.z * 200 + 250;
        const scale2 = focalLength / (focalLength + futureCameraZ);
        
        const screenX2 = width / 2 + futurePos.x * radius * scale2;
        const screenY2 = height / 2 + futurePos.y * radius * scale2;

        const p1 = applyMagneticPull(proj.screenX, proj.screenY);
        const p2 = applyMagneticPull(screenX2, screenY2);

        // Base opacity based on depth scale
        let alpha = Math.max(0.05, Math.min(1, proj.scale * 0.8));
        
        // Boost opacity and add cyan glow if magnetically pulled
        const pullForce = Math.max(p1.force, p2.force);
        
        if (pullForce > 0) {
          const cyanIntensity = Math.min(1, pullForce * 2);
          ctx.strokeStyle = `rgba(${255 - cyanIntensity * 255}, ${255 - cyanIntensity * 15}, ${255}, ${alpha + pullForce * 0.5})`;
          ctx.shadowBlur = cyanIntensity * 10;
          ctx.shadowColor = '#00f0ff';
        } else {
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.shadowBlur = 0;
        }

        ctx.lineWidth = proj.p.size * proj.scale; // Thicker lines based on new size logic
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
