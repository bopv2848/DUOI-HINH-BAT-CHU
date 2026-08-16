import React from 'react';
import { motion } from 'framer-motion';
import { Play, KeyRound, Sparkles, Trophy, BookOpen, Flame, Compass } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { soundManager } from '../../lib/audio';

interface HeroBannerProps {
  onQuickPlay: () => void;
  onOpenPinModal: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onQuickPlay, onOpenPinModal }) => {
  const { currentUser } = useAuth();
  const { schoolLevel } = useTheme();

  // Mascot & Content theo cấp học
  let mascotEmoji = '🚀';
  let badgeText = 'GÓC HỌC TẬP - THCS';
  let headline = 'Đuổi Hình Bắt Chữ • Chinh Phục Không Gian Tri Thức';
  let subText = 'Thử thách nhìn hình đoán chữ các môn Công nghệ, Tin học & Hoạt động trải nghiệm khối 6, 7, 8, 9 với bảng xếp hạng Realtime đỉnh cao!';

  if (schoolLevel === 'primary') {
    mascotEmoji = '🐣';
    badgeText = 'GÓC HỌC TẬP VUI VẺ - TIỂU HỌC';
    headline = 'Bé Đuổi Hình Bắt Chữ • Vừa Học Vừa Chơi Cực Vui!';
    subText = 'Cùng bé khám phá thế giới xung quanh qua các câu đố hình ảnh sinh động, tích lũy điểm kinh nghiệm và nhận huy hiệu đáng yêu!';
  } else if (schoolLevel === 'high') {
    mascotEmoji = '⚡';
    badgeText = 'ĐẤU TRƯỜNG E-SPORTS TRI THỨC - THPT';
    headline = 'Đấu Trường Đuổi Hình Bắt Chữ • Đỉnh Cao Tư Duy';
    subText = 'Rèn luyện phản xạ, tư duy công nghệ và kỹ năng định hướng tương lai. Tranh tài trực tiếp trên bảng xếp hạng toàn quốc!';
  }

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-cyan-950/40 border border-slate-800 p-6 sm:p-10 shadow-2xl mb-8">
      {/* Background glowing orbs */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Left Content */}
        <div className="max-w-2xl text-center lg:text-left space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>{badgeText}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
            {headline}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {subText}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
            <button
              onClick={() => {
                soundManager.playClick();
                onQuickPlay();
              }}
              className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-black rounded-2xl shadow-xl shadow-cyan-500/25 active:scale-95 transition-all text-sm sm:text-base"
            >
              <Play className="w-5 h-5 fill-slate-950" />
              <span>Chơi Ngay Trận Nổi Bật</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                onOpenPinModal();
              }}
              className="flex items-center gap-2 px-6 py-3.5 bg-slate-800/90 hover:bg-slate-700 text-white font-bold rounded-2xl border border-slate-700 active:scale-95 transition-all text-sm sm:text-base"
            >
              <KeyRound className="w-5 h-5 text-emerald-400" />
              <span>Nhập Mã Phòng / Lớp</span>
            </button>
          </div>

          {/* Quick Highlight Stats */}
          <div className="flex items-center justify-center lg:justify-start gap-4 sm:gap-6 pt-3 text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-slate-200 font-bold">100% Realtime Database</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-200 font-bold">18 Môn Học Đa Dạng</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-slate-200 font-bold">Huy Hiệu & Cấp Độ</span>
            </div>
          </div>
        </div>

        {/* Right Mascot & Interactive Floating Card */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          className="relative shrink-0"
        >
          <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-3xl bg-gradient-to-tr from-cyan-600/30 via-slate-800 to-amber-500/20 p-4 border border-cyan-500/40 shadow-2xl backdrop-blur-md flex flex-col items-center justify-center text-center relative">
            <div className="text-6xl sm:text-7xl mb-2 select-none animate-bounce-subtle">
              {mascotEmoji}
            </div>
            <span className="text-xs font-black text-cyan-300 uppercase tracking-wider">
              {currentUser?.fullName || 'Học sinh Việt Nam'}
            </span>
            <div className="mt-1 px-3 py-1 bg-amber-400/20 text-amber-300 border border-amber-400/40 rounded-full text-xs font-mono font-bold flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              <span>Cấp {currentUser?.level || 1} • {currentUser?.xpPoints || 100} XP</span>
            </div>

            {/* Floating Tag */}
            <div className="absolute -top-3 -right-3 px-3 py-1 bg-emerald-500 text-slate-950 font-black text-[11px] rounded-xl shadow-lg border border-white">
              SẴN SÀNG!
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
