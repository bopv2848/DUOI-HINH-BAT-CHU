import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Zap, Clock, Target, RotateCcw, ListOrdered, Sparkles, Award } from 'lucide-react';
import { soundManager } from '../../lib/audio';
import { triggerFireworks } from '../common/ConfettiEffect';

interface GameResultModalProps {
  score: number;
  totalQuestions: number;
  correctCount: number;
  timeSpentSeconds: number;
  maxCombo: number;
  xpEarned: number;
  newLevel: number;
  leveledUp: boolean;
  onPlayAgain: () => void;
  onGoToLeaderboard: () => void;
  onBackToHome: () => void;
}

export const GameResultModal: React.FC<GameResultModalProps> = ({
  score,
  totalQuestions,
  correctCount,
  timeSpentSeconds,
  maxCombo,
  xpEarned,
  newLevel,
  leveledUp,
  onPlayAgain,
  onGoToLeaderboard,
  onBackToHome,
}) => {
  useEffect(() => {
    soundManager.playVictory();
    triggerFireworks();
    if (leveledUp) {
      setTimeout(() => {
        soundManager.playLevelUp();
      }, 1000);
    }
  }, [leveledUp]);

  const accuracy = Math.round((correctCount / Math.max(1, totalQuestions)) * 100);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m > 0 ? `${m}p ` : ''}${s}s`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative w-full max-w-lg bg-slate-900 border-2 border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(6,182,212,0.25)] text-center overflow-hidden"
      >
        {/* Decorative background glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Victory Mascot Icon */}
        <div className="relative inline-block mb-3">
          <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 via-orange-400 to-yellow-300 p-1 shadow-xl shadow-amber-500/30 animate-bounce-subtle flex items-center justify-center">
            <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-slate-950" />
          </div>
          {leveledUp && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -bottom-2 -right-2 px-2.5 py-1 bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 font-black text-xs rounded-full shadow-lg border border-white"
            >
              🎉 LÊN CẤP {newLevel}!
            </motion.div>
          )}
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white">Xuất Sắc Hoàn Thành!</h2>
        <p className="text-sm text-slate-300 mt-1">
          Bạn đã chinh phục trọn vẹn bộ câu đố Đuổi hình bắt chữ!
        </p>

        {/* Score & XP Earned Box */}
        <div className="grid grid-cols-2 gap-3 my-5">
          <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl">
            <span className="text-xs text-slate-400 font-semibold block">TỔNG ĐIỂM SỐ</span>
            <span className="text-2xl sm:text-3xl font-mono font-black text-amber-400">
              {score}
            </span>
          </div>

          <div className="p-4 bg-gradient-to-br from-cyan-950/60 to-slate-950/80 border border-cyan-500/40 rounded-2xl">
            <span className="text-xs text-cyan-300 font-semibold flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> KINH NGHIỆM
            </span>
            <span className="text-2xl sm:text-3xl font-mono font-black text-cyan-300">
              +{xpEarned} XP
            </span>
          </div>
        </div>

        {/* Performance Stats */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 py-3 px-4 bg-slate-800/60 rounded-2xl border border-slate-700/60 text-xs sm:text-sm mb-6">
          <div className="flex flex-col items-center">
            <Target className="w-4 h-4 text-emerald-400 mb-1" />
            <span className="text-slate-400 text-[11px]">Độ chính xác</span>
            <span className="font-bold text-white font-mono">{accuracy}%</span>
          </div>

          <div className="flex flex-col items-center">
            <Zap className="w-4 h-4 text-amber-400 mb-1" />
            <span className="text-slate-400 text-[11px]">Combo cao nhất</span>
            <span className="font-bold text-amber-400 font-mono">x{maxCombo}</span>
          </div>

          <div className="flex flex-col items-center">
            <Clock className="w-4 h-4 text-cyan-400 mb-1" />
            <span className="text-slate-400 text-[11px]">Thời gian</span>
            <span className="font-bold text-white font-mono">{formatTime(timeSpentSeconds)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={() => {
              soundManager.playClick();
              onPlayAgain();
            }}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700 transition-all active:scale-95 text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Chơi Lại</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onGoToLeaderboard();
            }}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold rounded-xl border border-amber-500/40 transition-all active:scale-95 text-sm"
          >
            <ListOrdered className="w-4 h-4 text-amber-400" />
            <span>Bảng Xếp Hạng</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onBackToHome();
            }}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-black rounded-xl shadow-lg shadow-cyan-500/20 transition-all active:scale-95 text-sm"
          >
            <Award className="w-4 h-4" />
            <span>Bài Khác</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
