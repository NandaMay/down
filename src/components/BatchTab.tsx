import React, { useState } from 'react';
import { Layers, Sparkles, Download, Loader2, CheckCircle2 } from 'lucide-react';
import { VideoMetadata, FormatOption, Language } from '../types';
import { translations } from '../utils/translations';

interface Props {
  language: Language;
  onDownload: (video: VideoMetadata, format: FormatOption) => void;
}

export const BatchTab: React.FC<Props> = ({ language, onDownload }) => {
  const [linksText, setLinksText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [batchResults, setBatchResults] = useState<VideoMetadata[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const t = translations[language];

  const handleBatchParse = async () => {
    const urls = linksText
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.startsWith('http'));

    if (urls.length === 0) {
      setErrorMsg(
        language === 'my'
          ? 'ကျေးဇူးပြု၍ မှန်ကန်သော URL များကို စာကြောင်းအသစ်ခြားပြီး ထည့်သွင်းပေးပါ'
          : 'Please enter at least one valid video URL'
      );
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/batch-parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to process batch');
      setBatchResults(data.data || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Batch processing error';
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadAll1080P = () => {
    batchResults.forEach(video => {
      const top1080p = video.formats.find(f => f.quality.includes('1080P')) || video.formats[0];
      onDownload(video, top1080p);
    });
  };

  return (
    <div className="space-y-5 pb-20">
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl">
        <div className="flex items-center gap-2 mb-1">
          <Layers className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-bold text-white">{t.batchTitle}</h3>
        </div>
        <p className="text-xs text-slate-400 mb-3">{t.batchSubtitle}</p>

        <textarea
          rows={5}
          value={linksText}
          onChange={e => setLinksText(e.target.value)}
          placeholder={`https://www.tiktok.com/@user/video/...\nhttps://www.facebook.com/watch/...\nhttps://www.instagram.com/reel/...`}
          className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-2xl p-3 text-xs sm:text-sm text-slate-100 placeholder:text-slate-600 outline-none font-mono"
        />

        {errorMsg && (
          <p className="mt-2 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl p-2.5">
            {errorMsg}
          </p>
        )}

        <button
          onClick={handleBatchParse}
          disabled={isLoading}
          className="mt-3 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-3 rounded-2xl text-xs sm:text-sm shadow-md transition disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing links...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>{t.startBatch}</span>
            </>
          )}
        </button>
      </div>

      {batchResults.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200">
              Found {batchResults.length} Videos (1080P Ready)
            </span>
            <button
              onClick={handleDownloadAll1080P}
              className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow transition active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download All in 1080P</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {batchResults.map(video => {
              const f1080 = video.formats.find(f => f.quality.includes('1080P')) || video.formats[0];
              return (
                <div
                  key={video.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-800"
                    />
                    <div className="min-w-0">
                      <span className="text-[9px] uppercase font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.2 rounded border border-indigo-500/20">
                        {video.platform}
                      </span>
                      <h4 className="text-xs font-semibold text-slate-200 line-clamp-1 mt-0.5">
                        {video.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-mono">
                        1080P • {f1080.fileSizeEstimate}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onDownload(video, f1080)}
                    className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3 py-2 rounded-xl shrink-0 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">1080P</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
