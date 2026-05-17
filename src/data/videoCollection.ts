export interface VideoItem {
  name: string;
  file: string;
}

export interface VideoFolder {
  name: string;
  videos: VideoItem[];
}

const baseUrl = import.meta.env.BASE_URL + 'video-collection';

export const videoFolders: VideoFolder[] = [
  {
    name: 'AE动画作品',
    videos: [
      { name: 'AE-动效-TK-高播放 (1)', file: `${baseUrl}/AE动画作品/AE-动效-TK-高播放 (1).mp4` },
      { name: 'AE-动效-TK-高播放 (2)', file: `${baseUrl}/AE动画作品/AE-动效-TK-高播放 (2).mp4` },
      { name: 'AE-动效-TK-高播放 (3)', file: `${baseUrl}/AE动画作品/AE-动效-TK-高播放 (3).mp4` },
    ],
  },
  {
    name: 'AI 动画实验',
    videos: [
      { name: '白虎水墨CG动画', file: `${baseUrl}/AI 动画实验/白虎水墨CG动画.mp4` },
    ],
  },
  {
    name: 'AI 视觉艺术短片',
    videos: [
      { name: '归零花园混剪', file: `${baseUrl}/AI 视觉艺术短片/归零花园混剪.mp4` },
    ],
  },
  {
    name: 'AI创意长剧',
    videos: [
      { name: 'AI创意短剧 钛', file: `${baseUrl}/AI创意长剧/AI_titanium.mp4` },
    ],
  },
  {
    name: 'AI图文制作&工作流搭建',
    videos: [
      { name: 'AI图文制作 (1)', file: `${baseUrl}/AI图文制作&工作流搭建/AI图文制作 (1).mp4` },
      { name: 'AI图文制作 (2)', file: `${baseUrl}/AI图文制作&工作流搭建/AI图文制作 (2).mp4` },
      { name: 'AI图文制作 (3)', file: `${baseUrl}/AI图文制作&工作流搭建/AI图文制作 (3).mp4` },
      { name: 'AI图文制作 (4)', file: `${baseUrl}/AI图文制作&工作流搭建/AI图文制作 (4).mp4` },
    ],
  },
  {
    name: 'TK口播短视频',
    videos: [
      { name: '德国TK高播放 (1)', file: `${baseUrl}/TK口播短视频/德国TK高播放 (1).mp4` },
      { name: '德国TK高播放 (2)', file: `${baseUrl}/TK口播短视频/德国TK高播放 (2).mp4` },
      { name: '日区', file: `${baseUrl}/TK口播短视频/日区.mp4` },
      { name: '美国TK高播放 (1)', file: `${baseUrl}/TK口播短视频/美国TK高播放 (1).mp4` },
      { name: '美国TK高播放 (2)', file: `${baseUrl}/TK口播短视频/美国TK高播放 (2).mp4` },
      { name: '美国TK高播放 (3)', file: `${baseUrl}/TK口播短视频/美国TK高播放 (3).mp4` },
      { name: '美国TK高播放 (4)', file: `${baseUrl}/TK口播短视频/美国TK高播放 (4).mp4` },
      { name: '美国TK高播放 (5)', file: `${baseUrl}/TK口播短视频/美国TK高播放 (5).mp4` },
    ],
  },
  {
    name: '政务纪录访谈',
    videos: [
      { name: '五彩瓷拍剪', file: `${baseUrl}/政务纪录访谈/五彩瓷拍剪.mp4` },
      { name: '五彩瓷政务纪录', file: `${baseUrl}/政务纪录访谈/五彩瓷政务纪录.mp4` },
    ],
  },
  {
    name: '数字人',
    videos: [
      { name: '跑量数字人 (1)', file: `${baseUrl}/数字人/跑量数字人 (1).mp4` },
      { name: '跑量数字人 (2)', file: `${baseUrl}/数字人/跑量数字人 (2).mp4` },
      { name: '跑量数字人 (3)', file: `${baseUrl}/数字人/跑量数字人 (3).mp4` },
    ],
  },
  {
    name: '科普教学短视频',
    videos: [
      { name: '迪拜中东 k线科普', file: `${baseUrl}/科普教学短视频/迪拜中东 k线科普.mp4` },
    ],
  },
];
