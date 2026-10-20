import React, { useState } from 'react';
import {
  Settings,
  Globe,
  Sliders,
  Trash2,
  ShieldCheck,
  Check,
  Sparkles,
  Info,
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface Props {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  preferredQuality: string;
  onQualityChange: (quality: string) => void;
  downloadsCount: number;
  onClearData: () => void;
}

export const SettingsTab: React.FC<Props> = ({
  language,
  onLanguageChange,
  preferredQuality,
  onQualityChange,
  downloadsCount,
  onClearData,
}) => {
  const [clearedMsg, setClearedMsg] = useState(false);
  const t = translations[language];

  const handleClear = () => {
    if (confirm(language === 'my' ? 'ဒေါင်းလုဒ်မှတ်တမ်းအားလုံးကို ရှင်းလင်းမှာ သေချာပါသလား?' : 'Are you sure you want to clear all history?')) {
      onClearData();
      setClearedMsg(true);
      setTimeout(() => setClearedMsg(false), 3000);
    }
  };

  return (
    <div className="space-y-5 pb-20">
      {/* Language Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-indigo-400" />
          <h4 className="text-xs font-bold text-white">Language / ဘာသာစကား</h4>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onLanguageChange('my')}
            className={`p-3 rounded-xl border flex items-center justify-between text-xs font-semibold transition ${
              language === 'my'
                ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>မြန်မာဘာသာ (Myanmar)</span>
            {language === 'my' && <Check className="w-4 h-4 text-indigo-400" />}
          </button>

          <button
            onClick={() => onLanguageChange('en')}
            className={`p-3 rounded-xl border flex items-center justify-between text-xs font-semibold transition ${
              language === 'en'
                ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>English (US)</span>
            {language === 'en' && <Check className="w-4 h-4 text-indigo-400" />}
          </button>
        </div>
      </div>

      {/* Resolution Preference */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-400" />
            <h4 className="text-xs font-bold text-white">{t.settingsResolution}</h4>
          </div>
          <span className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded-full text-[10px] font-bold">
            1080P Default
          </span>
        </div>

        <div className="space-y-2 text-xs">
          {[
            { id: '1080p', label: t.quality1080p, tag: 'Crisp HD' },
            { id: '720p', label: t.quality720p, tag: 'Fast' },
            { id: 'mp3', label: t.qualityMp3, tag: 'Audio' },
          ].map(opt => (
            <div
              key={opt.id}
              onClick={() => onQualityChange(opt.id)}
              className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition ${
                preferredQuality === opt.id
                  ? 'bg-indigo-600/20 border-indigo-500 text-white font-medium'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                  preferredQuality === opt.id ? 'border-indigo-400 bg-indigo-500' : 'border-slate-700'
                }`}>
                  {preferredQuality === opt.id && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </span>
                <span>{opt.label}</span>
              </div>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400 font-mono">
                {opt.tag}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Storage and Cache */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-rose-400" />
            <h4 className="text-xs font-bold text-white">{t.settingsStorage}</h4>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            {downloadsCount} items saved
          </span>
        </div>

        {clearedMsg && (
          <p className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl">
            {t.cacheCleared}
          </p>
        )}

        <button
          onClick={handleClear}
          className="w-full flex items-center justify-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 font-semibold py-2.5 rounded-xl text-xs transition"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{t.clearCache}</span>
        </button>
      </div>

      {/* Security & System Info */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-2 text-xs text-slate-400">
        <div className="flex items-center gap-2 text-slate-200 font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>100% Secure & Privacy Safe</span>
        </div>
        <p className="text-[11px] leading-relaxed">
          {language === 'my'
            ? 'မည်သည့် ကိုယ်ရေးအချက်အလက်ကိုမျှ သိမ်းဆည်းခြင်းမရှိပါ။ ဒေါင်းလုဒ်ဆွဲထားသော ဗီဒီယိုဖိုင်အားလုံးသည် သင့်ဖုန်း၏ storage ထဲသို့သာ တိုက်ရိုက်ရောက်ရှိမည် ဖြစ်ပါသည်။'
            : 'No login required. All social media video downloads are streamed privately and saved directly to your device.'}
        </p>
        <div className="pt-2 text-[10px] text-slate-500 font-mono flex items-center justify-between border-t border-slate-800/80">
          <span>Nanda Shein Downloader Web v1.0.0</span>
          <span>Engine: High-Bitrate 1080P</span>
        </div>
      </div>
    </div>
  );
};
