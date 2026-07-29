import { motion, useScroll, useTransform } from 'framer-motion';

import ParticleSphere from './ParticleSphere';

export default function Hero() {
  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacityBg = useTransform(scrollY, [0, 800], [1, 0]);

  return (
    <section className="relative min-h-0 md:min-h-[90vh] flex flex-col items-center justify-center bg-black mb-0 md:mb-24 pt-16 pb-6 md:py-0 overflow-hidden">
      {/* 3D Particle Sphere Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div 
          style={{ y: yBg, opacity: opacityBg }}
          className="absolute inset-0 w-full h-full origin-top"
        >
          <ParticleSphere />
        </motion.div>
      </div>
      
      {/* Gradient overlay to blend with the rest of the page */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-black/40 to-black pointer-events-none"></div>

      {/* Centered Typography */}
      <div className="z-10 flex flex-col items-center text-center px-4 md:mt-[-5vh] w-full max-w-[95vw] mb-12 md:mb-0">
        <motion.p 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          className="text-secondary text-xs sm:text-sm md:text-base tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-4 md:mb-6"
        >
          Uncompromising logic
        </motion.p>
        <motion.h1 
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black text-white tracking-wider sm:tracking-[0.1em] uppercase leading-none max-w-full break-words"
        >
          Abhinandan
        </motion.h1>
        <motion.h1 
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
          className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black text-white tracking-wider sm:tracking-[0.1em] uppercase leading-none mb-8 md:mb-12 max-w-full break-words"
        >
          Khajuria
        </motion.h1>
        <motion.a 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: 1 }}
          href="#projects"
          className="border-2 border-white rounded-full px-8 py-3.5 md:px-10 md:py-4 text-white uppercase tracking-[0.2em] text-xs sm:text-sm font-bold hover:bg-white hover:text-black transition-all duration-300 relative z-30 shadow-lg"
        >
          View Projects
        </motion.a>
      </div>

      {/* Floating Bottom Bar (Compact on Mobile) */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, delay: 1 }}
        className="relative md:absolute md:bottom-0 w-[92vw] sm:w-[85vw] lg:left-1/2 lg:-translate-x-1/2 lg:w-full lg:max-w-6xl md:translate-y-1/2 bg-white text-black flex flex-col md:flex-row z-20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-2xl md:rounded-none overflow-visible mt-4 md:mt-0"
      >
        <div className="flex-1 flex flex-col items-center justify-center pt-10 pb-4 md:py-10 border-b md:border-b-0 md:border-r border-gray-200 relative group">
           {/* Grayscale Avatar */}
           <div className="absolute -top-10 w-20 h-20 md:-top-12 md:w-24 md:h-24 rounded-full overflow-hidden grayscale border-4 border-white shadow-xl bg-white transition-transform duration-500 group-hover:scale-110">
             <img src="/avatar.png" alt="Avatar" className="w-full h-full object-cover object-[50%_15%]" />
           </div>
           <h3 className="font-bold uppercase tracking-[0.15em] text-xs md:text-sm mt-3 md:mt-8">AI Engineer</h3>
           <p className="text-[10px] md:text-xs text-gray-500 mt-0.5 uppercase tracking-wider">Intelligent Systems</p>
        </div>
        
        <div className="grid grid-cols-2 md:flex md:flex-2 w-full md:w-auto">
          <div className="flex-1 flex flex-col items-center justify-center py-3 md:py-10 border-r border-gray-200 group cursor-pointer hover:bg-gray-50 transition-colors">
            <h3 className="font-bold uppercase tracking-[0.15em] text-[11px] md:text-sm text-gray-400 group-hover:text-black transition-colors">Full Stack Dev</h3>
            <p className="text-[9px] md:text-xs text-gray-400 mt-0.5 uppercase tracking-wider">End-to-End Solutions</p>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center py-3 md:py-10 bg-black text-white cursor-pointer hover:bg-[#111] transition-colors rounded-br-2xl md:rounded-none">
            <h3 className="font-bold uppercase tracking-[0.15em] text-[11px] md:text-sm">Product Builder</h3>
            <p className="text-[9px] md:text-xs text-gray-400 mt-0.5 uppercase tracking-wider">Idea to Reality</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
