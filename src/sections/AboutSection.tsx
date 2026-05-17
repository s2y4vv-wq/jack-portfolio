import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import FadeIn from '../components/FadeIn';
import ContactButton from '../components/ContactButton';
import AnimatedText from '../components/AnimatedText';

const aboutLines = [
  "AIGC创作者",
  "专注于智能体及工作流搭建",
  "高效赋能AI",
];

function ParallaxImage({ src, className, speed = 0.5, direction = 1 }: { src: string; className: string; speed?: number; direction?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [250 * speed * direction, -250 * speed * direction]);
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.3, 1, 1, 0.3]);

  return (
    <motion.div ref={ref} className={className} style={{ y, opacity, willChange: 'transform' }}>
      <img src={src} alt="" />
    </motion.div>
  );
}

export default function AboutSection() {
  return (
    <section id="about" className="relative min-h-screen px-5 sm:px-8 md:px-10 py-20 flex flex-col items-center justify-center overflow-hidden">
      {/* Decorative 3D images — scroll-driven parallax */}
      <ParallaxImage
        src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png"
        className="absolute top-[4%] left-[1%] sm:left-[2%] md:left-[4%] pointer-events-none w-[120px] sm:w-[160px] md:w-[210px]"
        speed={0.8}
        direction={-1}
      />

      <ParallaxImage
        src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png"
        className="absolute bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%] pointer-events-none w-[100px] sm:w-[140px] md:w-[180px]"
        speed={1.0}
        direction={-1}
      />

      <ParallaxImage
        src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png"
        className="absolute top-[4%] right-[1%] sm:right-[2%] md:right-[4%] pointer-events-none w-[120px] sm:w-[160px] md:w-[210px]"
        speed={0.9}
        direction={1}
      />

      <ParallaxImage
        src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png"
        className="absolute bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%] pointer-events-none w-[130px] sm:w-[170px] md:w-[220px]"
        speed={1.2}
        direction={1}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-10 sm:gap-14 md:gap-16">
        <FadeIn delay={0} y={40}>
          <h2
            className="hero-heading font-black uppercase leading-none tracking-tight text-center"
            style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
          >
            About me
          </h2>
        </FadeIn>

        <div className="flex flex-col items-center gap-16 sm:gap-20 md:gap-24">
          <div className="flex flex-col items-center gap-2">
            {aboutLines.map((line, i) => (
              <AnimatedText
                key={i}
                text={line}
                className="text-[#D7E2EA] font-medium text-center leading-relaxed max-w-[560px]"
                style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}
              />
            ))}
          </div>

          <ContactButton />
        </div>
      </div>
    </section>
  );
}
