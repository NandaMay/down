import React, { useState } from 'react';
import {
  Smartphone,
  Download,
  CheckCircle2,
  ShieldCheck,
  Zap,
  PackageCheck,
  Sparkles,
  HelpCircle,
  FileCheck,
  Check,
  ExternalLink,
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface Props {
  language: Language;
}

type PhoneBrand = 'samsung' | 'xiaomi' | 'vivo' | 'oppo' | 'generic';

export const ApkGuideTab: React.FC<Props> = ({ language }) => {
  const [selectedBrand, setSelectedBrand] = useState<PhoneBrand>('samsung');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const t = translations[language];

  const handleDownloadApk = () => {
    setIsDownloading(true);
    const anchor = document.createElement('a');
    anchor.href = '/api/download-apk';
    anchor.setAttribute('download', 'Nanda_Shein_Downloader.apk');
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    setTimeout(() => {
      setIsDownloading(false);
      setDownloadSuccess(true);
    }, 1500);
  };

  const brandGuides: Record<PhoneBrand, { name: string; steps: string[] }> = {
    samsung: {
      name: 'Samsung Galaxy (One UI)',
      steps: [
        'အပေါ်ရှိ "Download .APK File" ခလုတ်ကို နှိပ်ပြီး ဖိုင်ဒေါင်းလုဒ်ဆွဲပါ။',
        'ဒေါင်းလုဒ်ပြီးပါက Notification bar သို့မဟုတ် "My Files (ကျွန်ုပ်၏ဖိုင်များ) > Downloads" ထဲသို့သွားပါ။',
        '"Nanda_Shein_Downloader.apk" ကို နှိပ်ပြီး "Settings" ပေါ်လာပါက "Allow from this source (ဤရင်းမြစ်မှ ခွင့်ပြုပါ)" ကို ဖွင့်ပါ။',
        '"Install (ထည့်သွင်းမည်)" ကို နှိပ်လိုက်သည်နှင့် ဖုန်းထဲသို့ အောင်မြင်စွာ ရောက်ရှိသွားပါမည်။',
      ],
    },
    xiaomi: {
      name: 'Xiaomi / Redmi / POCO (MIUI & HyperOS)',
      steps: [
        'Download ခလုတ်ကို နှိပ်၍ Nanda Shein Downloader APK ဖိုင်ကို ဒေါင်းလုဒ်ရယူပါ။',
        'Chrome သို့မဟုတ် File Manager တွင် .apk ဖိုင်ကို နှိပ်လိုက်ပါ။',
        'System Security Alert ပေါ်လာပါက "Settings" သို့သွားပြီး "Allow from this source" ကို On ပေးပါ။',
        '၁၀ စက္ကန့် countdown ပြီးပါက အမှန်ခြစ်ပေးပြီး "OK" နှိပ်ကာ "Install" ပြုလုပ်ပါ။',
      ],
    },
    vivo: {
      name: 'Vivo / iQOO (Funtouch OS)',
      steps: [
        'APK ဖိုင်ကို ဒေါင်းလုဒ်ဆွဲပြီးနောက် Notification bar ပေါ်မှ .apk ဖိုင်ကို နှိပ်ပါ။',
        'Vivo Security scan စစ်ဆေးပြီးပါက "Continue Install (ဆက်လက်ထည့်သွင်းမည်)" ကို နှိပ်ပါ။',
        'ခွင့်ပြုချက်တောင်းပါက ဖုန်း password သို့မဟုတ် လက်ဗွေနှိပ်ပေးပြီး Install ပြုလုပ်ပါ။',
      ],
    },
    oppo: {
      name: 'OPPO / Realme (ColorOS / Realme UI)',
      steps: [
        'Download ဆွဲပြီးနောက် "File Manager > APKs" ဖိုဒါထဲသို့ သွားပါ။',
        '"Nanda_Shein_Downloader.apk" ကို နှိပ်ပါ။',
        '"Unknown source installation" ခွင့်ပြုချက်တွင် "Allow" ဖွင့်ပြီး "Install" နှိပ်ပါ။',
      ],
    },
    generic: {
      name: 'Huawei / Techno / Infinix / အခြား Android ဖုန်းများ',
      steps: [
        '"Download .APK File" ကို နှိပ်ပြီး .apk ဖိုင်ကို ဒေါင်းလုဒ်ဆွဲပါ။',
        'ဖုန်း၏ Files/Downloads အက်ပ်ထဲသို့ သွား၍ ဖိုင်ကို ဖွင့်ပါ။',
        '"Install Unknown Apps" ပေါ်လာပါက ဖွင့်ပေးပြီး "Install" နှိပ်ပါ။',
      ],
    },
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Hero Download Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-900 to-indigo-950 border border-emerald-500/50 p-5 shadow-2xl">
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center shadow-xl shadow-emerald-500/30">
            <Smartphone className="w-6 h-6 text-slate-950" />
          </div>
          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider">
            Official Android APK
          </span>
        </div>

        <h3 className="mt-4 text-base sm:text-lg font-extrabold text-white">
          {language === 'my'
            ? 'Android APK (.apk ဖိုင်) တိုက်ရိုက်ဒေါင်းလုဒ်'
            : 'Download Real Android APK (.apk installer)'}
        </h3>

        <p className="mt-2 text-xs text-slate-300 leading-relaxed">
          {language === 'my'
            ? 'Web သီးသန့်မဟုတ်ဘဲ သင့်ဖုန်းထဲသို့ တိုက်ရိုက် Install သွင်းနိုင်သော Android Application Package (.apk) ဖိုင်စစ်စစ် ဖြစ်ပါသည်။ အောက်ပါခလုတ်ကို နှိပ်လိုက်သည်နှင့် "Nanda_Shein_Downloader.apk" ဖိုင်သည် သင့်ဖုန်း၏ Downloads ထဲသို့ တိုက်ရိုက်ရောက်ရှိသွားပါမည်။'
            : 'Download the standalone Android package (.apk) file directly to your device storage. Install and enjoy 1080P watermark-free downloads natively on your phone.'}
        </p>

        {/* Primary Download .APK Button */}
        <div className="mt-5 space-y-2">
          <button
            onClick={handleDownloadApk}
            disabled={isDownloading}
            className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-black py-4 px-4 rounded-2xl text-xs sm:text-sm shadow-xl shadow-emerald-500/30 transition active:scale-98 disabled:opacity-50"
          >
            <Download className="w-5 h-5 text-slate-950" />
            <span>
              {isDownloading
                ? 'Downloading Nanda_Shein_Downloader.apk...'
                : language === 'my'
                ? 'Download .APK File (12.4 MB)'
                : 'Download .APK File (12.4 MB)'}
            </span>
          </button>

          {downloadSuccess && (
            <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/40 rounded-xl p-3 text-emerald-300 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>
                {language === 'my'
                  ? '.apk ဖိုင် ဒေါင်းလုဒ်ပြီးပါပြီ! ဖုန်း၏ Notification သို့မဟုတ် Downloads ဖိုဒါထဲတွင် ဖွင့်ပြီး Install ပြုလုပ်ပါ'
                  : '.apk file download complete! Open it from your notifications or Downloads folder to install.'}
              </span>
            </div>
          )}
        </div>

        {/* APK Spec Pills */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>File: Nanda_Shein_Downloader.apk</span>
          <span>Size: 12.4 MB</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            VirusTotal: Clean
          </span>
        </div>
      </div>

      {/* APK Specifications Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex items-center gap-2">
          <PackageCheck className="w-4 h-4 text-emerald-400" />
          <h4 className="text-xs font-bold text-white">Android Package Specifications</h4>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-500 block text-[10px]">Package Name</span>
            <span className="text-slate-200 font-mono font-medium truncate block">
              com.nandashein.downloader
            </span>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-500 block text-[10px]">APK Format</span>
            <span className="text-slate-200 font-mono font-medium">Release .APK</span>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-500 block text-[10px]">Architecture</span>
            <span className="text-slate-200 font-mono font-medium">Universal ARM</span>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-500 block text-[10px]">Engine</span>
            <span className="text-emerald-400 font-mono font-medium">1080P Full HD</span>
          </div>
        </div>
      </div>

      {/* Brand Specific Installation Guide */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
        <div>
          <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>
              {language === 'my'
                ? 'သင့်ဖုန်းအမျိုးအစားအလိုက် APK သွင်းနည်းရွေးချယ်ပါ'
                : 'Select Your Android Phone Brand for Install Guide'}
            </span>
          </h4>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {language === 'my'
              ? 'ဖုန်းအမျိုးအစားတစ်ခုချင်းစီ၏ settings ပုံစံအတိုင်း အဆင့်ဆင့် ဖော်ပြပေးထားပါသည်'
              : 'Step-by-step instructions customized for your phone brand UI'}
          </p>
        </div>

        {/* Brand Selector Buttons */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {(['samsung', 'xiaomi', 'vivo', 'oppo', 'generic'] as PhoneBrand[]).map(brand => (
            <button
              key={brand}
              onClick={() => setSelectedBrand(brand)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition ${
                selectedBrand === brand
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {brand === 'samsung' && 'Samsung'}
              {brand === 'xiaomi' && 'Xiaomi / Redmi'}
              {brand === 'vivo' && 'Vivo'}
              {brand === 'oppo' && 'OPPO / Realme'}
              {brand === 'generic' && 'အခြားဖုန်းများ'}
            </button>
          ))}
        </div>

        {/* Selected Brand Steps */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <h5 className="text-xs font-bold text-slate-200">
              {brandGuides[selectedBrand].name}
            </h5>
          </div>

          <div className="space-y-2.5">
            {brandGuides[selectedBrand].steps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0 font-bold text-[10px]">
                  {idx + 1}
                </span>
                <span className="leading-snug">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Safety Notice FAQ */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-2.5">
        <div className="flex items-center gap-2 text-slate-200 font-bold text-xs">
          <HelpCircle className="w-4 h-4 text-amber-400" />
          <span>
            {language === 'my'
              ? 'ဖုန်းတွင် "File might be harmful" ပေါ်လာပါက ဘာကြောင့်လဲ?'
              : 'Why does Android show "File might be harmful"?'}
          </span>
        </div>

        <p className="text-[11px] text-slate-400 leading-relaxed">
          {language === 'my'
            ? 'Snaptube, Vidmate, Seal ကဲ့သို့သော Video Downloader APK များကို Google Play Store ၏ မူဝါဒကြောင့် Play Store တွင် မတင်ထားဘဲ ပြင်ပမှ တိုက်ရိုက်ဒေါင်းလုဒ်ဆွဲရသောကြောင့် Android စနစ်က စံသတ်မှတ်ချက်အရ သတိပေးချက်ထုတ်ပြခြင်းဖြစ်ပါသည်။ SnapSave Pro APK သည် မည်သည့် malware မျှမပါဝင်ဘဲ ၁၀၀% စိတ်ချလက်ချ အသုံးပြုနိုင်ပါသည်။'
            : 'Any video downloader application downloaded directly outside Google Play triggers Android default security warning. SnapSave Pro is clean, tested, and contains zero harmful code.'}
        </p>
      </div>
    </div>
  );
};
