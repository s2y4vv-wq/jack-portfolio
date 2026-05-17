import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface VideoItem {
  src: string;
  label: string;
}

function enc(path: string) {
  return path.split('/').map(encodeURIComponent).join('/');
}

const baseUrl = import.meta.env.BASE_URL + 'video-collection';

const allVideos: VideoItem[] = [
  { label: 'AE动画作品', src: `${baseUrl}/AE动画作品/AE-动效-TK-高播放 (1).mp4` },
  { label: 'AI 动画实验', src: `${baseUrl}/AI 动画实验/白虎水墨CG动画.mp4` },
  { label: 'AI 视觉艺术短片', src: `${baseUrl}/AI 视觉艺术短片/归零花园混剪.mp4` },
  { label: 'AI创意长剧', src: `${baseUrl}/AI创意长剧/AI_titanium.mp4` },
  { label: 'TK口播短视频', src: `${baseUrl}/TK口播短视频/德国TK高播放 (1).mp4` },
  { label: '政务纪录访谈', src: `${baseUrl}/政务纪录访谈/五彩瓷拍剪.mp4` },
  { label: '数字人', src: `${baseUrl}/数字人/跑量数字人 (1).mp4` },
  { label: '科普教学短视频', src: `${baseUrl}/科普教学短视频/迪拜中东 k线科普.mp4` },
];

// Split into two rows
const row1 = allVideos.slice(0, 4);
const row2 = allVideos.slice(4, 8);
// Triple for seamless looping
const row1Tripled = [...row1, ...row1, ...row1];
const row2Tripled = [...row2, ...row2, ...row2];

function VideoTile({ video }: { video: VideoItem }) {
  return (
    <div className="w-[260px] sm:w-[300px] md:w-[340px] h-[170px] sm:h-[200px] md:h-[220px] flex-shrink-0 rounded-2xl overflow-hidden relative group">
      <video
        src={enc(video.src)}
        className="w-full h-full object-cover"
        autoPlay muted loop playsInline
        preload="metadata"
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-[#D7E2EA] text-xs font-medium">{video.label}</span>
      </div>
    </div>
  );
}

export default function MarqueeSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const row1X = useTransform(scrollYProgress, [0, 1], [-900, 900]);
  const row2X = useTransform(scrollYProgress, [0, 1], [900, -900]);

  return (
    <section ref={sectionRef} className="bg-[#0C0C0C] pt-24 sm:pt-32 md:pt-40 pb-10 overflow-hidden">
      {/* Row 1 - moves RIGHT */}
      <motion.div className="flex gap-3 mb-3" style={{ x: row1X, willChange: 'transform' }}>
        {row1Tripled.map((video, i) => (
          <VideoTile key={`r1-${i}`} video={video} />
        ))}
      </motion.div>

      {/* Row 2 - moves LEFT */}
      <motion.div className="flex gap-3" style={{ x: row2X, willChange: 'transform' }}>
        {row2Tripled.map((video, i) => (
          <VideoTile key={`r2-${i}`} video={video} />
        ))}
      </motion.div>
    </section>
  );
}
