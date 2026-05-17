import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springX = useSpring(mouseX, { stiffness: 250, damping: 28, mass: 0.4 });
  const springY = useSpring(mouseY, { stiffness: 250, damping: 28, mass: 0.4 });

  // Ripple state
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const nextId = useRef(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const onEnter = () => setIsHovering(true);
    const onLeave = () => setIsHovering(false);
    const onLeaveWindow = () => setIsVisible(false);

    const onClick = (e: MouseEvent) => {
      const id = nextId.current++;
      setRipples((prev) => [...prev.slice(-4), { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 800);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseleave', onLeaveWindow);
    window.addEventListener('click', onClick);

    const selector = 'a, button, [role="button"], input, textarea, video, img, .cursor-hover';
    const bindInteractive = () => {
      document.querySelectorAll(selector).forEach((el) => {
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
    };
    bindInteractive();

    const observer = new MutationObserver(bindInteractive);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeaveWindow);
      window.removeEventListener('click', onClick);
      observer.disconnect();
      document.querySelectorAll(selector).forEach((el) => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      });
    };
  }, [mouseX, mouseY, isVisible]);

  return (
    <>
      {/* Ripples on click */}
      {ripples.map((r) => (
        <motion.div
          key={r.id}
          className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full border border-white/40"
          initial={{
            x: r.x - 50,
            y: r.y - 50,
            width: 100,
            height: 100,
            opacity: 0.6,
          }}
          animate={{
            width: 300,
            height: 300,
            x: r.x - 150,
            y: r.y - 150,
            opacity: 0,
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        />
      ))}

      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full border border-white/60"
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: isHovering ? 80 : 32,
          height: isHovering ? 80 : 32,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
      />
      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full bg-white"
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
          mixBlendMode: 'difference',
        }}
        animate={{
          width: isHovering ? 14 : 7,
          height: isHovering ? 14 : 7,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
      />
    </>
  );
}
