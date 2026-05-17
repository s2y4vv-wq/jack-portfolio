import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Folder, Play, ChevronRight, AlertTriangle } from 'lucide-react';
import { videoFolders, VideoFolder } from '../data/videoCollection';

function encodeUrl(path: string) {
  return path.split('/').map(encodeURIComponent).join('/');
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function VideoModal({ open, onClose }: Props) {
  const [activeFolder, setActiveFolder] = useState<VideoFolder | null>(null);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [mobileShowList, setMobileShowList] = useState(true);

  const handleFolderClick = (folder: VideoFolder) => {
    setActiveFolder(folder);
    setPlayingVideo(null);
    setMobileShowList(false);
  };

  const handleBackToList = () => {
    setMobileShowList(true);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

          {/* Modal Container */}
          <motion.div
            className="relative w-[95vw] h-[90vh] max-w-6xl bg-[#0C0C0C] border border-[#D7E2EA]/20 rounded-[40px] overflow-hidden flex"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-[#D7E2EA]/10 hover:bg-[#D7E2EA]/20 flex items-center justify-center transition-colors"
            >
              <X size={18} className="text-[#D7E2EA]" />
            </button>

            {/* Left Sidebar - Folder List (desktop always visible, mobile conditional) */}
            <div
              className={`
                ${mobileShowList ? 'flex' : 'hidden'}
                md:flex flex-col w-full md:w-[280px] lg:w-[320px] shrink-0 border-r border-[#D7E2EA]/10
                p-6 md:p-8
              `}
            >
              <h3 className="text-[#D7E2EA] font-semibold text-lg mb-6 flex items-center gap-2">
                <Folder size={18} />
                视频分类
              </h3>
              <div className="flex-1 overflow-y-auto space-y-1">
                {videoFolders.map((folder) => (
                  <button
                    key={folder.name}
                    onClick={() => handleFolderClick(folder)}
                    className={`
                      w-full text-left px-4 py-3 rounded-xl transition-all flex items-center justify-between group
                      ${activeFolder?.name === folder.name
                        ? 'bg-[#D7E2EA]/15 text-[#D7E2EA]'
                        : 'text-[#D7E2EA]/60 hover:text-[#D7E2EA] hover:bg-[#D7E2EA]/8'
                      }
                    `}
                  >
                    <span className="text-sm font-medium truncate">{folder.name}</span>
                    <span className="flex items-center gap-2 shrink-0">
                      <span className="text-xs opacity-50">{folder.videos.length}</span>
                      <ChevronRight size={14} className="opacity-50 group-hover:opacity-100 transition-opacity" />
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Content Area */}
            <div className={`flex-1 flex flex-col ${!mobileShowList || 'hidden'} md:flex`}>
              {activeFolder ? (
                <>
                  {/* Mobile back button */}
                  <div className="md:hidden flex items-center gap-3 p-6 pb-0">
                    <button
                      onClick={handleBackToList}
                      className="text-[#D7E2EA]/60 hover:text-[#D7E2EA] text-sm flex items-center gap-1"
                    >
                      &larr; 返回分类
                    </button>
                  </div>

                  <div className="flex items-center justify-between px-6 md:px-8 pt-4 md:pt-8 pb-4">
                    <h4 className="text-[#D7E2EA] font-semibold text-lg">
                      {activeFolder.name}
                    </h4>
                    <span className="text-[#D7E2EA]/40 text-sm">{activeFolder.videos.length} 个视频</span>
                  </div>

                  {/* Video Player */}
                  {playingVideo && (
                    <div className="px-6 md:px-8 pb-4">
                      <video
                        key={playingVideo}
                        src={encodeUrl(playingVideo)}
                        controls
                        autoPlay
                        playsInline
                        preload="metadata"
                        className="w-full rounded-2xl max-h-[300px] bg-black"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const container = e.currentTarget.parentElement;
                          if (container) {
                            const msg = container.querySelector('.video-error-msg');
                            if (msg) msg.classList.remove('hidden');
                          }
                        }}
                      />
                      <div className="video-error-msg hidden text-center py-8">
                        <AlertTriangle size={32} className="text-amber-400 mx-auto mb-2" />
                        <p className="text-[#D7E2EA]/70 text-sm mb-3">该视频编码可能不被此浏览器支持</p>
                        <a
                          href={encodeUrl(playingVideo)}
                          download
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D7E2EA]/10 hover:bg-[#D7E2EA]/20 text-[#D7E2EA] text-sm transition-colors"
                        >
                          下载视频到本地播放
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Video Grid */}
                  <div className="flex-1 overflow-y-auto px-6 md:px-8 pb-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {activeFolder.videos.map((video) => (
                        <button
                          key={video.file}
                          onClick={() => setPlayingVideo(video.file)}
                          className={`
                            group relative flex items-center gap-3 p-3 rounded-xl transition-all text-left
                            ${playingVideo === video.file
                              ? 'bg-[#D7E2EA]/15 ring-1 ring-[#D7E2EA]/30'
                              : 'bg-[#D7E2EA]/5 hover:bg-[#D7E2EA]/10'
                            }
                          `}
                        >
                          <span className="w-9 h-9 rounded-lg bg-[#D7E2EA]/15 flex items-center justify-center shrink-0 group-hover:bg-[#D7E2EA]/25 transition-colors">
                            <Play size={14} className="text-[#D7E2EA]" />
                          </span>
                          <span className="text-[#D7E2EA] text-sm truncate">{video.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-[#D7E2EA]/30 text-sm">
                  请选择一个分类查看视频
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
