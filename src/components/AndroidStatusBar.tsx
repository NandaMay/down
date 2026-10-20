import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Sparkles } from 'lucide-react';

export const AndroidStatusBar: React.FC = () => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-slate-950/80 backdrop-blur-md px-4 py-1.5 flex items-center justify-between text-xs text-slate-400 select-none border-b border-slate-900 z-30">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-slate-200 text-[13px]">{time || '12:30'}</span>
        <div className="flex items-center gap-1 bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-500/20 text-[10px] font-medium">
          <Sparkles className="w-2.5 h-2.5" />
          <span>APK Mode</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold text-slate-300">5G</span>
        <Wifi className="w-3.5 h-3.5 text-slate-300" />
        <div className="flex items-center gap-0.5">
          <BatteryMedium className="w-4 h-4 text-emerald-400" />
          <span className="text-[11px] font-medium text-emerald-400">98%</span>
        </div>
      </div>
    </div>
  );
};
