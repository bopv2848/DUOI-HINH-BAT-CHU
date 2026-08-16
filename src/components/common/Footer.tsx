import React from 'react';
import { Sparkles, Shield, Heart, Globe, GraduationCap } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/90 text-slate-400 py-8 px-4 mt-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-400 text-slate-950 flex items-center justify-center font-black">
            🎯
          </div>
          <div>
            <p className="font-bold text-white">
              EduGame Hub - Đuổi Hình Bắt Chữ
            </p>
            <p className="text-[11px] text-slate-500">
              Nền tảng Trò chơi Học tập Trực tuyến Công Nghệ • Tin Học • Hướng Nghiệp
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-slate-400 font-medium">
          <span>Tiểu học</span>
          <span>•</span>
          <span className="text-cyan-400 font-bold">THCS (Khối 6-9)</span>
          <span>•</span>
          <span>THPT</span>
        </div>

        <div className="flex items-center gap-2 text-slate-500">
          <span>Sẵn sàng Production • Supabase PostgreSQL • Realtime</span>
        </div>
      </div>
    </footer>
  );
};
