import React from 'react';
import { Sparkles, Award } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

export const XpBar: React.FC = () => {
  const { currentUser } = useAuth();
  const { schoolLevel } = useTheme();

  if (!currentUser) return null;

  const currentXp = currentUser.xpPoints;
  const currentLevel = currentUser.level;
  const xpForCurrentLevel = (currentLevel - 1) * 250;
  const xpForNextLevel = currentLevel * 250;
  const progressInLevel = currentXp - xpForCurrentLevel;
  const progressPercent = Math.min(100, Math.max(0, (progressInLevel / 250) * 100));

  const isPrimary = schoolLevel === 'primary';

  return (
    <div className="flex items-center gap-2 sm:gap-3 bg-slate-800/80 border border-slate-700/60 rounded-full px-3 py-1 text-xs sm:text-sm backdrop-blur-sm">
      {/* Level Badge */}
      <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full font-bold ${
        isPrimary 
          ? 'bg-amber-400 text-amber-950 shadow-sm'
          : 'bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950'
      }`}>
        <Award className="w-3.5 h-3.5" />
        <span>Lv.{currentLevel}</span>
      </div>

      {/* XP Bar Progress */}
      <div className="flex flex-col gap-0.5 min-w-[80px] sm:min-w-[120px]">
        <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
          <span className="flex items-center gap-0.5 text-cyan-400 font-semibold">
            <Sparkles className="w-2.5 h-2.5" /> {currentXp} XP
          </span>
          <span>{progressInLevel}/250 XP</span>
        </div>
        <div className="w-full bg-slate-950/60 rounded-full h-2 overflow-hidden p-0.5 border border-slate-700/50">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isPrimary
                ? 'bg-gradient-to-r from-amber-400 to-orange-400'
                : 'bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 shadow-[0_0_8px_rgba(6,182,212,0.5)]'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
