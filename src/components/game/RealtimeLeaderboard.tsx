import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Users, 
  Globe, 
  Sparkles, 
  Award, 
  Flame, 
  Search,
  School
} from 'lucide-react';
import { LeaderboardEntry, ClassRoom } from '../../types';
import { getLeaderboard, getClasses } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { soundManager } from '../../lib/audio';

export const RealtimeLeaderboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'global' | 'class'>('global');
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Load danh sách lớp
  useEffect(() => {
    const fetchClasses = async () => {
      const cls = await getClasses();
      setClasses(cls);
      if (currentUser?.joinedClassId) {
        setSelectedClassId(currentUser.joinedClassId);
      } else if (cls.length > 0) {
        setSelectedClassId(cls[0].id);
      }
    };
    fetchClasses();
  }, [currentUser]);

  // Load dữ liệu bảng xếp hạng
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      setLoading(true);
      const classIdToFetch = activeTab === 'class' ? selectedClassId : undefined;
      const data = await getLeaderboard(classIdToFetch);
      setLeaderboard(data);
      setLoading(false);
    };

    fetchLeaderboardData();
  }, [activeTab, selectedClassId]);

  const filteredLeaderboard = leaderboard.filter((entry) =>
    entry.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500/20 via-slate-900 to-cyan-500/20 border border-amber-500/30 p-6 sm:p-8 text-center mb-8 shadow-2xl">
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-slate-950 shadow-xl shadow-amber-500/30 animate-bounce-subtle">
          <Trophy className="w-9 h-9 sm:w-11 sm:h-11" />
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white">
          Bảng Vàng Thi Đua Tri Thức
        </h1>
        <p className="text-sm sm:text-base text-slate-300 mt-1 max-w-xl mx-auto">
          Vinh danh những Chiến thần Đuổi hình bắt chữ xuất sắc nhất toàn hệ thống và theo từng lớp học!
        </p>

        {/* Tab Selector */}
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('global');
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all ${
              activeTab === 'global'
                ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 scale-105'
                : 'bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Toàn Trường / Hệ Thống</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('class');
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all ${
              activeTab === 'class'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 scale-105'
                : 'bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Theo Lớp Học</span>
          </button>
        </div>

        {/* Lựa chọn Lớp học khi tab class active */}
        {activeTab === 'class' && (
          <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
            <School className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-slate-300 font-semibold">Chọn lớp:</span>
            <select
              value={selectedClassId}
              onChange={(e) => {
                soundManager.playClick();
                setSelectedClassId(e.target.value);
              }}
              className="bg-slate-950 text-cyan-300 border border-cyan-500/40 rounded-xl px-3 py-1.5 text-xs font-bold outline-none"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} (Mã: {c.joinCode})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm tên học sinh, tài khoản..."
            className="w-full bg-slate-900/90 border border-slate-700/80 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
          />
        </div>

        <span className="text-xs text-slate-400 font-mono hidden sm:inline">
          {filteredLeaderboard.length} học sinh đang tranh tài
        </span>
      </div>

      {/* Leaderboard Table / Cards */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-400">Đang tải bảng xếp hạng Realtime...</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredLeaderboard.map((entry, index) => {
            const isCurrentUser = currentUser?.id === entry.studentId;
            let rankBadge = (
              <span className="font-mono text-sm sm:text-base font-black text-slate-400">
                #{entry.rank}
              </span>
            );

            if (entry.rank === 1) {
              rankBadge = (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-amber-300 text-slate-950 font-black flex items-center justify-center shadow-lg shadow-amber-500/40 text-sm">
                  🥇
                </div>
              );
            } else if (entry.rank === 2) {
              rankBadge = (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-300 to-slate-100 text-slate-950 font-black flex items-center justify-center shadow-md text-sm">
                  🥈
                </div>
              );
            } else if (entry.rank === 3) {
              rankBadge = (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-700 to-amber-600 text-white font-black flex items-center justify-center shadow-md text-sm">
                  🥉
                </div>
              );
            }

            return (
              <motion.div
                key={entry.studentId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className={`flex items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl border transition-all ${
                  isCurrentUser
                    ? 'bg-gradient-to-r from-cyan-950/80 to-slate-900 border-cyan-400/80 shadow-lg shadow-cyan-500/10'
                    : 'bg-slate-900/80 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                {/* Left: Rank & Avatar & Name */}
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-8 sm:w-10 flex justify-center">{rankBadge}</div>

                  <img
                    src={entry.avatarUrl}
                    alt={entry.fullName}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-950 border border-slate-700"
                  />

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm sm:text-base font-black text-white">
                        {entry.fullName}
                      </h4>
                      {isCurrentUser && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-cyan-500 text-slate-950">
                          BẠN
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-0.5">
                      <span>@{entry.username}</span>
                      <span>•</span>
                      <span className="text-cyan-400 font-bold">Cấp {entry.level}</span>
                    </div>
                  </div>
                </div>

                {/* Right: XP & Total Score */}
                <div className="flex items-center gap-4 sm:gap-6 text-right">
                  <div className="hidden sm:block">
                    <span className="text-[10px] text-slate-400 font-semibold block">TRẬN ĐÃ ĐẤU</span>
                    <span className="text-xs font-mono font-bold text-slate-300">
                      {entry.totalGamesPlayed} ván
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-cyan-400 font-semibold flex items-center justify-end gap-1">
                      <Sparkles className="w-3 h-3" /> KINH NGHIỆM
                    </span>
                    <span className="text-sm sm:text-lg font-mono font-black text-amber-400">
                      {entry.xpPoints} XP
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
