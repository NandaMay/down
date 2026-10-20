import React, { useState } from 'react';
import { DownloadCloud, Smartphone, CheckCircle2, X, Download } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface Props {
  language: Language;
  onOpenApkTab: () => void;
}

export const PWAInstallBanner: React.FC<Props> = ({ language, onOpenApkTab }) => {
  const [dismissed, setDismissed] = useState(false);
  const [downloadingApk, setDownloadingApk] = useState(false);
  const t = translations[language];

  const handleDownloadApk = () => {
    setDownloadingApk(true);
    const anchor = document.createElement('a');
    anchor.href = '/api/download-apk';
    anchor.setAttribute('download', 'Nanda_Shein_Downloader.apk');
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    setTimeout(() => {
      setDownloadingApk(false);
      onOpenApkTab();
    }, 1200);
  };

  if (dismissed) return null;

  return (
    <div className="mx-2 sm:mx-4 mt-3 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900/90 to-indigo-950/80 border border-emerald-500/40 p-3.5 shadow-xl shadow-slate-950/60 backdrop-blur-md">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
            <Smartphone className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-white tracking-wide">
                Nanda Shein Downloader APK
              </span>
              <span className="bg-emerald-500 text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded text-slate-950">
                .APK File
              </span>
            </div>
            <p className="text-[11px] text-slate-300 truncate">
              {language === 'my'
                ? 'Android APK ဖိုင်ကို ဖုန်းထဲသို့ တိုက်ရိုက်ဒေါင်းလုဒ်ဆွဲပါ'
                : 'Download standalone Android .apk installer file directly'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss banner"
          className="text-slate-400 hover:text-slate-200 p-1 shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <div className="text-[10px] text-slate-400 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>v2.4.0 (12.4 MB) • 1080P Social Engine</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenApkTab}
            className="text-[11px] font-medium text-slate-300 hover:text-white px-2 py-1 rounded-lg hover:bg-slate-800 transition"
          >
            {language === 'my' ? 'သွင်းနည်းကြည့်မည်' : 'Install Guide'}
          </button>

          <button
            onClick={handleDownloadApk}
            className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-slate-950 font-extrabold text-xs px-3.5 py-1.5 rounded-xl shadow-md transition active:scale-95"
          >
            <Download className="w-3.5 h-3.5 text-slate-950" />
            <span>{downloadingApk ? 'Downloading...' : 'Download .APK'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
