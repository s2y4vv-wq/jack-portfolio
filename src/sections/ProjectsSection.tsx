import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import LiveProjectButton from '../components/LiveProjectButton';
import VideoModal from '../components/VideoModal';

interface Project {
  num: string;
  name: string;
  category: string;
  col1Img1: string;
  col1Img2: string;
  col2Img: string;
}

const projects: Project[] = [
  {
    num: '01',
    name: 'movie',
    category: '视频作品',
    col1Img1: '/cover-images/1.png',
    col1Img2: '/cover-images/3.png',
    col2Img: '/cover-images/8.png',
  },
  {
    num: '02',
    name: '',
    category: '画布&工作流',
    col1Img1: '/cover-images/4.png',
    col1Img2: '/cover-images/5.png',
    col2Img: '/cover-images/9.png',
  },
];

function ProjectCard({ project, index, total }: { project: Project; index: number; total: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Kirifuda-style: cards scale from background to foreground
  const targetScale = 1 - (total - 1 - index) * 0.08;
  const rawScale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [targetScale, targetScale, 1, 1]);
  const scale = useSpring(rawScale, { stiffness: 100, damping: 25 });

  // Card rotates slightly as it "comes forward" in 3D space
  const rotateX = useTransform(scrollYProgress, [0, 1], [2 * (total - index), 0]);
  const springRotateX = useSpring(rotateX, { stiffness: 80, damping: 25 });

  // Inner images scale up slightly as card comes to front
  const imageScale = useTransform(scrollYProgress, [0, 0.6, 1], [1, 1, 1.02]);
  const springImageScale = useSpring(imageScale, { stiffness: 80, damping: 25 });

  // Opacity of background cards
  const cardOpacity = useTransform(scrollYProgress, [0, 0.3, 1], [0.7, 0.85, 1]);

  return (
    <div ref={containerRef} className="h-[85vh]">
      <motion.div
        className="sticky top-20 md:top-28 rounded-[40px] sm:rounded-[50px] md:rounded-[60px] border-2 border-[#D7E2EA]/40 bg-[#0C0C0C] p-4 sm:p-6 md:p-8 overflow-hidden"
        style={{
          scale,
          opacity: cardOpacity,
          top: `calc(${index * 25}px + 5vh)`,
          rotateX: springRotateX,
          willChange: 'transform, opacity',
          boxShadow: `0 30px 80px rgba(0,0,0,${0.5 + index * 0.1})`,
        }}
      >
        {/* Card header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-4 sm:gap-6">
            <span
              className="text-[#D7E2EA] font-black leading-none"
              style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}
            >
              {project.num}
            </span>
            <div>
              <span className="text-[#D7E2EA]/60 font-light uppercase tracking-wider text-xs sm:text-sm">
                {project.category}
              </span>
              <h3
                className="text-[#D7E2EA] font-medium uppercase"
                style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}
              >
                {project.name}
              </h3>
            </div>
          </div>
          <LiveProjectButton />
        </div>

        {/* Image grid with kirifuda-style inner parallax */}
        <motion.div className="flex gap-3 sm:gap-4" style={{ scale: springImageScale }}>
          <div className={project.col2Img ? 'w-[40%]' : 'w-full flex flex-row gap-3 sm:gap-4'}>
            <div
              className="rounded-[40px] sm:rounded-[50px] md:rounded-[60px] overflow-hidden"
              style={{ height: 'clamp(130px, 16vw, 230px)', flex: project.col2Img ? 'none' : 1 }}
            >
              <img src={project.col1Img1} alt="" className="w-full h-full object-cover cursor-hover" loading="lazy" />
            </div>
            <div
              className="rounded-[40px] sm:rounded-[50px] md:rounded-[60px] overflow-hidden"
              style={{ height: 'clamp(160px, 22vw, 340px)', flex: project.col2Img ? 'none' : 1 }}
            >
              <img src={project.col1Img2} alt="" className="w-full h-full object-cover cursor-hover" loading="lazy" />
            </div>
          </div>
          {project.col2Img && (
            <div className="w-[60%] rounded-[40px] sm:rounded-[50px] md:rounded-[60px] overflow-hidden h-full min-h-[300px] sm:min-h-[400px] md:min-h-[500px]">
              <img src={project.col2Img} alt="" className="w-full h-full object-cover cursor-hover" loading="lazy" />
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Kirifuda-style scroll indicator bar
  const barWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="bg-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 relative z-10 px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32"
    >
      <h2
        className="hero-heading font-black uppercase text-center mb-8 sm:mb-12 md:mb-16"
        style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
      >
        Project
      </h2>

      {/* Kirifuda-style ScrollAnotation — progress bar */}
      <div className="flex items-center justify-center gap-3 mb-12 sm:mb-16 md:mb-20">
        <span className="text-[#D7E2EA]/50 font-light uppercase tracking-widest text-[10px] sm:text-xs">
          Scroll to explore
        </span>
        <div className="w-24 sm:w-32 h-px bg-[#D7E2EA]/20 overflow-hidden">
          <motion.div
            className="h-full bg-[#D7E2EA]"
            style={{ width: barWidth }}
          />
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        {projects.map((project, i) => (
          <div
            key={project.num}
            onClick={i === 0 ? () => setVideoModalOpen(true) : undefined}
            className={i === 0 ? 'cursor-pointer' : ''}
          >
            <ProjectCard project={project} index={i} total={projects.length} />
          </div>
        ))}
      </div>

      <VideoModal open={videoModalOpen} onClose={() => setVideoModalOpen(false)} />
    </section>
  );
}
