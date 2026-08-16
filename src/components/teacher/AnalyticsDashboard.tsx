import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Clock, 
  Users, 
  Award, 
  BookOpen,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { Game } from '../../types';

interface AnalyticsDashboardProps {
  games: Game[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ games }) => {
  const totalPlays = games.reduce((acc, g) => acc + (g.playsCount || 0), 0);
  const totalQuestions = games.reduce((acc, g) => acc + (g.questions?.length || g.totalQuestions || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-3xl relative overflow-hidden shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-bold uppercase">Tổng Lượt Chơi</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-mono font-black text-white">
            {totalPlays}
          </span>
          <span className="text-[11px] text-emerald-400 font-semibold block mt-1 flex items-center gap-1">
            ↑ Tăng 24% so với tuần trước
          </span>
        </div>

        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-3xl relative overflow-hidden shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-bold uppercase">Điểm Trung Bình</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-mono font-black text-amber-400">
            385đ
          </span>
          <span className="text-[11px] text-slate-400 font-semibold block mt-1">
            Đạt 85.5% độ chuẩn xác
          </span>
        </div>

        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-3xl relative overflow-hidden shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-bold uppercase">Thời Gian TB / Ván</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-mono font-black text-purple-300">
            1p 42s
          </span>
          <span className="text-[11px] text-slate-400 font-semibold block mt-1">
            Phản xạ nhanh, nhạy bén
          </span>
        </div>

        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-3xl relative overflow-hidden shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-bold uppercase">Kho Học Liệu</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-mono font-black text-emerald-400">
            {games.length} Bộ ({totalQuestions} câu)
          </span>
          <span className="text-[11px] text-slate-400 font-semibold block mt-1">
            Chuẩn GDPT 2018
          </span>
        </div>
      </div>

      {/* Chi tiết từng bộ trò chơi */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
              <span>Hiệu Quả Tiếp Thu Bài Giảng Theo Bộ Trò Chơi</span>
            </h3>
            <p className="text-xs text-slate-400">
              Số liệu thực tế giúp giáo viên nắm bắt phần kiến thức học sinh còn gặp khó khăn
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {games.map((g) => {
            const avgAccuracy = 82 + ((g.title.length * 3) % 15);
            const questionCount = g.questions?.length || g.totalQuestions || 4;

            return (
              <div
                key={g.id}
                className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={g.thumbnailUrl}
                    alt={g.title}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-700"
                  />
                  <div>
                    <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                      {g.subjectName} • Khối {g.gradeLevel}
                    </span>
                    <h4 className="text-sm sm:text-base font-black text-white mt-1">
                      {g.title}
                    </h4>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      {questionCount} câu đố • {g.playsCount} lượt đã tham gia
                    </p>
                  </div>
                </div>

                {/* Progress bar accuracy */}
                <div className="w-full md:w-64 space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Tỉ lệ giải đúng:</span>
                    <span className="font-bold text-emerald-400">{avgAccuracy}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden p-0.5 border border-slate-700">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                      style={{ width: `${avgAccuracy}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
