import Hero from './components/Hero';
import AboutMe from './components/AboutMe';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Timeline from './components/Timeline';
import MuseumOfFailures from './components/MuseumOfFailures';
import Contact from './components/Contact';
import CustomCursor from './components/CustomCursor';

function App() {
  return (
    <div className="min-h-screen bg-background text-gray-200 font-sans selection:bg-primary/30 selection:text-cyan-200">
      <CustomCursor />
      <Hero />
      <About />
      <Projects />
      <Skills />
      <Timeline />
      <MuseumOfFailures />
      <AboutMe />
      <Contact />
      
      <footer className="py-12 flex flex-col items-center justify-center gap-6 border-t border-white/5 text-gray-500">
        {/* 
        <a 
          href="http://localhost:5175" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs uppercase tracking-widest text-gray-400 hover:text-white border border-gray-800 hover:border-gray-500 rounded-full px-6 py-2 transition-all duration-300"
        >
          Read My Autobiography
        </a>
        */}
        <p className="text-sm">© {new Date().getFullYear()} Abhinandan Khajuria. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
