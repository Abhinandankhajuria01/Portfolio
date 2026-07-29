import { useEffect, useRef } from 'react';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function AboutMe() {
  const sectionRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const textColRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // Image: parallax float upward with center fade in/out
      if (imgRef.current) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: imgRef.current,
            start: 'top 90%',
            end: 'bottom 10%',
            scrub: 1.5,
          }
        });
        
        // Parallax movement
        tl.fromTo(imgRef.current, { y: 60, scale: 1.04 }, { y: -20, scale: 1, ease: 'none', duration: 2 }, 0);
        // Opacity fade in and fade out
        tl.fromTo(imgRef.current, { opacity: 0 }, { opacity: 1, ease: 'power2.out', duration: 1 }, 0);
        tl.to(imgRef.current, { opacity: 0.1, ease: 'power2.in', duration: 1 }, 1);
      }

      // Text paragraphs stagger
      if (textColRef.current) {
        const paras = textColRef.current.querySelectorAll<HTMLElement>('.para-reveal');
        gsap.fromTo(
          paras,
          { opacity: 0, x: 50 },
          {
            opacity: 1,
            x: 0,
            duration: 0.9,
            stagger: 0.18,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: textColRef.current,
              start: 'top 80%',
            },
          }
        );
      }

      // Stats pop in
      if (statsRef.current) {
        const items = statsRef.current.querySelectorAll<HTMLElement>('.stat-item');
        gsap.fromTo(
          items,
          { opacity: 0, y: 20, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.15,
            ease: 'back.out(1.5)',
            scrollTrigger: {
              trigger: statsRef.current,
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
      id="about-me"
      ref={sectionRef}
      className="py-16 md:py-32 px-6 bg-white text-black relative overflow-hidden"
    >
      {/* Subtle glow orb in the background */}
      <div
        className="bg-orb absolute top-1/4 left-1/4 w-[400px] h-[400px] opacity-[0.04]"
        style={{ background: '#000' }}
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 md:gap-16 items-center">

          {/* Image Column */}
          <div ref={imgRef} className="w-2/3 sm:w-1/2 lg:w-5/12 mx-auto relative">
            <div className="aspect-[4/5] bg-gray-100 rounded-2xl overflow-hidden relative group">
              <div className="absolute inset-0 bg-[url('/profile-photo.jpg')] bg-cover bg-center grayscale hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
            </div>
            <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-black rounded-full mix-blend-multiply blur-2xl opacity-20 animate-pulse" />
          </div>

          {/* Text Column */}
          <div ref={textColRef} className="w-full lg:w-7/12">
            <p className="para-reveal text-gray-500 font-mono text-sm tracking-widest uppercase mb-4">
              Beyond the Resume
            </p>
            <h2 className="para-reveal text-4xl md:text-6xl font-black uppercase tracking-[0.1em] mb-8 leading-none">
              More Than <br /> Just Code.
            </h2>

            <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
              <p className="para-reveal">
                I am a self-taught developer who believes that the best engineers are the ones who combine deep
                technical expertise with relentless curiosity. My journey didn't start with a perfect roadmap; it
                started with a genuine fascination for how things work and a stubborn refusal to give up when
                things broke.
              </p>
              <p className="para-reveal">
                When I'm not building scalable web architectures or integrating AI models, I channel my creativity
                into content creation and video editing. This intersection of logic and art allows me to tell
                compelling stories—whether through a seamlessly animated UI, a well-structured backend, or an
                engaging video.
              </p>
              <p className="para-reveal">
                I thrive in environments where the answer isn't obvious. I love diving into complex problems,
                experimenting with cutting-edge tech, and building products that actually matter to the people
                using them.
              </p>
            </div>

            <div
              ref={statsRef}
              className="mt-12 pt-8 border-t border-gray-200 grid grid-cols-2 gap-8"
            >
              <div className="stat-item">
                <h4 className="font-bold uppercase tracking-wider text-sm text-black mb-2">Based In</h4>
                <p className="text-gray-500">Punjab, India</p>
              </div>
              <div className="stat-item">
                <h4 className="font-bold uppercase tracking-wider text-sm text-black mb-2">Interests</h4>
                <p className="text-gray-500">AI, Filmmaking, Fitness, Gaming</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
