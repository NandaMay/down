import React, { useState, useRef } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Maximize, Download, Sparkles } from 'lucide-react';
import { VideoMetadata, FormatOption } from '../types';

interface Props {
  video: VideoMetadata;
  selectedFormat?: FormatOption;
  onClose: () => void;
  onDownload: (format: FormatOption) => void;
}

export const VideoPlayerModal: React.FC<Props> = ({ video, selectedFormat, onClose, onDownload }) => {
  const activeFormat = selectedFormat || video.formats.find(f => f.isHd) || video.formats[0];
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleSpeedChange = (rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-5">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-3.5 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0 pr-2">
            <span className="flex items-center gap-1 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
              <Sparkles className="w-3 h-3" />
              1080P HD
            </span>
            <p className="text-xs font-semibold text-slate-200 truncate">{video.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Canvas */}
        <div className="relative bg-black flex items-center justify-center aspect-[9/16] max-h-[55vh] overflow-hidden">
          <video
            ref={videoRef}
            src={activeFormat.url}
            autoPlay
            playsInline
            loop
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className="w-full h-full object-contain"
          />

          {/* Central Play/Pause overlay button */}
          <button
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-transparent group"
          >
            {!isPlaying && (
              <div className="w-16 h-16 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-lg transition-transform scale-100 group-hover:scale-110">
                <Play className="w-7 h-7 fill-white translate-x-0.5" />
              </div>
            )}
          </button>

          {/* Floating HD badge */}
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md border border-white/10 px-2 py-1 rounded-md text-[10px] font-mono text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{activeFormat.quality}</span>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="p-3 bg-slate-950/90 border-t border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlay}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
              </button>
              <button
                onClick={toggleMute}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Playback speed selector */}
            <div className="flex items-center gap-1 text-[11px]">
              {[0.75, 1, 1.25, 1.5, 2].map(rate => (
                <button
                  key={rate}
                  onClick={() => handleSpeedChange(rate)}
                  className={`px-1.5 py-0.5 rounded transition ${
                    playbackRate === rate
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {rate}x
                </button>
              ))}
              <button
                onClick={handleFullscreen}
                className="p-1.5 ml-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                <Maximize className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Direct Download Button */}
          <button
            onClick={() => onDownload(activeFormat)}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-bold py-2.5 rounded-xl shadow-lg shadow-indigo-500/25 transition active:scale-98"
          >
            <Download className="w-4 h-4" />
            <span>Download {activeFormat.quality} ({activeFormat.fileSizeEstimate})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
