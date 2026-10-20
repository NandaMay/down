import React, { useState, useEffect } from 'react';
import {
  Download,
  FolderDown,
  Layers,
  Smartphone,
  Settings,
  Sparkles,
  WifiOff,
  Globe,
} from 'lucide-react';
import {
  ActiveTab,
  Language,
  VideoMetadata,
  FormatOption,
  DownloadTask,
} from './types';
import { translations } from './utils/translations';
import { AndroidStatusBar } from './components/AndroidStatusBar';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { DownloaderTab } from './components/DownloaderTab';
import { DownloadsTab } from './components/DownloadsTab';
import { BatchTab } from './components/BatchTab';
import { ApkGuideTab } from './components/ApkGuideTab';
import { SettingsTab } from './components/SettingsTab';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { FormatSelectorModal } from './components/FormatSelectorModal';

const STORAGE_KEY_DOWNLOADS = 'snapsave_downloads_v1';
const STORAGE_KEY_LANG = 'snapsave_lang_v1';
const STORAGE_KEY_QUALITY = 'snapsave_quality_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('downloader');
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_LANG);
    return saved === 'en' ? 'en' : 'my'; // Default to Myanmar for the user
  });
  const [preferredQuality, setPreferredQuality] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_QUALITY) || '1080p';
  });

  const [downloads, setDownloads] = useState<DownloadTask[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DOWNLOADS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [sampleVideos, setSampleVideos] = useState<VideoMetadata[]>([]);
  const [previewVideo, setPreviewVideo] = useState<VideoMetadata | null>(null);
  const [formatModalVideo, setFormatModalVideo] = useState<VideoMetadata | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const t = translations[language];

  // Load sample videos
  useEffect(() => {
    fetch('/api/samples')
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data) {
          setSampleVideos(json.data);
        }
      })
      .catch(() => {
        // Fallback handled in backend
      });
  }, []);

  // Online status listeners
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync downloads to storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_DOWNLOADS, JSON.stringify(downloads));
  }, [downloads]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem(STORAGE_KEY_LANG, lang);
  };

  const handleQualityChange = (quality: string) => {
    setPreferredQuality(quality);
    localStorage.setItem(STORAGE_KEY_QUALITY, quality);
  };

  const triggerDownload = (video: VideoMetadata, format: FormatOption) => {
    const taskId = `dl-${Date.now()}`;
    const filename = `${video.title.slice(0, 30).replace(/[^a-zA-Z0-9_-]/g, '_')}_${format.quality.replace(/[^a-zA-Z0-9]/g, '')}.${format.ext}`;

    const newTask: DownloadTask = {
      id: taskId,
      videoId: video.id,
      title: video.title,
      thumbnail: video.thumbnail,
      platform: video.platform,
      quality: format.quality,
      resolution: format.resolution,
      format: format.ext,
      fileSize: format.fileSizeEstimate,
      downloadUrl: format.url,
      progress: 10,
      status: 'downloading',
      downloadedAt: Date.now(),
    };

    setDownloads(prev => [newTask, ...prev]);
    showToast(
      language === 'my'
        ? `1080P ဒေါင်းလုဒ် စတင်နေပါပြီ: ${video.title.slice(0, 25)}...`
        : `Downloading in ${format.quality}: ${video.title.slice(0, 25)}...`
    );

    // Smooth download progress animation
    const interval = setInterval(() => {
      setDownloads(prev =>
        prev.map(task => {
          if (task.id === taskId && task.status === 'downloading') {
            const nextProgress = task.progress + Math.floor(Math.random() * 25) + 15;
            if (nextProgress >= 100) {
              clearInterval(interval);
              return { ...task, progress: 100, status: 'completed' };
            }
            return { ...task, progress: nextProgress };
          }
          return task;
        })
      );
    }, 400);

    // Trigger direct file download stream from proxy endpoint
    const proxyUrl = `/api/download-proxy?url=${encodeURIComponent(format.url)}&filename=${encodeURIComponent(filename)}`;
    const anchor = document.createElement('a');
    anchor.href = proxyUrl;
    anchor.setAttribute('download', filename);
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  const handlePlayTask = (task: DownloadTask) => {
    const foundSample = sampleVideos.find(s => s.id === task.videoId);
    const meta: VideoMetadata = foundSample || {
      id: task.videoId,
      originalUrl: task.downloadUrl,
      title: task.title,
      author: `@${task.platform}_creator`,
      platform: task.platform,
      duration: '00:30',
      thumbnail: task.thumbnail,
      formats: [
        {
          id: 'task-format',
          quality: task.quality,
          resolution: task.resolution,
          label: task.quality,
          ext: task.format,
          fileSizeEstimate: task.fileSize,
          url: task.downloadUrl,
          isHd: task.quality.includes('1080P'),
        },
      ],
      hasNoWatermark: true,
    };
    setPreviewVideo(meta);
  };

  const handleDeleteTask = (id: string) => {
    setDownloads(prev => prev.filter(d => d.id !== id));
  };

  const handleReDownload = (task: DownloadTask) => {
    const format: FormatOption = {
      id: `re-${Date.now()}`,
      quality: task.quality,
      resolution: task.resolution,
      label: task.quality,
      ext: task.format,
      fileSizeEstimate: task.fileSize,
      url: task.downloadUrl,
      isHd: task.quality.includes('1080P'),
    };
    const video: VideoMetadata = {
      id: task.videoId,
      originalUrl: task.downloadUrl,
      title: task.title,
      author: `@${task.platform}_user`,
      platform: task.platform,
      duration: '00:30',
      thumbnail: task.thumbnail,
      formats: [format],
      hasNoWatermark: true,
    };
    triggerDownload(video, format);
  };

  const handleClearAll = () => {
    setDownloads([]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Android Status Bar */}
      <AndroidStatusBar />

      {/* Main Container / Mobile Frame Wrapper */}
      <div className="w-full max-w-xl mx-auto flex-1 flex flex-col relative px-2 sm:px-4">
        {/* Top App Bar Header */}
        <header className="py-3 px-2 flex items-center justify-between border-b border-slate-900 sticky top-0 bg-slate-950/90 backdrop-blur-md z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Download className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm font-extrabold tracking-tight text-white">
                  Nanda Shein <span className="text-indigo-400">Downloader</span>
                </h1>
                <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-md shadow-sm">
                  1080P APK
                </span>
              </div>
              <p className="text-[10px] text-slate-400 leading-none">
                {language === 'my' ? 'ရေစာမပါ 1080P HD ဒေါင်းလုဒ်' : 'Social Video Downloader'}
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleLanguageChange(language === 'my' ? 'en' : 'my')}
              className="flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-slate-300 text-[11px] font-semibold px-2.5 py-1.5 rounded-xl border border-slate-800 transition"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              <span>{language === 'my' ? 'EN' : 'မြန်မာ'}</span>
            </button>

            <button
              id="tab-apk"
              onClick={() => setActiveTab('apk')}
              className="flex items-center gap-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold px-2.5 py-1.5 rounded-xl hover:bg-emerald-500/30 transition active:scale-95"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>APK</span>
            </button>
          </div>
        </header>

        {/* Offline Warning Banner */}
        {!isOnline && (
          <div className="mx-2 mt-2 bg-amber-500/10 border border-amber-500/30 text-amber-300 px-3 py-2 rounded-xl text-xs flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-amber-400" />
            <span>အင်တာနက်ပြတ်တောက်နေပါသည် (Offline Mode)</span>
          </div>
        )}

        {/* Direct Android APK download banner */}
        <PWAInstallBanner language={language} onOpenApkTab={() => setActiveTab('apk')} />

        {/* Tab Content Router */}
        <main className="flex-1 mt-4 px-2">
          {activeTab === 'downloader' && (
            <DownloaderTab
              language={language}
              sampleVideos={sampleVideos}
              onDownload={triggerDownload}
              onPreview={video => setPreviewVideo(video)}
            />
          )}

          {activeTab === 'downloads' && (
            <DownloadsTab
              language={language}
              downloads={downloads}
              onPlay={handlePlayTask}
              onDelete={handleDeleteTask}
              onReDownload={handleReDownload}
              onClearAll={handleClearAll}
            />
          )}

          {activeTab === 'batch' && (
            <BatchTab language={language} onDownload={triggerDownload} />
          )}

          {activeTab === 'apk' && <ApkGuideTab language={language} />}

          {activeTab === 'settings' && (
            <SettingsTab
              language={language}
              onLanguageChange={handleLanguageChange}
              preferredQuality={preferredQuality}
              onQualityChange={handleQualityChange}
              downloadsCount={downloads.length}
              onClearData={handleClearAll}
            />
          )}
        </main>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 border border-indigo-500/50 text-white px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-semibold backdrop-blur-md animate-bounce">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Floating HD Video Player Modal */}
      {previewVideo && (
        <VideoPlayerModal
          video={previewVideo}
          onClose={() => setPreviewVideo(null)}
          onDownload={format => {
            triggerDownload(previewVideo, format);
            setPreviewVideo(null);
          }}
        />
      )}

      {/* Format Selector Modal */}
      {formatModalVideo && (
        <FormatSelectorModal
          video={formatModalVideo}
          language={language}
          onClose={() => setFormatModalVideo(null)}
          onSelectFormat={format => {
            triggerDownload(formatModalVideo, format);
            setFormatModalVideo(null);
          }}
        />
      )}

      {/* Bottom Android Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-950/95 backdrop-blur-lg border-t border-slate-900 py-1.5 px-3 z-40 max-w-xl mx-auto">
        <div className="flex items-center justify-around">
          <button
            onClick={() => setActiveTab('downloader')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
              activeTab === 'downloader'
                ? 'text-indigo-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Download className="w-5 h-5" />
            <span className="text-[10px]">{t.navDownloader}</span>
          </button>

          <button
            onClick={() => setActiveTab('downloads')}
            className={`relative flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
              activeTab === 'downloads'
                ? 'text-indigo-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FolderDown className="w-5 h-5" />
            <span className="text-[10px]">{t.navDownloads}</span>
            {downloads.length > 0 && (
              <span className="absolute top-0.5 right-2 w-4 h-4 bg-indigo-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {downloads.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('batch')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
              activeTab === 'batch'
                ? 'text-indigo-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-5 h-5" />
            <span className="text-[10px]">{t.navBatch}</span>
          </button>

          <button
            onClick={() => setActiveTab('apk')}
            className={`relative flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
              activeTab === 'apk'
                ? 'text-emerald-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-5 h-5" />
            <span className="text-[10px]">{language === 'my' ? 'APK ဒေါင်းမည်' : 'APK'}</span>
            <span className="absolute -top-1 right-2 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
              activeTab === 'settings'
                ? 'text-indigo-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="text-[10px]">{t.navSettings}</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
