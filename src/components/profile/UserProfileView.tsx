import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Award, Flame, Sparkles, Target, Clock, ShieldCheck, Zap, Crown, GraduationCap } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { INITIAL_BADGES } from '../../lib/seedData';
import { soundManager } from '../../lib/audio';

export const UserProfileView: React.FC = () => {
  const { currentUser } = useAuth();

  if (!currentUser) return null;

  const currentLevel = currentUser.level;
  const currentXp = currentUser.xpPoints;
  const xpForNextLevel = currentLevel * 250;
  const progressInLevel = currentXp - (currentLevel - 1) * 250;
  const progressPercent = Math.min(100, Math.max(0, (progressInLevel / 250) * 100));

  // Map icon
  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Trophy':
        return Trophy;
      case 'Zap':
        return Zap;
      case 'GraduationCap':
        return GraduationCap;
      case 'Crown':
        return Crown;
      case 'Flame':
      default:
        return Flame;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Header Profile Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-950/80 via-slate-900 to-slate-900 border border-cyan-500/40 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <img
            src={currentUser.avatarUrl}
            alt="avatar"
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-slate-950 border-2 border-cyan-400 shadow-xl"
          />

          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                {currentUser.fullName}
              </h1>
              <span className="px-3 py-0.5 rounded-full text-xs font-black bg-cyan-500 text-slate-950">
                CẤP {currentUser.level}
              </span>
            </div>

            <p className="text-sm text-slate-400 font-mono">@{currentUser.username}</p>

            {currentUser.joinedClassName && (
              <p className="text-xs font-semibold text-emerald-400 flex items-center justify-center sm:justify-start gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Đang sinh hoạt tại: {currentUser.joinedClassName}
              </p>
            )}

            {/* Level Progress Bar */}
            <div className="pt-2 max-w-md">
              <div className="flex justify-between text-xs text-slate-400 font-mono mb-1">
                <span className="text-cyan-400 font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> {currentUser.xpPoints} XP
                </span>
                <span>{progressInLevel} / 250 XP để lên Cấp {currentLevel + 1}</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-3 p-0.5 border border-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Badges Collection */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">Bộ Sưu Tập Huy Hiệu Gamification</h2>
            <p className="text-xs text-slate-400">
              Chinh phục các cột mốc tri thức để mở khóa huy hiệu danh giá
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {INITIAL_BADGES.map((badge) => {
            const isUnlocked = currentUser.xpPoints >= badge.requiredXp;
            const Icon = getBadgeIcon(badge.icon);

            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                  isUnlocked
                    ? 'bg-slate-950/80 border-amber-500/40 shadow-lg shadow-amber-500/10'
                    : 'bg-slate-950/40 border-slate-800/60 opacity-50 grayscale'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    isUnlocked
                      ? 'bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 shadow-md shadow-amber-500/30'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-black text-white">{badge.name}</h3>
                    {isUnlocked && (
                      <span className="text-[10px] font-bold text-amber-400">✓ Đã đạt</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    {badge.description}
                  </p>
                  <span className="text-[10px] font-mono text-cyan-400 block mt-1">
                    Yêu cầu: {badge.requiredXp} XP
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
