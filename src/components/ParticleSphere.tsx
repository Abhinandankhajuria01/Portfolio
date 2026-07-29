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
    const numParticles = 900;
    const phi = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < numParticles; i++) {
      const y = 1 - (i / (numParticles - 1)) * 2; // y goes from 1 to -1
      const r = Math.sqrt(1 - y * y); // radius at y
      const theta = phi * i;

      const x = Math.cos(theta) * r;
      const z = Math.sin(theta) * r;

      particles.push({
        x,
        y,
        z,
        size: Math.random() * 1.5 + 0.5,
        length: Math.random() * 0.04 + 0.02, // Dash length factor
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
    
    // Add mouseleave to reset magnet when cursor leaves
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
      const magnetRadius = 250; // Radius of attraction

      if (dist < magnetRadius && dist > 0) {
        // Easing function for smooth pull (stronger closer to center)
        const force = Math.pow((magnetRadius - dist) / magnetRadius, 2);
        // Pull strength (max 50% of the distance to the cursor)
        const strength = 0.5;
        return {
          x: x + dx * force * strength,
          y: y + dy * force * strength
        };
      }
      return { x, y };
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      time += 0.002;

      // Make sphere responsive to screen size
      const radius = Math.min(width, height) * 0.45;
      const focalLength = 350;
      
      // Calculate dynamic rotation based on time + scroll
      const currentRotY = time + scrollYOffset * 0.0015;
      const currentRotX = -0.4 + scrollYOffset * 0.0003;
      const currentRotZ = 0.2;

      // Project and sort particles
      const projected = particles.map((p) => {
        // Rotate around Y axis
        const x1 = p.x * Math.cos(currentRotY) - p.z * Math.sin(currentRotY);
        const z1 = p.x * Math.sin(currentRotY) + p.z * Math.cos(currentRotY);

        // Rotate around X and Z axis slightly to tilt the sphere
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

      // Draw back to front
      projected.sort((a, b) => b.z - a.z);

      projected.forEach((proj) => {
        if (proj.z > 2) return; // Culling

        ctx.beginPath();

        // Calculate a trailing point to draw a dash slightly ahead in time
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

        // Apply magnetic pull to both start and end points of the dash
        const p1 = applyMagneticPull(proj.screenX, proj.screenY);
        const p2 = applyMagneticPull(screenX2, screenY2);

        const alpha = Math.max(0.1, Math.min(1, proj.scale * 1.5 - 0.2));

        // Color mapping based on screen X position (Blue to Orange/Red)
        const pct = Math.max(0, Math.min(1, p1.x / width));
        // Hue mapping: left (pct=0) is blue (240), right (pct=1) is red (0)
        const hue = 240 - pct * 240;

        ctx.strokeStyle = `hsla(${hue}, 90%, 65%, ${alpha})`;
        ctx.lineWidth = proj.p.size * proj.scale * 1.5;
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
