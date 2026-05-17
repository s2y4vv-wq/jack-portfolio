import { useRef } from 'react';
import { motion, useScroll, useSpring, useMotionValueEvent, useMotionValue } from 'framer-motion';
import { useState } from 'react';

interface AnimatedTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function AnimatedText({ text, className = '', style }: AnimatedTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [progress, setProgress] = useState(0);
  const scrollProgress = useMotionValue(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.2'],
  });

  const smoothProgress = useSpring(scrollProgress, { stiffness: 100, damping: 30 });

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    scrollProgress.set(latest);
  });

  useMotionValueEvent(smoothProgress, 'change', (latest) => {
    setProgress(latest);
  });

  const chars = text.split('');

  return (
    <p ref={ref} className={className} style={style}>
      {chars.map((char, i) => {
        const charStart = i / chars.length;
        const charEnd = charStart + 0.15;
        let opacity: number;
        if (progress >= charEnd) opacity = 1;
        else if (progress <= charStart) opacity = 0.2;
        else opacity = 0.2 + ((progress - charStart) / (charEnd - charStart)) * 0.8;

        return (
          <motion.span
            key={i}
            style={{ opacity, display: 'inline' }}
            transition={{ duration: 0 }}
          >
            {char}
          </motion.span>
        );
      })}
    </p>
  );
}
