import React, { useState } from 'react';
import {
  Link2,
  ClipboardPaste,
  Sparkles,
  Download,
  Play,
  CheckCircle2,
  Eye,
  Heart,
  Loader2,
  Clock,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { VideoMetadata, FormatOption, Language } from '../types';
import { translations } from '../utils/translations';

interface Props {
  language: Language;
  onDownload: (video: VideoMetadata, format: FormatOption) => void;
  onPreview: (video: VideoMetadata) => void;
  sampleVideos: VideoMetadata[];
}

export const DownloaderTab: React.FC<Props> = ({
  language,
  onDownload,
  onPreview,
  sampleVideos,
}) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fetchedVideo, setFetchedVideo] = useState<VideoMetadata | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const t = translations[language];

  const handlePaste = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text && text.trim().startsWith('http')) {
          setUrl(text.trim());
          handleFetch(text.trim());
          return;
        }
      }
    } catch {
      // Fallback: user can manually paste
    }
  };

  const handleFetch = async (targetUrl?: string) => {
    const inputUrl = (targetUrl || url).trim();
    if (!inputUrl) {
      setErrorMessage(
        language === 'my'
          ? 'ကျေးဇူးပြု၍ Video လင့်ခ်ကို အရင်ထည့်သွင်းပါ'
          : 'Please enter a video URL first'
      );
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setFetchedVideo(null);

    try {
      const res = await fetch('/api/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: inputUrl }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to fetch video');
      }

      setFetchedVideo(data.data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Video parsing failed';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const selectSample = (sample: VideoMetadata) => {
    setUrl(sample.originalUrl);
    setFetchedVideo(sample);
    setErrorMessage('');
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Search / Paste Input Box */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl shadow-slate-950/50 backdrop-blur-md">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Link2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Social Video URL</span>
          </label>
          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-semibold">
            1080P HD Engine Active
          </span>
        </div>

        <div className="relative">
          <input
            type="text"
            value={url}
            onChange={e => {
              setUrl(e.target.value);
              if (errorMessage) setErrorMessage('');
            }}
            onKeyDown={e => {
              if (e.key === 'Enter') handleFetch();
            }}
            placeholder={t.inputPlaceholder}
            className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-2xl py-3.5 pl-4 pr-24 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 outline-none transition"
          />

          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            <button
              onClick={handlePaste}
              title="Paste from clipboard"
              className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-2.5 py-1.5 rounded-xl border border-slate-700 transition active:scale-95"
            >
              <ClipboardPaste className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">{t.pasteBtn}</span>
            </button>
          </div>
        </div>

        {errorMessage && (
          <p className="mt-2 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-3 py-2">
            {errorMessage}
          </p>
        )}

        {/* Action Button */}
        <button
          onClick={() => handleFetch()}
          disabled={isLoading}
          className="mt-3.5 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-3.5 rounded-2xl text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition active:scale-[0.99] disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{t.fetching}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>{t.fetchBtn}</span>
            </>
          )}
        </button>

        {/* Supported Platforms Chips */}
        <div className="mt-4 pt-3.5 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar text-[11px] text-slate-400">
          <span className="text-[10px] text-slate-500 uppercase font-semibold shrink-0">Supported:</span>
          <span className="shrink-0 bg-slate-800/80 px-2.5 py-1 rounded-full text-slate-300 font-medium border border-slate-700/50">
            TikTok (No Watermark)
          </span>
          <span className="shrink-0 bg-slate-800/80 px-2.5 py-1 rounded-full text-slate-300 font-medium border border-slate-700/50">
            Facebook Reels/HD
          </span>
          <span className="shrink-0 bg-slate-800/80 px-2.5 py-1 rounded-full text-slate-300 font-medium border border-slate-700/50">
            Instagram Reels 1080P
          </span>
          <span className="shrink-0 bg-slate-800/80 px-2.5 py-1 rounded-full text-slate-300 font-medium border border-slate-700/50">
            YouTube Shorts
          </span>
          <span className="shrink-0 bg-slate-800/80 px-2.5 py-1 rounded-full text-slate-300 font-medium border border-slate-700/50">
            X / Twitter
          </span>
        </div>
      </div>

      {/* Fetched Video Result Card */}
      {fetchedVideo && (
        <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-indigo-500/30 rounded-3xl p-4 sm:p-5 shadow-2xl shadow-indigo-950/40">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
              {fetchedVideo.platform} Detected
            </span>
            {fetchedVideo.hasNoWatermark && (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t.noWatermark}</span>
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Thumbnail preview with play badge */}
            <div
              onClick={() => onPreview(fetchedVideo)}
              className="relative group cursor-pointer w-full sm:w-44 aspect-video sm:aspect-[4/3] rounded-2xl overflow-hidden bg-black shrink-0 border border-slate-800 shadow-md"
            >
              <img
                src={fetchedVideo.thumbnail}
                alt={fetchedVideo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-center justify-center transition">
                <div className="w-12 h-12 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 fill-white translate-x-0.5" />
                </div>
              </div>
              <span className="absolute bottom-2 right-2 bg-black/80 text-white font-mono text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1">
                <Clock className="w-2.5 h-2.5" />
                {fetchedVideo.duration}
              </span>
              <span className="absolute top-2 left-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                1080P HD
              </span>
            </div>

            {/* Video metadata */}
            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white line-clamp-2 leading-snug">
                  {fetchedVideo.title}
                </h3>

                <div className="flex items-center gap-2 mt-2">
                  {fetchedVideo.authorAvatar && (
                    <img
                      src={fetchedVideo.authorAvatar}
                      alt={fetchedVideo.author}
                      className="w-5 h-5 rounded-full object-cover border border-slate-700"
                    />
                  )}
                  <span className="text-xs text-slate-300 font-medium truncate">
                    {fetchedVideo.author}
                  </span>
                </div>

                <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                  {fetchedVideo.views && (
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3 text-slate-500" />
                      {fetchedVideo.views} views
                    </span>
                  )}
                  {fetchedVideo.likes && (
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3 text-rose-500/70" />
                      {fetchedVideo.likes}
                    </span>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    const top1080p = fetchedVideo.formats.find(f => f.quality.includes('1080P')) || fetchedVideo.formats[0];
                    onDownload(fetchedVideo, top1080p);
                  }}
                  className="flex-1 min-w-[140px] flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-bold py-2.5 px-3 rounded-xl shadow-lg shadow-indigo-600/30 transition active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>Download 1080P (Direct)</span>
                </button>

                <button
                  onClick={() => onPreview(fetchedVideo)}
                  className="flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium py-2.5 px-3 rounded-xl border border-slate-700 transition"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-200" />
                  <span>{t.playVideo}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Formats Grid */}
          <div className="mt-4 pt-4 border-t border-slate-800/80">
            <h4 className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>{t.selectQuality}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {fetchedVideo.formats.map(format => {
                const is1080p = format.quality.includes('1080P');
                return (
                  <button
                    key={format.id}
                    onClick={() => onDownload(fetchedVideo, format)}
                    className={`p-3 rounded-2xl border text-left transition flex items-center justify-between group active:scale-98 ${
                      is1080p
                        ? 'bg-gradient-to-r from-indigo-950/70 to-purple-950/60 border-indigo-500/40 hover:border-indigo-400'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-white">{format.quality}</span>
                        {is1080p && (
                          <span className="bg-indigo-500 text-[8px] text-white font-extrabold px-1 rounded">
                            HD
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                        {format.fileSizeEstimate} • {format.ext.toUpperCase()}
                      </span>
                    </div>
                    <div className="w-7 h-7 rounded-lg bg-indigo-600/80 group-hover:bg-indigo-600 text-white flex items-center justify-center transition shrink-0">
                      <Download className="w-3.5 h-3.5" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Quick 1-Tap Sample Videos section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>{t.quickTestTitle}</span>
          </h3>
          <span className="text-[10px] text-slate-500">Tap to load 1080P stream</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {sampleVideos.map(sample => (
            <div
              key={sample.id}
              onClick={() => selectSample(sample)}
              className="group cursor-pointer bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-indigo-500/40 rounded-2xl p-3 transition flex items-center gap-3 shadow-md"
            >
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-black shrink-0 border border-slate-800">
                <img
                  src={sample.thumbnail}
                  alt={sample.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <span className="absolute bottom-1 right-1 bg-black/80 text-[8px] font-mono px-1 rounded text-white">
                  {sample.duration}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] uppercase font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.2 rounded border border-indigo-500/20">
                    {sample.platform}
                  </span>
                  <span className="text-[9px] font-mono text-emerald-400">1080P HD</span>
                </div>
                <p className="text-xs font-semibold text-slate-200 line-clamp-1 mt-1">
                  {sample.title}
                </p>
                <p className="text-[11px] text-slate-400 truncate">{sample.author}</p>
              </div>

              <div className="w-8 h-8 rounded-xl bg-slate-800 group-hover:bg-indigo-600 text-slate-300 group-hover:text-white flex items-center justify-center transition shrink-0">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
