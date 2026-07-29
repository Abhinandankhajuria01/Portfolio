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

    // Create particles using Fibonacci sphere distribution
    const particles: { x: number; y: number; z: number; size: number; length: number }[] = [];
    const numParticles = 700; // Reduced density for a cleaner, more minimalist look
    const phi = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < numParticles; i++) {
      const y = 1 - (i / (numParticles - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = phi * i;

      const x = Math.cos(theta) * r;
      const z = Math.sin(theta) * r;

      particles.push({
        x,
        y,
        z,
        size: Math.random() * 0.8 + 0.2, // Thinner lines
        length: Math.random() * 0.03 + 0.015, // Slightly shorter dashes
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

    // Helper for mouse attraction (magnetic pull in 2D space)
    const applyMagneticPull = (x: number, y: number) => {
      const dx = mouseX - x;
      const dy = mouseY - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const magnetRadius = 300; // Radius of attraction

      if (dist < magnetRadius && dist > 0) {
        const force = Math.pow((magnetRadius - dist) / magnetRadius, 2);
        const strength = 0.4;
        return {
          x: x + dx * force * strength,
          y: y + dy * force * strength,
          force // Return force to use for color/glow
        };
      }
      return { x, y, force: 0 };
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      time += 0.0015; // Slightly slower, more elegant rotation

      const radius = Math.min(width, height) * 0.45;
      const focalLength = 350;
      
      const currentRotY = time + scrollYOffset * 0.001;
      const currentRotX = -0.3 + scrollYOffset * 0.0002; // Less aggressive tilt
      const currentRotZ = 0.1;

      const projected = particles.map((p) => {
        const x1 = p.x * Math.cos(currentRotY) - p.z * Math.sin(currentRotY);
        const z1 = p.x * Math.sin(currentRotY) + p.z * Math.cos(currentRotY);

        const y2 = p.y * Math.cos(currentRotX) - z1 * Math.sin(currentRotX);
        const z2_tmp = p.y * Math.sin(currentRotX) + z1 * Math.cos(currentRotX);

        const x2 = x1 * Math.cos(currentRotZ) - y2 * Math.sin(currentRotZ);
        const y3 = x1 * Math.sin(currentRotZ) + y2 * Math.cos(currentRotZ);
        const z2 = z2_tmp;

        const scale = focalLength / (focalLength + z2 * 200);

        const screenX = width / 2 + x2 * radius * scale;
        const screenY = height / 2 + y3 * radius * scale;

        return { screenX, screenY, scale, z: z2, p };
      });

      projected.sort((a, b) => b.z - a.z);

      projected.forEach((proj) => {
        if (proj.z > 2) return; 

        ctx.beginPath();

        const dt = proj.p.length;
        const rotY2 = currentRotY + dt;
        const x1_2 = proj.p.x * Math.cos(rotY2) - proj.p.z * Math.sin(rotY2);
        const z1_2 = proj.p.x * Math.sin(rotY2) + proj.p.z * Math.cos(rotY2);

        const y2_2 = proj.p.y * Math.cos(currentRotX) - z1_2 * Math.sin(currentRotX);
        const z2_tmp_2 = proj.p.y * Math.sin(currentRotX) + z1_2 * Math.cos(currentRotX);

        const x2_2 = x1_2 * Math.cos(currentRotZ) - y2_2 * Math.sin(currentRotZ);
        const y3_2 = x1_2 * Math.sin(currentRotZ) + y2_2 * Math.cos(currentRotZ);
        const z2_2 = z2_tmp_2;

        const scale2 = focalLength / (focalLength + z2_2 * 200);
        const screenX2 = width / 2 + x2_2 * radius * scale2;
        const screenY2 = height / 2 + y3_2 * radius * scale2;

        const p1 = applyMagneticPull(proj.screenX, proj.screenY);
        const p2 = applyMagneticPull(screenX2, screenY2);

        // Base opacity is lower for a subtle background feel
        let alpha = Math.max(0.05, Math.min(1, proj.scale * 0.8 - 0.2));
        
        // If the particle is being pulled by the cursor, boost its opacity and give it a cyan glow
        const pullForce = Math.max(p1.force, p2.force);
        
        if (pullForce > 0) {
          // Transition to cyan (#00f0ff) when pulled, otherwise stay sleek white/gray
          const cyanIntensity = Math.min(1, pullForce * 2);
          ctx.strokeStyle = `rgba(${255 - cyanIntensity * 255}, ${255 - cyanIntensity * 15}, ${255}, ${alpha + pullForce * 0.5})`;
          ctx.shadowBlur = cyanIntensity * 10;
          ctx.shadowColor = '#00f0ff';
        } else {
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.shadowBlur = 0;
        }

        ctx.lineWidth = proj.p.size * proj.scale; // Thinner, sharper lines
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
