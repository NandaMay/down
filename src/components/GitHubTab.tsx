import React, { useState, useEffect } from 'react';
import {
  GitBranch,
  Github,
  Copy,
  Check,
  ExternalLink,
  Download,
  FolderGit2,
  Terminal,
  ShieldCheck,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface Props {
  language: Language;
}

export const GitHubTab: React.FC<Props> = ({ language }) => {
  const [repoUrl, setRepoUrl] = useState('https://github.com/nandashein/nanda-shein-downloader.git');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [gitStatus, setGitStatus] = useState({
    branch: 'main',
    author: 'Nanda Shein',
    email: 'nandashein158@gmail.com',
    status: 'Ready to Push',
  });
  const t = translations[language];

  const commands = [
    `git remote add origin ${repoUrl}`,
    `git branch -M main`,
    `git add .`,
    `git commit -m "Initial commit: Nanda Shein Downloader Web App"`,
    `git push -u origin main`,
  ];

  const copyCommand = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  const copyAllCommands = () => {
    navigator.clipboard.writeText(commands.join('\n'));
    setCopiedIndex(99);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  const handleDownloadSourceZip = () => {
    window.location.href = '/api/download-zip';
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/70 to-slate-900 border border-indigo-500/30 p-5 shadow-2xl">
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-800 to-indigo-600 flex items-center justify-center shadow-lg border border-slate-700">
            <Github className="w-7 h-7 text-white" />
          </div>
          <span className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-[10px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Git Ready
          </span>
        </div>

        <h3 className="mt-4 text-base sm:text-lg font-bold text-white">
          {t.githubTitle}
        </h3>

        <p className="mt-2 text-xs text-slate-300 leading-relaxed">
          {t.githubP1}
        </p>

        {/* Git Details Pill Grid */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-500 block text-[10px]">Branch</span>
            <span className="text-indigo-300 font-mono font-medium flex items-center gap-1">
              <GitBranch className="w-3 h-3 text-indigo-400" />
              {gitStatus.branch}
            </span>
          </div>
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-500 block text-[10px]">Developer</span>
            <span className="text-slate-200 font-medium truncate block">
              {gitStatus.author}
            </span>
          </div>
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 col-span-2 sm:col-span-1">
            <span className="text-slate-500 block text-[10px]">Linked Email</span>
            <span className="text-slate-300 font-mono text-[10px] truncate block">
              {gitStatus.email}
            </span>
          </div>
        </div>
      </div>

      {/* Repository Setup Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div>
          <label className="text-xs font-bold text-white flex items-center gap-1.5">
            <FolderGit2 className="w-4 h-4 text-indigo-400" />
            <span>
              {language === 'my'
                ? 'သင်၏ GitHub Repository URL ထည့်ပါ'
                : 'Your GitHub Repository URL'}
            </span>
          </label>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {language === 'my'
              ? 'GitHub ပေါ်တွင် repository ပြုလုပ်ပြီး ရရှိလာသော လိပ်စာကို ထည့်သွင်းပါ'
              : 'Enter your target GitHub repository URL'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={repoUrl}
            onChange={e => setRepoUrl(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-2xl py-2.5 px-3.5 text-xs text-slate-100 font-mono outline-none"
          />
          <a
            href="https://github.com/new"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3 py-2.5 rounded-2xl transition shrink-0"
          >
            <span>New Repo</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Push to GitHub Commands Terminal */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-indigo-400" />
              <span>Git Push Commands</span>
            </span>

            <button
              onClick={copyAllCommands}
              className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-medium px-2 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 transition"
            >
              {copiedIndex === 99 ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedIndex === 99 ? 'Copied All!' : 'Copy All'}</span>
            </button>
          </div>

          <div className="space-y-1.5 font-mono text-[11px]">
            {commands.map((cmd, idx) => (
              <div
                key={idx}
                className="group flex items-center justify-between p-2 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 transition"
              >
                <span className="text-slate-300 select-all truncate pr-2">
                  <span className="text-indigo-400 mr-2">$</span>
                  {cmd}
                </span>
                <button
                  onClick={() => copyCommand(cmd, idx)}
                  className="opacity-60 group-hover:opacity-100 p-1 text-slate-400 hover:text-white transition shrink-0"
                >
                  {copiedIndex === idx ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Download Source Code Section */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
            <Download className="w-4 h-4 text-emerald-400" />
            <span>
              {language === 'my'
                ? 'Source Code အား .ZIP ဖြင့် ရယူလိုပါက'
                : 'Download Project Source (.ZIP)'}
            </span>
          </h4>
          <p className="text-[11px] text-slate-400">
            {language === 'my'
              ? 'GitHub သို့ upload တင်ရန် သို့မဟုတ် Local တွင် run ရန် Source Code ကို ဒေါင်းလုဒ်ဆွဲနိုင်ပါသည်'
              : 'Export the complete clean codebase to push manually to GitHub'}
          </p>
        </div>

        <button
          onClick={handleDownloadSourceZip}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow transition active:scale-95 shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Download .ZIP</span>
        </button>
      </div>
    </div>
  );
};
