import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const milestones = [
  { title: '2018 — Discovered Programming', desc: 'Joined WhiteHat Jr. in 8th grade and explored coding for the first time. Even then, I was deeply fascinated by computers, gaming, and technology.' },
  { title: 'Focused on School', desc: 'Stepped away from programming to concentrate on academics. Although I stopped coding completely, my curiosity about technology never disappeared.' },
  { title: 'Started Again in College', desc: 'Entered Computer Science Engineering and rediscovered the passion for building. Despite setbacks and unexpected challenges that delayed progress, I decided to start from scratch and pursue technology seriously.' },
  { title: 'Learning Without Mentors', desc: 'Most of the journey was self-taught. Starting over and navigating everything without mentors became one of the biggest challenges, but it also taught me resilience and independent learning.' },
  { title: 'Discovered AI', desc: 'Curiosity led me to AI through ChatGPT, and later Gemini. The possibilities of intelligent systems sparked a deeper interest in technology and opened the door to creating more impactful products.' },
  { title: 'Built My First AI Project', desc: 'Developed an AI chatbot as a college project. It became the first major step toward turning ideas into real applications.' },
  { title: 'Built ProgressOS', desc: 'Inspired by gaming and personal growth, I created ProgressOS — a gamified productivity platform designed to make achieving goals exciting and rewarding while tracking long-term progress.' },
  { title: 'Built Planix', desc: 'After hearing about the struggles contractors faced managing projects through Excel sheets, WhatsApp chats, and notes, I saw an opportunity to solve a real-world problem. Inspired by my friend, who works in construction and dreams of becoming a contractor himself, I built Planix — an AI-powered construction management platform designed to simplify project management.' },
  { title: 'Built RydMate', desc: 'Engineered RydMate — an enterprise-grade, real-time campus transportation and AI telemetry platform for IIT Jammu. Combining high-concurrency GPS tracking, AI demand forecasting, and interactive vector mapping to revolutionize campus mobility.' },
  { title: 'Present Day', desc: 'Today, I am a Computer Science student, Full Stack AI Developer, builder, entrepreneur, and lifelong learner. I enjoy solving real-world problems, building products, and constantly exploring new technologies.' },
  { title: 'Looking Ahead', desc: 'My vision is to build scalable solutions that improve people's lives, create products used by thousands, become an AI engineer, achieve financial freedom, grow closer to God, spread kindness, and make life a little better for everyone around me.' },
];

export default function Timeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // Heading reveal
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current.children,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: headingRef.current,
              start: 'top 85%',
            },
          }
        );
      }

      // Timeline line draws itself down as you scroll
      if (containerRef.current && lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top center',
              end: 'bottom center',
              scrub: true,
            },
          }
        );
      }

      // Each milestone item: slides in from alternating sides with scrub
      itemsRef.current.forEach((item, idx) => {
        if (!item) return;
        gsap.fromTo(
          item,
          {
            opacity: 0,
            x: idx % 2 === 0 ? -50 : 50,
            scale: 0.92,
          },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            ease: 'power2.out',
            duration: 0.8,
            scrollTrigger: {
              trigger: item,
              start: 'top 88%',
              end: 'top 58%',
              scrub: 0.8,
            },
          }
        );
      });

      // Dots: glow up as the line reaches them
      if (containerRef.current) {
        containerRef.current.querySelectorAll<HTMLElement>('.timeline-dot').forEach((dot) => {
          gsap.fromTo(
            dot,
            { scale: 1, backgroundColor: '#000', boxShadow: '0 0 0px transparent' },
            {
              scale: 1.6,
              backgroundColor: '#00f0ff',
              boxShadow: '0 0 18px #00f0ff, 0 0 36px rgba(0,240,255,0.4)',
              ease: 'none',
              scrollTrigger: {
                trigger: dot,
                start: 'top 68%',
                end: 'top 42%',
                scrub: 1,
              },
            }
          );
        });
      }
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="timeline"
      ref={sectionRef}
      className="py-16 md:py-32 px-6 bg-black text-white border-t border-white/10 overflow-hidden"
    >
      <div className="max-w-4xl mx-auto">
        <div ref={headingRef} className="mb-12 md:mb-24 text-center">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-[0.2em] mb-4">Journey</h2>
          <div className="w-16 h-[2px] bg-white mx-auto" />
        </div>

        <div ref={containerRef} className="relative">
          {/* Timeline Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[1px] bg-white/10 origin-top">
            <div ref={lineRef} className="w-full h-full bg-white origin-top" />
          </div>

          <div className="space-y-6 md:space-y-12">
            {milestones.map((milestone, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div
                  key={idx}
                  ref={(el) => { itemsRef.current[idx] = el; }}
                  className={`relative flex flex-col md:flex-row items-center justify-between ${isEven ? 'md:flex-row-reverse' : ''}`}
                >
                  {/* Glowing dot */}
                  <div
                    className="timeline-dot absolute left-4 md:left-1/2 w-3 h-3 bg-black border-2 border-white -translate-x-[5px] md:-translate-x-1/2 z-10 rounded-full"
                    style={{ willChange: 'transform, box-shadow, background-color' }}
                  />

                  {/* Spacer */}
                  <div className="hidden md:block w-1/2" />

                  {/* Content Card */}
                  <div className={`w-full md:w-1/2 pl-10 md:pl-0 ${isEven ? 'md:pr-12 text-left md:text-right' : 'md:pl-12 text-left'}`}>
                    <motion.div
                      whileHover={{
                        scale: 1.04,
                        x: isEven ? -6 : 6,
                        borderColor: '#00f0ff',
                        boxShadow: '0 10px 30px rgba(0, 240, 255, 0.15)',
                      }}
                      whileTap={{ scale: 0.96 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                      className="wireframe-card p-5 md:p-8 group cursor-pointer relative overflow-hidden"
                    >
                      {/* Shimmer sweep */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />
                      <h3 className="text-base sm:text-lg font-black uppercase tracking-wider mb-2 text-white">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{milestone.desc}</p>
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
