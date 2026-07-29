import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LayoutGrid, Cpu, Leaf, X, ExternalLink, Code, Navigation } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

type Project = {
  title: string;
  tag: string;
  icon: any;
  desc: string;
  features: string[];
  caseStudy: string;
  demoUrl?: string;
  repoUrl: string;
};

const projects: Project[] = [
  {
    title: 'RydMate',
    tag: 'AI Transit & Navigation Platform',
    icon: Navigation,
    desc: 'An enterprise-grade, real-time campus transportation and AI telemetry platform engineered specifically for IIT Jammu with live electric shuttle tracking and predictive demand forecasting.',
    features: [
      'Real-Time GPS Fleet Telemetry',
      'AI Demand Prediction Engine',
      'Interactive Level-22 Vector Maps',
      'High-Concurrency FastAPI Backend',
      'Driver & Student Portals',
      'Surge Heatmap & Notifications',
      'PostgreSQL 16 Normalized Schema',
      'AAA WCAG Accessible UI'
    ],
    caseStudy: 'RydMate was engineered to solve the complex real-time transit and navigation challenges at IIT Jammu (Jagti Campus).\n\nManaging electric shuttle cart operations across a growing campus requires continuous telemetry, intelligent dispatch, and clear student communication. Without a unified system, students struggle with unpredictable shuttle arrival times, while administrators lack insights into passenger load and peak demand surges across academic hours.\n\nTo address this, I designed RydMate as an enterprise-grade transit platform benchmarked against modern standards like Uber and Google Maps. The architecture features an asynchronous Python FastAPI backend handling high-frequency GPS broadcasts from carts, backed by a normalized PostgreSQL 16 database. On the frontend, an interactive Leaflet vector map built with React 19 and TypeScript supports deep digital zoom up to Level 22, displaying custom high-contrast obsidian badges with AAA WCAG accessibility contrast.\n\nBeyond live tracking, RydMate incorporates an AI Demand Prediction Engine powered by Scikit-Learn. By analyzing historical timetable loading and time-of-day regression models across peak hours (08:00 - 18:00), the system forecasts stop-level passenger demand and issues proactive surge notifications to the Executive Command Center, enabling dynamic fleet rebalancing across campus.',
    demoUrl: '',
    repoUrl: 'https://github.com/Abhinandankhajuria01/RydMate'
  },
  {
    title: 'ProgressOS',
    tag: 'Productivity Platform',
    icon: LayoutGrid,
    desc: 'A next-generation productivity and habit-building ecosystem designed to transform daily routines into engaging, rewarding experiences with deep gamification mechanics.',
    features: [
      'Habit Tracking System',
      'Gamified Self-Improvement',
      'Streak Management',
      'Progress Visualization',
      'Performance Analytics',
      'Motivational Feedback System',
      'Student-Friendly Accessibility',
      'Long-Term Growth Focus'
    ],
    caseStudy: 'Progress OS began as a personal solution to a problem I faced myself.\n\nLike many students, I struggled with consistency. Tracking habits and maintaining routines across different apps felt overwhelming, and it was difficult to see whether I was actually improving over time. As someone who enjoys gaming, I realized that self-improvement could be far more engaging if it felt rewarding and visual.\n\nThat idea led to Progress OS.\n\nProgress OS is a gamified self-improvement platform that transforms personal growth into an experience similar to leveling up in a game. Through streaks, charts, and visual progress tracking, users can clearly see their growth and stay motivated to keep improving.\n\nMy long-term vision is to make Progress OS accessible to students worldwide. Rather than maximizing profit, I want to keep the platform affordable, with a subscription of only one or two dollars per month—just enough to cover operational costs. I believe self-improvement tools should be accessible to everyone, especially students who can benefit from them the most.',
    demoUrl: '',
    repoUrl: 'https://github.com/Abhinandankhajuria01/ProgressOS'
  },
  {
    title: 'Planix',
    tag: 'Construction Platform',
    icon: Cpu,
    desc: 'An AI-powered construction management platform engineered to streamline complex operations, automate expense tracking, and provide predictive insights.',
    features: [
      'Project Management Dashboard',
      'Worker Management System',
      'Attendance Tracking',
      'Financial Management',
      'Centralized Operations',
      'Scalable SaaS Architecture',
      'Real-Time Insights',
      'Productivity-Focused Workflow'
    ],
    caseStudy: 'A conversation with a friend working in the construction industry in Australia revealed a common problem faced by contractors. Managing multiple projects through WhatsApp chats, Excel sheets, and handwritten notes was becoming increasingly inefficient and difficult to scale. With aspirations of becoming a contractor himself, he wanted a simpler and more organized way to manage day-to-day operations.\n\nThat conversation inspired Planix.\n\nPlanix is a construction management platform designed to centralize everything required to run projects efficiently. From project management and worker management to attendance tracking and financial records, the platform aims to replace fragmented workflows with a single, intuitive system.\n\nBuilt with the vision of becoming a SaaS platform for the construction industry, Planix focuses on simplifying operations and helping contractors spend less time managing paperwork and more time building.',
    demoUrl: '',
    repoUrl: 'https://github.com/Abhinandankhajuria01/Planix'
  },
  {
    title: 'EcoPulse',
    tag: 'Sustainability Platform',
    icon: Leaf,
    desc: 'Understand, track, and reduce your carbon footprint with AI-powered insights. EcoPulse is your personal sustainability coach, making eco-friendly living simple, fun, and rewarding.',
    features: [
      'AI-Powered Sustainability Assistant',
      'Carbon Footprint Tracking',
      'Actionable Eco-Friendly Insights',
      'Community-Centered Platform',
      'Interactive AI Chat Interface',
      'Environmental Data Integration',
      'Awareness Through Technology',
      'Future-Ready Ecosystem'
    ],
    caseStudy: 'EcoPulse was created during Google’s Virtual Prompt Wars, where the challenge encouraged participants to use AI to solve meaningful real-world problems.\n\nThe project was built around a simple belief: sustainability should not be complicated. While many people want to live more responsibly, understanding the impact of daily choices and finding practical ways to reduce carbon footprints often feels overwhelming.\n\nEcoPulse was designed as an AI-powered sustainability platform for communities. Users can track their environmental impact, receive personalized recommendations, and interact with an AI assistant capable of answering questions and providing actionable advice.\n\nLooking ahead, the vision for EcoPulse is to evolve into a community-driven ecosystem where individuals and organizations can collaborate, participate in sustainability challenges, earn rewards, and collectively contribute toward a greener future. By combining AI with community engagement, EcoPulse aims to make sustainable living more accessible, educational, and rewarding for everyone.',
    demoUrl: '',
    repoUrl: 'https://github.com/Abhinandankhajuria01/ecoPulse'
  }
];

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedProject]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // Heading: wipe in from left
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { opacity: 0, x: -60, clipPath: 'inset(0 100% 0 0)' },
          {
            opacity: 1,
            x: 0,
            clipPath: 'inset(0 0% 0 0)',
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: headingRef.current,
              start: 'top 85%',
            },
          }
        );
      }

      // Cards: alternate left/right + scale + scrub
      cardsRef.current.forEach((card, idx) => {
        if (!card) return;
        gsap.fromTo(
          card,
          {
            opacity: 0,
            y: 60,
            x: idx % 2 === 0 ? -30 : 30,
            scale: 0.92,
          },
          {
            opacity: 1,
            y: 0,
            x: 0,
            scale: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              end: 'top 60%',
              scrub: 0.9,
            },
          }
        );
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section id="projects" ref={sectionRef} className="py-16 md:py-32 px-6 bg-black text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* Left Column Header */}
          <div className="lg:w-5/12">
            <h2 ref={headingRef} className="text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-black uppercase tracking-[0.1em] leading-tight sticky top-32 break-words" style={{ clipPath: 'inset(0 0% 0 0)' }}>
              Featured<br/>Projects.<br/>
              <span className="text-gray-600 block mt-4">Unmatched<br/>Innovation.</span>
            </h2>
          </div>

          {/* Right Column Grid */}
          <div className="lg:w-7/12 grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project, idx) => {
              const Icon = project.icon;
              return (
                <motion.div 
                  key={idx}
                  ref={el => { cardsRef.current[idx] = el; }}
                  whileHover={{ scale: 1.03, y: -6, borderColor: "rgba(255,255,255,0.7)", boxShadow: "0 20px 40px rgba(255,255,255,0.08)" }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 350, damping: 20 }}
                  className="wireframe-card p-6 md:p-10 flex flex-col group relative overflow-hidden cursor-pointer transition-colors"
                  onClick={() => setSelectedProject(project)}
                >
                  {/* Shimmer sweep on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out z-0 pointer-events-none" />
                  
                  <div className="relative z-10 flex-1">
                    <div className="w-12 h-12 border border-white/30 flex items-center justify-center mb-6 md:mb-8 bg-black">
                      <Icon size={24} className="text-white" />
                    </div>
                    
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 block">
                      {project.tag}
                    </span>
                    
                    <h3 className="text-xl md:text-2xl font-black uppercase tracking-wider mb-4 md:mb-6">
                      {project.title}
                    </h3>
                    
                    <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-6 md:mb-8">
                      {project.desc}
                    </p>
                    
                    <div className="mt-auto">
                      <div className="w-full h-[1px] bg-white/10 mb-4 md:mb-6"></div>
                      <ul className="space-y-2 md:space-y-3 mb-4">
                        {project.features.slice(0, 3).map((feature, fIdx) => (
                          <li key={fIdx} className="flex items-start text-xs uppercase tracking-wider text-gray-300">
                            <span className="w-1 h-1 bg-white mt-1.5 mr-3 flex-shrink-0"></span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      {project.features.length > 3 && (
                        <div className="text-[11px] uppercase tracking-widest text-cyan-400 font-bold flex items-center gap-1 group-hover:underline">
                          + Tap for Case Study & {project.features.length - 3} more features →
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          >
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setSelectedProject(null)}
            ></div>

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl bg-zinc-950 border border-white/10 shadow-2xl rounded-2xl overflow-hidden flex flex-col max-h-[90vh] z-20"
            >
              {/* Header */}
              <div className="p-6 sm:p-8 border-b border-white/10 flex justify-between items-start sticky top-0 bg-zinc-950/80 backdrop-blur-sm z-10">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">
                    {selectedProject.tag}
                  </span>
                  <h3 className="text-3xl sm:text-4xl font-black uppercase tracking-wider text-white">
                    {selectedProject.title}
                  </h3>
                </div>
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5 cursor-pointer"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 border border-white/30 flex items-center justify-center bg-black rounded-xl shrink-0">
                    <selectedProject.icon size={28} className="text-white" />
                  </div>
                  <p className="text-gray-300 text-lg leading-relaxed flex-1">
                    {selectedProject.desc}
                  </p>
                </div>

                <div className="space-y-8">
                  <div>
                    <h4 className="text-xl font-bold uppercase tracking-wider mb-4 text-white flex items-center gap-3">
                      <span className="w-2 h-2 bg-white rounded-full"></span>
                      Case Study
                    </h4>
                    <p className="text-gray-400 leading-relaxed text-lg whitespace-pre-wrap">
                      {selectedProject.caseStudy}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xl font-bold uppercase tracking-wider mb-4 text-white flex items-center gap-3">
                      <span className="w-2 h-2 bg-white rounded-full"></span>
                      Key Features
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {selectedProject.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-start text-sm uppercase tracking-wider text-gray-300 bg-white/5 p-4 rounded-lg border border-white/5">
                          <span className="w-1.5 h-1.5 bg-white mt-1.5 mr-3 flex-shrink-0 rounded-full"></span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Footer / Actions */}
              <div className="p-6 sm:p-8 border-t border-white/10 bg-zinc-950 flex flex-col sm:flex-row gap-4 shrink-0">
                {selectedProject.demoUrl && selectedProject.demoUrl.startsWith('http') && (
                  <a 
                    href={selectedProject.demoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!selectedProject.demoUrl) return;
                      const win = window.open(selectedProject.demoUrl, '_blank', 'noopener,noreferrer');
                      if (!win || win.closed || typeof win.closed === 'undefined') {
                        window.location.href = selectedProject.demoUrl;
                      }
                    }}
                    className="flex-1 bg-white text-black py-4 px-6 rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors cursor-pointer relative z-30"
                  >
                    View Live Demo
                    <ExternalLink size={20} />
                  </a>
                )}
                <a 
                  href={selectedProject.repoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.stopPropagation();
                    const win = window.open(selectedProject.repoUrl, '_blank', 'noopener,noreferrer');
                    if (!win || win.closed || typeof win.closed === 'undefined') {
                      window.location.href = selectedProject.repoUrl;
                    }
                  }}
                  className={`flex-1 py-4 px-6 rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer relative z-30 ${
                    selectedProject.demoUrl && selectedProject.demoUrl.startsWith('http')
                      ? 'bg-transparent border border-white/20 text-white hover:bg-white/5'
                      : 'bg-white text-black hover:bg-gray-200'
                  }`}
                >
                  Source Code
                  <Code size={20} />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
