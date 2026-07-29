import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const cards = [
  { title: 'Full Stack', desc: 'Scalable applications' },
  { title: 'AI Integration', desc: 'LLMs & RAG pipelines' },
  { title: 'Problem Solving', desc: 'Elegant architecture' },
  { title: 'Product Building', desc: 'Idea to Reality' },
  { title: 'Content Creation', desc: 'Video & Media' },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const imgFrontRef = useRef<HTMLDivElement>(null);
  const imgBackRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // Heading reveal with a subtle clip-path wipe
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { opacity: 0, y: 40, clipPath: 'inset(0 0 100% 0)' },
          {
            opacity: 1,
            y: 0,
            clipPath: 'inset(0 0 0% 0)',
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: headingRef.current,
              start: 'top 85%',
            },
          }
        );
      }

      // Approach cards stagger in from below
      const validCards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
      gsap.fromTo(
        validCards,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: validCards[0] || el,
            start: 'top 80%',
          },
        }
      );

      // Divider line draws in
      if (dividerRef.current) {
        gsap.fromTo(
          dividerRef.current,
          { scaleX: 0, transformOrigin: 'left center' },
          {
            scaleX: 1,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: dividerRef.current,
              start: 'top 85%',
            },
          }
        );
      }

      // Background image parallax (slower scroll)
      if (imgBackRef.current) {
        gsap.fromTo(
          imgBackRef.current,
          { y: 30, opacity: 0, scale: 1.05 },
          {
            y: -20,
            opacity: 1,
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: imgBackRef.current,
              start: 'top 90%',
              end: 'bottom 10%',
              scrub: 1.5,
            },
          }
        );
      }

      // Foreground image: slightly faster parallax + fade in
      if (imgFrontRef.current) {
        gsap.fromTo(
          imgFrontRef.current,
          { y: 50, opacity: 0 },
          {
            y: -30,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: imgFrontRef.current,
              start: 'top 90%',
              end: 'bottom 10%',
              scrub: 1,
            },
          }
        );
      }

      // Text block slides in from right
      if (textRef.current) {
        gsap.fromTo(
          textRef.current.querySelectorAll('.text-reveal-item'),
          { opacity: 0, x: 40 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: textRef.current,
              start: 'top 80%',
            },
          }
        );
      }
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="pt-6 pb-16 md:py-32 px-6 bg-white text-black overflow-hidden">
      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <div className="mb-12 md:mb-24 text-center">
          <h2
            ref={headingRef}
            className="text-3xl md:text-4xl font-black uppercase tracking-[0.2em] mb-6 md:mb-12"
            style={{ clipPath: 'inset(0 0 0% 0)' }}
          >
            My Approach
          </h2>

          {/* Approach cards row */}
          <div className="flex justify-center items-center relative max-w-4xl mx-auto overflow-hidden pb-4">
            <div ref={dividerRef} className="absolute top-[18px] left-8 right-8 h-[1px] bg-gray-200 hidden md:block" />
            <div className="flex justify-start md:justify-between gap-6 w-full px-2 md:px-12">
              {cards.map((card, idx) => (
                <div
                  key={idx}
                  ref={el => { cardsRef.current[idx] = el; }}
                  className="flex flex-col items-center bg-white px-2 w-28 flex-shrink-0 md:w-auto group"
                >
                  <div className="w-3 h-3 bg-black rounded-full mb-3 md:mb-4 transition-transform duration-300 group-hover:scale-150 group-hover:bg-gray-700" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800 text-center transition-colors duration-300 group-hover:text-black">
                    {card.title}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content with parallax images */}
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16 mt-6 md:mt-24">

          <div className="w-full md:w-1/2 relative h-[210px] sm:h-[320px] md:h-[400px] mb-4 md:mb-0">
            {/* Back image */}
            <div
              ref={imgBackRef}
              className="absolute top-0 left-0 w-2/3 md:w-3/4 h-[150px] sm:h-[240px] md:h-[300px] bg-[url('/workspace.png')] bg-cover bg-center grayscale rounded-xl shadow-2xl"
            />
            {/* Front image */}
            <div
              ref={imgFrontRef}
              className="absolute bottom-0 right-0 w-2/3 md:w-3/4 h-[130px] sm:h-[200px] md:h-[250px] bg-[url('/code-editor.png')] bg-cover bg-center grayscale rounded-xl shadow-2xl border-4 border-white"
            />
          </div>

          <div ref={textRef} className="w-full md:w-1/2">
            <h2 className="text-reveal-item text-3xl md:text-4xl font-black uppercase tracking-[0.1em] mb-6 leading-snug">
              Developer with a<br />Difference.<br />Innovation.
            </h2>
            <p className="text-reveal-item text-gray-500 leading-relaxed mb-6">
              I am a Full Stack AI Developer passionate about creating robust, scalable solutions. By integrating
              state-of-the-art LLMs and advanced machine learning models into traditional web architectures, I build
              applications that not only solve today's problems but anticipate tomorrow's needs.
            </p>
            <p className="text-reveal-item text-gray-500 leading-relaxed mb-8">
              Beyond code, I leverage generative AI for content creation and video editing, combining technical depth
              with creative storytelling to turn ambitious ideas into concrete realities.
            </p>
            <div className="text-reveal-item pt-6 border-t border-gray-200">
              <p className="font-bold uppercase tracking-widest text-xs text-black">Abhinandan Khajuria</p>
              <p className="text-gray-400 text-xs uppercase tracking-wider mt-1">Full Stack AI Developer</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
