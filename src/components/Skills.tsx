import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const skills = [
  'Python', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 
  'Flask', 'FastAPI', 'Tailwind CSS', 'AI APIs', 'OpenAI', 'Gemini', 
  'PostgreSQL', 'Git'
];

export default function Skills() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const items = containerRef.current.querySelectorAll('.skill-pill');
    items.forEach((item, idx) => {
      // Parallax wave offset on scroll
      const yOffset = idx % 2 === 0 ? -20 : 20;
      gsap.fromTo(item,
        { y: yOffset, opacity: 0.6 },
        {
          y: -yOffset,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            end: "bottom 15%",
            scrub: 1,
          }
        }
      );
    });
  }, []);

  return (
    <section id="skills" className="py-16 md:py-24 px-6 max-w-6xl mx-auto overflow-hidden bg-white">
      <div className="mb-10 md:mb-16 text-center">
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-[0.2em] mb-4 text-black">Core Skills</h2>
        <div className="w-16 h-1 bg-black mx-auto"></div>
      </div>

      <div 
        ref={containerRef}
        className="flex flex-wrap justify-center gap-3 sm:gap-4 max-w-4xl mx-auto py-4"
      >
        {skills.map((skill, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.08, y: -4, backgroundColor: "#000", color: "#fff", borderColor: "#000" }}
            whileTap={{ scale: 0.93 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="skill-pill px-4 py-2 sm:px-6 sm:py-3 border border-gray-300 text-gray-600 font-bold uppercase tracking-widest text-xs transition-colors cursor-pointer select-none shadow-sm hover:shadow-md"
          >
            {skill}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
