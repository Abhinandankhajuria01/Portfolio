import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const failures = [
  {
    id: '01',
    title: 'The JEE Mains Setback',
    lesson: "Exams don't define your potential.",
    story:
      "I didn't clear my JEE Mains. At the time, it felt like the end of my engineering dreams. Instead, it pushed me to find alternative paths and realize that passion and skill matter more than a single test score.",
  },
  {
    id: '02',
    title: 'Class 12 Maths Compartment',
    lesson: 'Failure is an event, not a person.',
    story:
      'Getting a compartment in Class 12 Mathematics was a harsh reality check. But fighting through it taught me resilience and showed me that I could overcome academic hurdles with sheer persistence.',
  },
  {
    id: '03',
    title: 'The CGPA Struggle',
    lesson: 'Skills speak louder than grades.',
    story:
      "I've consistently struggled with maintaining a high CGPA in college. Rather than letting it defeat me, I pivoted my focus entirely to practical development, building real-world projects, and mastering AI integration.",
  },
  {
    id: '04',
    title: 'The Late Start',
    lesson: "It's never too late to begin.",
    story:
      'I realized very late what I wanted to do with my career and felt like I had absolutely zero skills compared to everyone else. The feeling of being "behind" was paralyzing, but it eventually became the ultimate catalyst for my growth.',
  },
  {
    id: '05',
    title: 'Internships vs Hello World',
    lesson: 'Run your own race.',
    story:
      "While my classmates were actively hunting for internships and landing roles, I was sitting in my room just starting to learn the basics of C++. It taught me to stop comparing my Chapter 1 to someone else's Chapter 10.",
  },
];

export default function MuseumOfFailures() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // Header block: scale in from small
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current.children,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: headerRef.current,
              start: 'top 82%',
            },
          }
        );
      }

      // Cards: stagger slide in from the side (right)
      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll<HTMLElement>('.failure-card');
        gsap.fromTo(
          cards,
          {
            opacity: 0,
            x: 50,
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.85,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 85%',
            },
          }
        );
      }
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-32 px-6 bg-[#0a0a0a] text-white relative overflow-hidden"
    >
      {/* Background glow */}
      <div
        className="bg-orb absolute top-1/4 right-1/4 w-[500px] h-[500px] opacity-10"
        style={{ background: '#7f1d1d' }}
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <div ref={headerRef} className="mb-10 md:mb-20 text-center">
          <p className="text-red-500 font-mono text-sm tracking-widest uppercase mb-4">Exhibit.04</p>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-[0.1em] mb-6">
            Museum of Failures.
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Every successful launch is built on a graveyard of terrible ideas, broken code, and bad decisions.
            Here are a few of my favorite missteps and what they taught me.
          </p>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed mt-4 italic">
            "Whatever I am today, my failures contributed just as much as my achievements. I couldn't be the
            person I am without them."
          </p>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
          {failures.map((failure) => (
            <motion.div
              key={failure.id}
              className="failure-card bg-[#111] border border-white/10 p-5 sm:p-8 transition-colors duration-500 group cursor-pointer relative overflow-hidden"
              whileHover={{
                scale: 1.04,
                y: -6,
                borderColor: 'rgba(239, 68, 68, 0.8)',
                boxShadow: '0 15px 35px rgba(239, 68, 68, 0.15)',
              }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 350, damping: 20 }}
            >
              {/* Shimmer sweep overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />

              <div className="text-4xl sm:text-5xl font-black text-white/5 mb-4 sm:mb-8 group-hover:text-red-500/20 transition-colors duration-500">
                {failure.id}
              </div>
              <h3 className="text-lg sm:text-xl font-bold uppercase tracking-wider mb-2 sm:mb-4 leading-snug">
                {failure.title}
              </h3>
              <p className="text-gray-500 mb-4 sm:mb-6 text-xs sm:text-sm leading-relaxed">
                {failure.story}
              </p>
              <div className="pt-4 sm:pt-6 border-t border-white/10">
                <p className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-red-500 mb-1">
                  Lesson Learned
                </p>
                <p className="text-xs sm:text-sm font-bold text-gray-300">{failure.lesson}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
