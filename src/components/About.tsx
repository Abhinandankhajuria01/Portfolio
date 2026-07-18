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
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    gsap.fromTo(".fade-up", 
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 70%',
        }
      }
    );

    // Horizontal scroll animation for approach cards on mobile
    if (trackRef.current) {
      const scrollDist = trackRef.current.scrollWidth - trackRef.current.clientWidth;
      if (scrollDist > 0) {
        gsap.to(trackRef.current, {
          x: -scrollDist,
          ease: "none",
          scrollTrigger: {
            trigger: trackRef.current,
            start: "top 85%",
            end: "bottom 20%",
            scrub: 1,
            invalidateOnRefresh: true,
          }
        });
      }
    }
  }, []);

  return (
    <section id="about" ref={sectionRef} className="pt-6 pb-16 md:py-32 px-6 bg-white text-black">
      <div className="max-w-6xl mx-auto">
        
        {/* Top Minimalist Timeline (Horizontal Swipeable on Mobile) */}
        <div className="mb-12 md:mb-24 text-center">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-[0.2em] mb-6 md:mb-12 fade-up">My Approach</h2>
          <div className="flex justify-center items-center relative max-w-4xl mx-auto fade-up overflow-hidden pb-4">
             {/* Background Line */}
             <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gray-200 -z-10 hidden md:block"></div>
             
             <div ref={trackRef} className="flex justify-start md:justify-between gap-6 w-full px-2 md:px-12">
               {cards.map((card, idx) => (
                 <div key={idx} className="flex flex-col items-center bg-white px-2 w-28 flex-shrink-0 md:w-auto">
                   <div className="w-3 h-3 bg-black rounded-full mb-3 md:mb-4"></div>
                   <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800 text-center">{card.title}</h3>
                 </div>
               ))}
             </div>
          </div>
        </div>

        {/* Content Section with Overlapping Images */}
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16 mt-6 md:mt-24">
          
          <div className="w-full md:w-1/2 relative h-[210px] sm:h-[320px] md:h-[400px] fade-up group mb-4 md:mb-0">
             {/* Back abstract image */}
             <div className="absolute top-0 left-0 w-2/3 md:w-3/4 h-[150px] sm:h-[240px] md:h-[300px] bg-[url('/workspace.png')] bg-cover bg-center grayscale rounded-xl shadow-2xl transition-transform duration-700 group-hover:scale-105"></div>
             
             {/* Front abstract image (Offset) */}
             <div className="absolute bottom-0 right-0 w-2/3 md:w-3/4 h-[130px] sm:h-[200px] md:h-[250px] bg-[url('/code-editor.png')] bg-cover bg-center grayscale rounded-xl shadow-2xl border-4 border-white transition-transform duration-700 group-hover:-translate-y-4"></div>
          </div>

          <div className="w-full md:w-1/2 fade-up">
             <h2 className="text-3xl md:text-4xl font-black uppercase tracking-[0.1em] mb-6 leading-snug">
               Developer with a<br/>Difference.<br/>Innovation.
             </h2>
             <p className="text-gray-500 leading-relaxed mb-6">
               I am a Full Stack AI Developer passionate about creating robust, scalable solutions. By integrating state-of-the-art LLMs and advanced machine learning models into traditional web architectures, I build applications that not only solve today's problems but anticipate tomorrow's needs.
             </p>
             <p className="text-gray-500 leading-relaxed mb-8">
               Beyond code, I leverage generative AI for content creation and video editing, combining technical depth with creative storytelling to turn ambitious ideas into concrete realities.
             </p>
             <div className="pt-6 border-t border-gray-200">
               <p className="font-bold uppercase tracking-widest text-xs text-black">Abhinandan Khajuria</p>
               <p className="text-gray-400 text-xs uppercase tracking-wider mt-1">Full Stack AI Developer</p>
             </div>
          </div>

        </div>

      </div>
    </section>
  );
}
