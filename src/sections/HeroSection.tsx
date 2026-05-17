import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import FadeIn from '../components/FadeIn';
import Magnet from '../components/Magnet';

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  // Scroll-driven transforms
  const portraitScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.55]);
  const portraitOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const portraitY = useTransform(scrollYProgress, [0, 0.6], [0, -120]);
  const headingY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  // Mouse-driven parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springMouseX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const springMouseY = useSpring(mouseY, { stiffness: 100, damping: 30 });
  const mousePortraitX = useTransform(springMouseX, [-1, 1], [40, -40]);
  const mousePortraitY = useTransform(springMouseY, [-1, 1], [30, -30]);
  const mouseHeadingX = useTransform(springMouseX, [-1, 1], [-20, 20]);

  useEffect(() => {
    let ticking = false;
    const handleMouseMove = (e: MouseEvent) => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const { innerWidth, innerHeight } = window;
        mouseX.set((e.clientX / innerWidth) * 2 - 1);
        mouseY.set((e.clientY / innerHeight) * 2 - 1);
        ticking = false;
      });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section ref={sectionRef} className="relative h-screen flex flex-col overflow-x-clip bg-transparent">
      {/* Hero Heading */}
      <motion.div
        className="overflow-hidden w-full px-6 md:px-10 mt-6 sm:mt-4 md:-mt-5 relative z-10"
        style={{ y: headingY, x: mouseHeadingX }}
      >
        <FadeIn delay={0.15} y={40}>
          <h1 className="hero-heading font-black uppercase tracking-tight leading-none whitespace-nowrap w-full text-[10vw] sm:text-[11vw] md:text-[12vw] lg:text-[13vw]">
            {"Hi, i'm simple"}
          </h1>
        </FadeIn>
      </motion.div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Hero Portrait - scroll + mouse parallax */}
      <motion.div
        className="absolute left-1/2 z-10 top-1/2 sm:top-auto sm:translate-y-0 sm:bottom-0"
        style={{
          scale: portraitScale,
          opacity: portraitOpacity,
          y: portraitY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          style={{
            x: mousePortraitX,
            y: mousePortraitY,
          }}
        >
          <FadeIn delay={0.6} y={30}>
            <Magnet padding={150} strength={3}>
              <img
                src="https://shrug-person-78902957.figma.site/_components/v2/d24c01ad3a56fc65e942a1f501eb73db42d7cf9a/Rectangle_40443.81459862.png"
                alt="Portrait"
                className="w-[280px] sm:w-[360px] md:w-[440px] lg:w-[520px] pointer-events-none select-none cursor-hover"
              />
            </Magnet>
          </FadeIn>
        </motion.div>
      </motion.div>
    </section>
  );
}
