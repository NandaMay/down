import React from 'react';
import {
  Download,
  Play,
  Trash2,
  Share2,
  HardDrive,
  Film,
  Music,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { DownloadTask, Language, VideoMetadata } from '../types';
import { translations } from '../utils/translations';

interface Props {
  language: Language;
  downloads: DownloadTask[];
  onPlay: (task: DownloadTask) => void;
  onDelete: (id: string) => void;
  onReDownload: (task: DownloadTask) => void;
  onClearAll: () => void;
}

export const DownloadsTab: React.FC<Props> = ({
  language,
  downloads,
  onPlay,
  onDelete,
  onReDownload,
  onClearAll,
}) => {
  const t = translations[language];

  const handleShare = async (task: DownloadTask) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: task.title,
          text: `Downloaded in 1080P HD via SnapSave Pro: ${task.title}`,
          url: task.downloadUrl,
        });
      } catch {
        // Ignored or cancelled
      }
    } else {
      navigator.clipboard?.writeText(task.downloadUrl);
      alert('Video download link copied to clipboard!');
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header bar */}
      <div className="flex items-center justify-between bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold text-slate-200">
            {t.navDownloads} ({downloads.length})
          </span>
        </div>

        {downloads.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-[11px] text-rose-400 hover:text-rose-300 font-medium px-2.5 py-1 rounded-lg hover:bg-rose-500/10 transition"
          >
            Clear All
          </button>
        )}
      </div>

      {downloads.length === 0 ? (
        <div className="text-center py-16 px-4 bg-slate-900/40 rounded-3xl border border-slate-800/80">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Download className="w-7 h-7" />
          </div>
          <h4 className="text-sm font-bold text-slate-200">{t.noDownloadsYet}</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            {language === 'my'
              ? 'TikTok, Facebook, Instagram လင့်ခ်များ ထည့်သွင်းပြီး 1080P ဖြင့် စတင်ဒေါင်းလုဒ်လုပ်ပါ'
              : 'Paste any social video link on the Downloader tab to start downloading in 1080P'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {downloads.map(task => {
            const is1080p = task.quality.includes('1080P');
            return (
              <div
                key={task.id}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 shadow-md flex flex-col gap-3"
              >
                <div className="flex items-start gap-3">
                  {/* Thumbnail / Media icon */}
                  <div
                    onClick={() => onPlay(task)}
                    className="relative group cursor-pointer w-20 h-20 rounded-xl overflow-hidden bg-black shrink-0 border border-slate-800"
                  >
                    <img
                      src={task.thumbnail}
                      alt={task.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-indigo-600/90 text-white flex items-center justify-center">
                        <Play className="w-3.5 h-3.5 fill-white translate-x-0.5" />
                      </div>
                    </div>
                    {is1080p && (
                      <span className="absolute top-1 left-1 bg-indigo-500 text-[8px] font-bold px-1 rounded text-white">
                        1080P
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[9px] uppercase font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.2 rounded border border-indigo-500/20">
                        {task.platform}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                          is1080p
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {task.quality}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {task.fileSize}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-200 line-clamp-1 mt-1">
                      {task.title}
                    </h4>

                    {/* Status / Progress */}
                    {task.status === 'downloading' ? (
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between text-[10px] text-indigo-400 font-medium">
                          <span className="flex items-center gap-1">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            {t.downloading}
                          </span>
                          <span>{task.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full transition-all duration-300 rounded-full"
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                      </div>
                    ) : task.status === 'completed' ? (
                      <div className="mt-1.5 flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{t.downloadComplete} (Saved to Device)</span>
                      </div>
                    ) : (
                      <div className="mt-1.5 flex items-center gap-1 text-[11px] text-rose-400">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Download Failed</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onPlay(task)}
                      className="flex items-center gap-1 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-lg transition"
                    >
                      <Play className="w-3 h-3 fill-slate-300" />
                      <span>{t.playVideo}</span>
                    </button>

                    <button
                      onClick={() => onReDownload(task)}
                      className="flex items-center gap-1 text-indigo-300 hover:text-white bg-indigo-600/20 hover:bg-indigo-600/40 px-2.5 py-1 rounded-lg transition"
                    >
                      <Download className="w-3 h-3" />
                      <span>{t.reDownload}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleShare(task)}
                      title="Share Video"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(task.id)}
                      title="Delete from list"
                      className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
