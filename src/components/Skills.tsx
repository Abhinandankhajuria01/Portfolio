import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const skills = [
  'Python', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js',
  'Flask', 'FastAPI', 'Tailwind CSS', 'AI APIs', 'OpenAI', 'Gemini',
  'PostgreSQL', 'Git',
];

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // Heading wipe-in
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current.children,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: headingRef.current,
              start: 'top 85%',
            },
          }
        );
      }

      // Skill pills: staggered spring pop-in from bottom with alternating y offsets
      if (containerRef.current) {
        const items = containerRef.current.querySelectorAll<HTMLElement>('.skill-pill');
        gsap.fromTo(
          items,
          (i) => ({
            opacity: 0,
            y: 40 + (i % 3) * 10,
            scale: 0.75,
            rotateZ: i % 2 === 0 ? -3 : 3,
          }),
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateZ: 0,
            duration: 0.6,
            stagger: {
              each: 0.06,
              from: 'start',
            },
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 82%',
            },
          }
        );

        // Subtle parallax wave on the container while scrolling
        items.forEach((item, idx) => {
          const yOffset = idx % 2 === 0 ? -12 : 12;
          gsap.to(item, {
            y: yOffset,
            ease: 'none',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 85%',
              end: 'bottom 15%',
              scrub: 1.5,
            },
          });
        });
      }
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section id="skills" ref={sectionRef} className="py-16 md:py-24 px-6 max-w-6xl mx-auto overflow-hidden bg-white">
      <div ref={headingRef} className="mb-10 md:mb-16 text-center">
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-[0.2em] mb-4 text-black">
          Core Skills
        </h2>
        <div className="w-16 h-1 bg-black mx-auto" />
      </div>

      <div
        ref={containerRef}
        className="flex flex-wrap justify-center gap-3 sm:gap-4 max-w-4xl mx-auto py-4"
      >
        {skills.map((skill, idx) => (
          <motion.div
            key={idx}
            className="skill-pill"
            whileHover={{
              scale: 1.12,
              y: -6,
              backgroundColor: '#000',
              color: '#fff',
              borderColor: '#000',
              boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
            }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            style={{
              padding: '10px 20px',
              border: '1px solid #d1d5db',
              color: '#4b5563',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontSize: '0.7rem',
              cursor: 'pointer',
              userSelect: 'none',
              display: 'inline-block',
            }}
          >
            {skill}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
