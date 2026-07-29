import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type RevealOptions = {
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  duration?: number;
  delay?: number;
  stagger?: number;
  ease?: string;
  scrub?: boolean | number;
  once?: boolean;
};

/**
 * Applies a scroll-triggered GSAP entrance animation to an element or a set
 * of children (.reveal-item) inside it.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  opts: RevealOptions = {}
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const {
      direction = 'up',
      distance = 60,
      duration = 0.9,
      delay = 0,
      stagger = 0.12,
      ease = 'power3.out',
      scrub = false,
      once = true,
    } = opts;

    const xFrom = direction === 'left' ? -distance : direction === 'right' ? distance : 0;
    const yFrom = direction === 'up' ? distance : direction === 'down' ? -distance : 0;

    const targets = el.querySelectorAll<HTMLElement>('.reveal-item');
    const animTargets = targets.length > 0 ? Array.from(targets) : [el];

    const ctx = gsap.context(() => {
      gsap.fromTo(
        animTargets,
        { opacity: 0, x: xFrom, y: yFrom, scale: direction === 'none' ? 0.92 : 1 },
        {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration,
          delay,
          stagger,
          ease,
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            end: 'top 50%',
            toggleActions: once
              ? 'play none none none'
              : 'play reverse play reverse',
            scrub: scrub ? (typeof scrub === 'number' ? scrub : 1) : false,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return ref;
}
