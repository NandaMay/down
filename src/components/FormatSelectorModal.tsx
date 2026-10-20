import React from 'react';
import { X, Sparkles, Download, Music, Film, CheckCircle2 } from 'lucide-react';
import { VideoMetadata, FormatOption, Language } from '../types';
import { translations } from '../utils/translations';

interface Props {
  video: VideoMetadata;
  language: Language;
  onClose: () => void;
  onSelectFormat: (format: FormatOption) => void;
}

export const FormatSelectorModal: React.FC<Props> = ({ video, language, onClose, onSelectFormat }) => {
  const t = translations[language];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              {t.selectQuality}
            </h3>
            <p className="text-[11px] text-slate-400 truncate max-w-[280px] mt-0.5">{video.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video mini preview bar */}
        <div className="p-3 bg-slate-950/40 border-b border-slate-800/60 flex items-center gap-3">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-14 h-14 rounded-lg object-cover border border-slate-800 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
              {video.platform}
            </span>
            <p className="text-xs text-slate-300 font-medium truncate mt-1">{video.author}</p>
            {video.hasNoWatermark && (
              <p className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3 h-3" />
                <span>{t.noWatermark}</span>
              </p>
            )}
          </div>
        </div>

        {/* Formats list */}
        <div className="p-4 space-y-2.5 max-h-[50vh] overflow-y-auto">
          {video.formats.map((format, idx) => {
            const is1080p = format.quality.includes('1080P');
            return (
              <div
                key={format.id || idx}
                onClick={() => onSelectFormat(format)}
                className={`group cursor-pointer rounded-xl p-3 border transition-all flex items-center justify-between ${
                  is1080p
                    ? 'bg-gradient-to-r from-indigo-950/60 to-purple-950/50 border-indigo-500/50 hover:border-indigo-400 shadow-md shadow-indigo-950/50'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      format.isAudioOnly
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : is1080p
                        ? 'bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-md'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {format.isAudioOnly ? <Music className="w-4 h-4" /> : <Film className="w-4 h-4" />}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-bold text-white">{format.quality}</span>
                      {is1080p && (
                        <span className="bg-indigo-500 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded text-white tracking-wide">
                          Best / 1080P
                        </span>
                      )}
                      {format.fps && (
                        <span className="bg-slate-800 text-[9px] text-slate-400 px-1 py-0.5 rounded font-mono">
                          {format.fps}fps
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{format.label}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 pl-2">
                  <div className="text-right">
                    <span className="text-xs font-mono font-medium text-slate-300 block">
                      {format.fileSizeEstimate}
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase font-bold">{format.ext}</span>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-indigo-600/80 group-hover:bg-indigo-600 text-white flex items-center justify-center transition">
                    <Download className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-950/80 border-t border-slate-800 text-center">
          <p className="text-[10px] text-slate-400">
            {language === 'my'
              ? 'ဒေါင်းလုဒ်လုပ်ပြီးပါက သင့်ဖုန်း၏ Downloads ဖိုဒါထဲသို့ တိုက်ရိုက်သိမ်းဆည်းပေးမည် ဖြစ်ပါသည်'
              : 'Files will be saved directly to your device Downloads storage folder'}
          </p>
        </div>
      </div>
    </div>
  );
};
