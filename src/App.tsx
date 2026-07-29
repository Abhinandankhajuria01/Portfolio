import { useEffect } from 'react';
import Hero from './components/Hero';
import AboutMe from './components/AboutMe';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Timeline from './components/Timeline';
import MuseumOfFailures from './components/MuseumOfFailures';
import Contact from './components/Contact';
import CustomCursor from './components/CustomCursor';

function ScrollProgressBar() {
  useEffect(() => {
    // JS fallback for browsers without CSS scroll-driven animation support
    if (CSS.supports('animation-timeline', 'scroll()')) return;

    const progress = document.getElementById('scroll-progress');
    if (!progress) return;

    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const pct = scrollable > 0 ? scrolled / scrollable : 0;
      progress.style.transform = `scaleX(${pct})`;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return <div id="scroll-progress" aria-hidden="true" />;
}

function App() {
  return (
    <div className="min-h-screen bg-background text-gray-200 font-sans selection:bg-primary/30 selection:text-cyan-200">
      <ScrollProgressBar />
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
        <p className="text-sm">© {new Date().getFullYear()} Abhinandan Khajuria. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
