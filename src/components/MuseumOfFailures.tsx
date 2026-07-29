import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const failures = [
  {
    id: '01',
    title: 'The JEE Mains Setback',
    story: "I didn't clear my JEE Mains. At the time, it felt like the end of my engineering dreams. Instead, it pushed me to find alternative paths and realize that passion and skill matter more than a single test score.",
    lesson: "Exams don't define your potential.",
  },
  {
    id: '02',
    title: 'Class 12 Maths Compartment',
    story: "Getting a compartment in Class 12 Mathematics was a harsh reality check. But fighting through it taught me resilience and showed me that I could overcome academic hurdles with sheer persistence.",
    lesson: "Failure is an event, not a person.",
  },
  {
    id: '03',
    title: 'A Bumpy College Start',
    story: "My transition to college wasn't smooth. I struggled with initial grades and balancing extracurriculars. It took trial, error, and a lot of late nights to learn time management and how to prioritize effectively.",
    lesson: "Adaptability is a survival skill.",
  },
  {
    id: '04',
    title: 'The Late Start',
    story: 'I realized very late what I wanted to do with my career and felt like I had absolutely zero skills compared to everyone else. The feeling of being "behind" was paralyzing, but it eventually became the ultimate catalyst for my growth.',
    lesson: "It's never too late to begin.",
  },
  {
    id: '05',
    title: 'Internships vs Hello World',
    story: 'While my classmates were actively hunting for internships and landing roles, I was sitting in my room just starting to learn the basics of C++. It taught me to stop comparing my Chapter 1 to someone else\'s Chapter 10.',
    lesson: "Run your own race.",
  },
];

const infiniteFailures = Array(40).fill(failures).flat();

export default function MuseumOfFailures() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const hoveredCardIndex = useRef<number | null>(null);
  const animationFrameId = useRef<number>(0);
  const hoverDirection = useRef<'left' | 'right' | null>(null);
  
  const cardsData = useRef<{ currentScale: number, currentGlow: number, currentRotate: number }[]>(
    infiniteFailures.map(() => ({ currentScale: 0.8, currentGlow: 0, currentRotate: 0 }))
  );

  const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

  const handleCardHover = (index: number) => {
    hoveredCardIndex.current = index;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const { left, width } = containerRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const edgeThreshold = width * 0.15; // 15% hover edge for auto-scrolling

    if (x < edgeThreshold) {
      hoverDirection.current = 'left';
    } else if (x > width - edgeThreshold) {
      hoverDirection.current = 'right';
    } else {
      hoverDirection.current = null;
    }
  };

  const handleMouseLeave = () => {
    hoveredCardIndex.current = null;
    hoverDirection.current = null;
  };

  // Set initial scroll to middle of the infinite track
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = containerRef.current.scrollWidth / 2 - containerRef.current.offsetWidth / 2;
    }
  }, []);



  useEffect(() => {
    const renderLoop = () => {
      if (containerRef.current) {
        // Edge Hover Panning (Reduced speed from 8 to 4)
        if (hoverDirection.current === 'left') {
          containerRef.current.scrollLeft -= 4;
        } else if (hoverDirection.current === 'right') {
          containerRef.current.scrollLeft += 4;
        }

        // 1. STRICT READ PHASE: Read all layout data first to prevent layout thrashing
        const containerRect = containerRef.current.getBoundingClientRect();
        const containerCenter = containerRect.left + containerRect.width / 2;

        const cardMeasurements = cardsRef.current.map((card, index) => {
          if (!card) return null;
          const rect = card.getBoundingClientRect();
          
          // Performance optimization: skip off-screen cards
          if (rect.right < -500 || rect.left > containerRect.width + 500) {
            return null;
          }

          const cardCenter = rect.left + rect.width / 2;
          let dist = (cardCenter - containerCenter) / (containerRect.width / 2);
          dist = Math.max(-2, Math.min(2, dist));
          
          return { card, innerCard: card.children[0] as HTMLElement, dist, index };
        });

        // 2. STRICT WRITE PHASE: Apply all style changes without querying the DOM layout
        const isEdgePanning = hoverDirection.current !== null;

        cardMeasurements.forEach((measurement) => {
          if (!measurement) return;
          const { card, innerCard, dist, index } = measurement;

          const isHovered = !isEdgePanning && (hoveredCardIndex.current === index);
          const anyCardHovered = !isEdgePanning && (hoveredCardIndex.current !== null);

          // Dramatic scale drop-off for a strong 3D depth effect
          let targetScale = Math.max(0.4, 1 - Math.abs(dist) * 0.45); 
          let targetGlow = Math.max(0, 1 - Math.abs(dist) * 1.5);

          if (isHovered) {
            targetScale = 1.05;
            targetGlow = 1;
          } else if (anyCardHovered) {
            targetScale *= 0.8; // Shrink all other cards
            targetGlow *= 0.2; // Severely dim their glow
          }

          const data = cardsData.current[index];
          // Snappier lerp (0.15) eliminates "rubber banding" lag when scrolling fast
          data.currentScale = lerp(data.currentScale, targetScale, 0.15);
          data.currentGlow = lerp(data.currentGlow || 0, targetGlow, 0.15);

          card.style.transform = `scale(${data.currentScale})`;
          
          if (innerCard) {
            const glowIntensity = data.currentGlow;
            innerCard.style.borderColor = `rgba(239, 68, 68, ${0.1 + glowIntensity * 0.7})`;
            innerCard.style.boxShadow = `0 0 ${10 + glowIntensity * 40}px rgba(239, 68, 68, ${0.05 + glowIntensity * 0.45})`;
            innerCard.style.backgroundColor = `rgba(${17 + glowIntensity * 15}, 17, 17, 1)`;
          }
          
          if (isHovered) {
            card.style.zIndex = '200';
          } else {
            card.style.zIndex = Math.round(100 - Math.abs(dist) * 10).toString();
          }
        });
      }
      animationFrameId.current = requestAnimationFrame(renderLoop);
    };

    renderLoop();
    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    let ctx: any;
    try {
      ctx = gsap.context(() => {
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
        if (containerRef.current) {
          gsap.fromTo(
            containerRef.current,
            { opacity: 0, y: 50 },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: containerRef.current,
                start: 'top 85%',
              },
            }
          );

          // Map vertical scroll to horizontal scroll reliably for mobile and desktop
          // By using a relative +=1200, we scroll about 3-4 cards horizontally 
          // across the entire vertical scroll duration, making it very slow and smooth.
          gsap.to(containerRef.current, {
            scrollLeft: '+=1200',
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom', // Start when section enters from bottom
              end: 'bottom top',   // End when section leaves at top
              scrub: 1.5,          // Increased scrub time for even smoother inertia
              invalidateOnRefresh: true,
            }
          });
        }
      }, el);
    } catch (e) {
      // Fallback
    }

    return () => {
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-32 bg-[#0a0a0a] text-white relative overflow-hidden"
    >
      {/* Background glow */}
      <div
        className="bg-orb absolute top-1/4 right-1/4 w-[500px] h-[500px] opacity-10"
        style={{ background: '#7f1d1d' }}
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto relative z-10 px-6">
        <div ref={headerRef} className="mb-4 md:mb-10 text-center">
          <p className="text-red-500 font-mono text-sm tracking-widest uppercase mb-4">Exhibit.04</p>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-[0.1em] mb-6">
            Museum of Failures.
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Every successful launch is built on a graveyard of terrible ideas, broken code, and bad decisions.
            Here are a few of my favorite missteps and what they taught me.
          </p>
        </div>
      </div>

      {/* Infinite Gallery */}
      <div 
        ref={containerRef} 
        className="flex overflow-hidden touch-pan-y w-full px-[calc(50vw-140px)] sm:px-[calc(50vw-190px)] py-12 hide-scrollbar relative z-20 cursor-ew-resize"
        style={{ scrollbarWidth: 'none' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {infiniteFailures.map((failure, index) => (
          <div 
            key={`${failure.id}-${index}`} 
            ref={(el) => { cardsRef.current[index] = el; }}
            className="w-[280px] sm:w-[380px] shrink-0 -mx-8 sm:-mx-12 relative cursor-pointer group"
            onMouseEnter={() => handleCardHover(index)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="w-full h-full border p-5 sm:p-8 overflow-hidden flex flex-col justify-between rounded-xl relative" style={{ willChange: 'border-color, box-shadow, background-color' }}>
              {/* Shimmer sweep overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />

              <div>
                <div className="text-4xl sm:text-5xl font-black text-white/5 mb-4 group-hover:text-red-500/20 transition-colors duration-500">
                  {failure.id}
                </div>
                <h3 className="text-lg sm:text-xl font-bold uppercase tracking-wider mb-2 leading-snug">
                  {failure.title}
                </h3>
                <p className="text-gray-500 mb-4 text-xs sm:text-sm leading-relaxed">
                  {failure.story}
                </p>
              </div>
              
              <div className="pt-4 sm:pt-6 border-t border-white/10 mt-4">
                <p className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-red-500 mb-1">
                  Lesson Learned
                </p>
                <p className="text-xs sm:text-sm font-bold text-gray-300">{failure.lesson}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
