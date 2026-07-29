import { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';

const milestones = [
  {
    id: '01',
    year: '2018',
    title: 'Discovered Programming',
    desc: 'Joined WhiteHat Jr. in 8th grade and explored coding for the first time. Even then, I was deeply fascinated by computers, gaming, and technology.',
  },
  {
    id: '02',
    year: '2019–2021',
    title: 'Focused on School',
    desc: 'Stepped away from programming to concentrate on academics. Although I stopped coding completely, my curiosity about technology never disappeared.',
  },
  {
    id: '03',
    year: '2022',
    title: 'Started Again in College',
    desc: 'Entered Computer Science Engineering and rediscovered the passion for building. Despite setbacks and unexpected challenges that delayed progress, I decided to start from scratch and pursue technology seriously.',
  },
  {
    id: '04',
    year: '2022',
    title: 'Learning Without Mentors',
    desc: 'Most of the journey was self-taught. Starting over and navigating everything without mentors became one of the biggest challenges, but it also taught me resilience and independent learning.',
  },
  {
    id: '05',
    year: '2023',
    title: 'Discovered AI',
    desc: 'Curiosity led me to AI through ChatGPT, and later Gemini. The possibilities of intelligent systems sparked a deeper interest in technology and opened the door to creating more impactful products.',
  },
  {
    id: '06',
    year: '2023',
    title: 'Built My First AI Project',
    desc: 'Developed an AI chatbot as a college project. It became the first major step toward turning ideas into real applications.',
  },
  {
    id: '07',
    year: '2024',
    title: 'Built ProgressOS',
    desc: 'Inspired by gaming and personal growth, I created ProgressOS — a gamified productivity platform designed to make achieving goals exciting and rewarding while tracking long-term progress.',
  },
  {
    id: '08',
    year: '2024',
    title: 'Built Planix',
    desc: 'After hearing about the struggles contractors faced managing projects through Excel sheets, WhatsApp chats, and notes, I saw an opportunity to solve a real-world problem. Inspired by my friend in construction, I built Planix — an AI-powered construction management platform.',
  },
  {
    id: '09',
    year: '2024',
    title: 'Built RydMate',
    desc: 'Engineered RydMate — an enterprise-grade, real-time campus transportation and AI telemetry platform for IIT Jammu. Combining high-concurrency GPS tracking, AI demand forecasting, and interactive vector mapping.',
  },
  {
    id: '10',
    year: '2025',
    title: 'Present Day',
    desc: 'Today, I am a Computer Science student, Full Stack AI Developer, builder, entrepreneur, and lifelong learner. I enjoy solving real-world problems, building products, and constantly exploring new technologies.',
  },
  {
    id: '11',
    year: 'FUTURE',
    title: 'Looking Ahead',
    desc: "My vision is to build scalable solutions that improve people's lives, create products used by thousands, become an AI engineer, achieve financial freedom, grow closer to God, spread kindness, and make life a little better for everyone around me.",
  },
];

const Card = ({ 
  milestone, 
  index, 
  totalCards, 
  isFront, 
  onSwipe 
}: { 
  milestone: typeof milestones[0];
  index: number;
  totalCards: number;
  isFront: boolean;
  onSwipe: (dir: number) => void;
}) => {
  const x = useMotionValue(0);
  // Rotate the card slightly as it's dragged left or right
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  // Fade out slightly if dragged very far
  const opacity = useTransform(x, [-300, -150, 0, 150, 300], [0.3, 1, 1, 1, 0.3]);

  const handleDragEnd = (_: any, info: any) => {
    const threshold = 100; // Drag distance required to trigger a swipe
    if (info.offset.x > threshold) {
      onSwipe(1); // Swipe Right
    } else if (info.offset.x < -threshold) {
      onSwipe(-1); // Swipe Left
    }
  };

  return (
    <motion.div
      className="absolute w-[320px] sm:w-[400px] aspect-[4/5] sm:aspect-[3/4] origin-bottom cursor-grab active:cursor-grabbing"
      style={{
        x: isFront ? x : 0,
        rotate: isFront ? rotate : 0,
        opacity: isFront ? opacity : 1,
        zIndex: totalCards - index,
      }}
      drag={isFront ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      onDragEnd={handleDragEnd}
      initial={{ 
        scale: 0.9, 
        y: 50, 
        opacity: 0 
      }}
      animate={{ 
        scale: 1 - index * 0.05, // Cards behind get smaller
        y: index * 25, // Cards behind are pushed down
        opacity: 1 - index * 0.2, // Cards behind fade out
      }}
      exit={{ 
        x: x.get() > 0 ? 500 : -500, // Fly off in the direction dragged
        opacity: 0, 
        rotate: x.get() > 0 ? 30 : -30,
        transition: { duration: 0.4, ease: "easeOut" }
      }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div className="w-full h-full bg-[#0d0d0d] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden relative group">
        {/* Shimmer Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-600/10 opacity-50 pointer-events-none" />
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8 relative z-10">
          <span className="font-mono text-5xl font-black text-white/10 select-none">
            {milestone.id}
          </span>
          <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs tracking-widest rounded-full uppercase select-none">
            {milestone.year}
          </span>
        </div>

        {/* Content */}
        <div className="relative z-10 flex-1">
          <h3 className="text-2xl sm:text-3xl font-bold uppercase tracking-wider text-white mb-4 leading-tight select-none">
            {milestone.title}
          </h3>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed select-none">
            {milestone.desc}
          </p>
        </div>

        {/* Footer Hint */}
        <div className="mt-auto pt-6 text-center text-xs font-mono text-cyan-500/50 uppercase tracking-widest select-none flex items-center justify-center gap-2">
          <span>←</span> Swipe to Explore <span>→</span>
        </div>
      </div>
    </motion.div>
  );
};

export default function Timeline() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSwipe = (_direction: number) => {
    // We don't actually care about direction (left/right), any swipe just pops the top card to show the next in history.
    setCurrentIndex((prev) => prev + 1);
  };

  const resetJourney = () => {
    setCurrentIndex(0);
  };

  // Only render the top 3 cards for performance
  const visibleCards = milestones.slice(currentIndex, currentIndex + 3);

  return (
    <section
      id="timeline"
      className="relative bg-black text-white min-h-[90vh] sm:min-h-screen flex flex-col items-center justify-center overflow-hidden py-24"
    >
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-950/20 blur-[150px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 z-30 text-center w-full px-6">
        <span className="text-cyan-400 font-mono text-xs sm:text-sm tracking-widest uppercase px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full">
          Exhibit.03
        </span>
        <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-[0.15em] text-white mt-6">
          The Journey
        </h2>
      </div>

      {/* Playing Cards Stack */}
      <div className="relative flex items-center justify-center w-full flex-1 mt-12 sm:mt-24 perspective-[1000px]">
        <AnimatePresence mode="popLayout">
          {currentIndex < milestones.length ? (
            visibleCards.map((milestone, idx) => (
              <Card
                key={milestone.id}
                milestone={milestone}
                index={idx}
                totalCards={milestones.length}
                isFront={idx === 0}
                onSwipe={handleSwipe}
              />
            ))
          ) : (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="flex flex-col items-center justify-center text-center z-10"
            >
              <h3 className="text-3xl font-black uppercase tracking-wider text-cyan-400 mb-4">
                Journey Up To Date
              </h3>
              <p className="text-gray-400 max-w-sm mb-8">
                You've swiped through the entire history. The next chapter is still being written.
              </p>
              <button
                onClick={resetJourney}
                className="px-6 py-3 bg-white text-black font-bold uppercase tracking-wider text-sm hover:bg-cyan-400 hover:shadow-[0_0_20px_#06b6d4] transition-all duration-300 rounded-full"
              >
                Rewind History
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Fallback Buttons for Desktop/Non-Touch Users */}
      {currentIndex < milestones.length && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex gap-6">
          <button 
            onClick={() => handleSwipe(-1)}
            className="w-14 h-14 rounded-full border border-white/20 bg-black/50 backdrop-blur-md flex items-center justify-center text-white/50 hover:text-white hover:border-cyan-400 hover:bg-cyan-500/10 transition-all duration-300"
          >
            ←
          </button>
          <button 
            onClick={() => handleSwipe(1)}
            className="w-14 h-14 rounded-full border border-white/20 bg-black/50 backdrop-blur-md flex items-center justify-center text-white/50 hover:text-white hover:border-cyan-400 hover:bg-cyan-500/10 transition-all duration-300"
          >
            →
          </button>
        </div>
      )}
    </section>
  );
}
