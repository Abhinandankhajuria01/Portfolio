import { motion } from 'framer-motion';

export default function AboutMe() {
  return (
    <section id="about-me" className="py-16 md:py-32 px-6 bg-white text-black relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        
        <div className="flex flex-col lg:flex-row gap-8 md:gap-16 items-center">
          
          {/* Image/Visual Column */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="w-2/3 sm:w-1/2 lg:w-5/12 mx-auto relative"
          >
            <div className="aspect-[4/5] bg-gray-100 rounded-2xl overflow-hidden relative group">
              <div className="absolute inset-0 bg-[url('/profile-photo.jpg')] bg-cover bg-center grayscale hover:grayscale-0 transition-all duration-700 group-hover:scale-105"></div>
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500"></div>
            </div>
            {/* Floating abstract element */}
            <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-black rounded-full mix-blend-multiply blur-2xl opacity-20 animate-pulse"></div>
          </motion.div>

          {/* Text Column */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-7/12"
          >
            <p className="text-gray-500 font-mono text-sm tracking-widest uppercase mb-4">Beyond the Resume</p>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-[0.1em] mb-8 leading-none">
              More Than <br /> Just Code.
            </h2>
            
            <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
              <p>
                I am a self-taught developer who believes that the best engineers are the ones who combine deep technical expertise with relentless curiosity. My journey didn't start with a perfect roadmap; it started with a genuine fascination for how things work and a stubborn refusal to give up when things broke.
              </p>
              <p>
                When I'm not building scalable web architectures or integrating AI models, I channel my creativity into content creation and video editing. This intersection of logic and art allows me to tell compelling stories—whether through a seamlessly animated UI, a well-structured backend, or an engaging video.
              </p>
              <p>
                I thrive in environments where the answer isn't obvious. I love diving into complex problems, experimenting with cutting-edge tech, and building products that actually matter to the people using them.
              </p>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200 grid grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold uppercase tracking-wider text-sm text-black mb-2">Based In</h4>
                <p className="text-gray-500">Punjab, India</p>
              </div>
              <div>
                <h4 className="font-bold uppercase tracking-wider text-sm text-black mb-2">Interests</h4>
                <p className="text-gray-500">AI, Filmmaking, Fitness, Gaming</p>
              </div>
            </div>

          </motion.div>
        </div>

      </div>
    </section>
  );
}
