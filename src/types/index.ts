export type Platform = 'tiktok' | 'facebook' | 'instagram' | 'youtube' | 'twitter' | 'threads' | 'pinterest' | 'other';

export interface FormatOption {
  id: string;
  quality: string;
  resolution: string;
  label: string;
  ext: string;
  fileSizeEstimate: string;
  url: string;
  isHd: boolean;
  isAudioOnly?: boolean;
  fps?: number;
}

export interface VideoMetadata {
  id: string;
  originalUrl: string;
  title: string;
  author: string;
  authorAvatar?: string;
  platform: Platform;
  duration: string;
  thumbnail: string;
  views?: string;
  likes?: string;
  formats: FormatOption[];
  hasNoWatermark: boolean;
}

export interface DownloadTask {
  id: string;
  videoId: string;
  title: string;
  thumbnail: string;
  platform: Platform;
  quality: string;
  resolution: string;
  format: string; // 'mp4' | 'mp3'
  fileSize: string;
  downloadUrl: string;
  progress: number;
  status: 'pending' | 'downloading' | 'completed' | 'failed';
  downloadedAt: number;
}

export type ActiveTab = 'downloader' | 'downloads' | 'batch' | 'apk' | 'settings';
export type Language = 'my' | 'en';
