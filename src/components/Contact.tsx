import { useEffect, useRef } from 'react';
import { Mail } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // Heading: slide up + clip wipe
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { opacity: 0, y: 60, clipPath: 'inset(0 0 100% 0)' },
          {
            opacity: 1,
            y: 0,
            clipPath: 'inset(0 0 0% 0)',
            duration: 1.1,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: headingRef.current,
              start: 'top 85%',
            },
          }
        );
      }

      // Sub text fade
      if (subRef.current) {
        gsap.fromTo(
          subRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            delay: 0.25,
            scrollTrigger: {
              trigger: subRef.current,
              start: 'top 88%',
            },
          }
        );
      }

      // Buttons pop in with stagger
      if (buttonsRef.current) {
        const btns = buttonsRef.current.querySelectorAll<HTMLAnchorElement>('a');
        gsap.fromTo(
          btns,
          { opacity: 0, y: 30, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.65,
            stagger: 0.12,
            ease: 'back.out(1.5)',
            scrollTrigger: {
              trigger: buttonsRef.current,
              start: 'top 88%',
            },
          }
        );
      }
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="py-16 md:py-32 px-6 flex flex-col items-center justify-center relative overflow-hidden bg-white text-black"
    >
      {/* Decorative orb */}
      <div
        className="bg-orb absolute bottom-0 right-1/4 w-[300px] h-[300px] opacity-[0.05]"
        style={{ background: '#000' }}
        aria-hidden="true"
      />

      <div className="text-center z-10 w-full max-w-4xl">
        <h2
          ref={headingRef}
          className="text-4xl md:text-6xl font-black uppercase tracking-[0.1em] mb-6"
          style={{ clipPath: 'inset(0 0 0% 0)' }}
        >
          Let's Build Something Amazing.
        </h2>

        <p
          ref={subRef}
          className="text-gray-500 text-base md:text-xl mx-auto mb-10 md:mb-16 leading-relaxed"
        >
          Whether you have an idea for a product or need an AI integration for an existing platform, I'm here to
          help turn it into reality.
        </p>

        <div ref={buttonsRef} className="flex flex-col sm:flex-row justify-center items-center gap-6">
          <a
            href="https://linkedin.com/in/abhinandankhajuria01"
            target="_blank"
            rel="noreferrer"
            className="group flex items-center justify-center gap-4 px-10 py-5 w-full sm:w-auto border border-black hover:bg-black hover:text-white transition-colors duration-300"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect x="2" y="9" width="4" height="12" />
              <circle cx="4" cy="4" r="2" />
            </svg>
            <span className="font-bold uppercase tracking-widest text-sm">LinkedIn</span>
          </a>

          <a
            href="https://github.com/Abhinandankhajuria01"
            target="_blank"
            rel="noreferrer"
            className="group flex items-center justify-center gap-4 px-10 py-5 w-full sm:w-auto border border-black hover:bg-black hover:text-white transition-colors duration-300"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
            <span className="font-bold uppercase tracking-widest text-sm">GitHub</span>
          </a>

          <a
            href="mailto:abhinandankhajuria01@gmail.com"
            className="group flex items-center justify-center gap-4 px-10 py-5 w-full sm:w-auto bg-black text-white hover:bg-gray-800 transition-colors duration-300"
          >
            <Mail size={20} />
            <span className="font-bold uppercase tracking-widest text-sm">Email Me</span>
          </a>
        </div>
      </div>
    </section>
  );
}
