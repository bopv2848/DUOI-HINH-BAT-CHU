import React, { useState } from 'react';
import { 
  Gamepad2, 
  Trophy, 
  KeyRound, 
  GraduationCap, 
  Volume2, 
  VolumeX, 
  Flame, 
  UserCheck, 
  Sparkles,
  School,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { soundManager } from '../../lib/audio';
import { XpBar } from './XpBar';
import { QuickPinModal } from './QuickPinModal';
import { SchoolLevel } from '../../types';

interface NavbarProps {
  activeTab: 'games' | 'leaderboard' | 'teacher' | 'profile';
  setActiveTab: (tab: 'games' | 'leaderboard' | 'teacher' | 'profile') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { currentUser, loginAsDemoTeacher, loginAsDemoStudent, logout } = useAuth();
  const { schoolLevel, setSchoolLevel } = useTheme();
  const [isMuted, setIsMuted] = useState(soundManager.getIsMuted());
  const [showPinModal, setShowPinModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const handleToggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
    if (!muted) soundManager.playClick();
  };

  const handleSelectLevel = (level: SchoolLevel) => {
    soundManager.playClick();
    setSchoolLevel(level);
  };

  const isTeacher = currentUser?.role === 'teacher' || currentUser?.role === 'admin';

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md transition-all">
        {/* Top Mini Bar: Cấp học & Thông tin trường lớp */}
        <div className="bg-slate-900/90 border-b border-slate-800/60 px-4 py-1.5 text-xs text-slate-300">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            {/* Chọn Cấp học */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-slate-400 flex items-center gap-1">
                <School className="w-3.5 h-3.5 text-cyan-400" /> Cấp học:
              </span>
              <div className="flex items-center bg-slate-950/80 p-0.5 rounded-lg border border-slate-800">
                <button
                  onClick={() => handleSelectLevel('primary')}
                  className={`px-2.5 py-0.5 rounded-md text-xs font-bold transition-all ${
                    schoolLevel === 'primary'
                      ? 'bg-amber-400 text-amber-950 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  🐣 Tiểu Học
                </button>
                <button
                  onClick={() => handleSelectLevel('secondary')}
                  className={`px-2.5 py-0.5 rounded-md text-xs font-bold transition-all ${
                    schoolLevel === 'secondary'
                      ? 'bg-cyan-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  🚀 THCS (Khối 6-9)
                </button>
                <button
                  onClick={() => handleSelectLevel('high')}
                  className={`px-2.5 py-0.5 rounded-md text-xs font-bold transition-all ${
                    schoolLevel === 'high'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  ⚡ THPT
                </button>
              </div>
            </div>

            {/* Quick Status: Streak & Joined Class */}
            <div className="flex items-center gap-3">
              {currentUser?.joinedClassName && (
                <span className="hidden sm:inline-flex items-center gap-1 text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  {currentUser.joinedClassName}
                </span>
              )}

              {currentUser && (
                <div className="flex items-center gap-1 text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                  <Flame className="w-3.5 h-3.5 fill-amber-400 animate-bounce" />
                  <span>{currentUser.streakDays} ngày chuỗi</span>
                </div>
              )}

              {/* Toggle Demo Role */}
              <div className="flex items-center gap-1">
                {isTeacher ? (
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      loginAsDemoStudent();
                    }}
                    className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-medium"
                  >
                    <UserCheck className="w-3 h-3" /> Đổi vai: Học sinh
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      loginAsDemoTeacher();
                      setActiveTab('teacher');
                    }}
                    className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-medium"
                  >
                    <GraduationCap className="w-3 h-3" /> Chế độ Giáo viên
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Nav Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Brand Logo */}
            <div 
              onClick={() => {
                soundManager.playClick();
                setActiveTab('games');
              }}
              className="flex items-center gap-3 cursor-pointer select-none group"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-tr from-cyan-500 via-teal-400 to-emerald-400 rounded-2xl flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                🎯
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                    EDUGAME<span className="text-cyan-400">HUB</span>
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:block font-medium">
                  Đuổi Hình Bắt Chữ • Công Nghệ • Tin Học • HĐTN
                </p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setActiveTab('games');
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold transition-all ${
                  activeTab === 'games'
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Gamepad2 className="w-4 h-4 text-cyan-400" />
                <span>Kho Trò Chơi</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playClick();
                  setActiveTab('leaderboard');
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold transition-all ${
                  activeTab === 'leaderboard'
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Bảng Xếp Hạng</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playClick();
                  setShowPinModal(true);
                }}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all active:scale-95"
              >
                <KeyRound className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>Nhập Mã PIN</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playClick();
                  if (!isTeacher) loginAsDemoTeacher();
                  setActiveTab('teacher');
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold transition-all ${
                  activeTab === 'teacher'
                    ? 'bg-purple-500/15 text-purple-300 border border-purple-500/40 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <GraduationCap className="w-4 h-4 text-purple-400" />
                <span>Dành Cho Giáo Viên</span>
              </button>
            </nav>

            {/* Right Controls: XP Bar + Sound + User Profile */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* XP Bar */}
              <div className="hidden lg:block">
                <XpBar />
              </div>

              {/* Sound Toggle */}
              <button
                onClick={handleToggleSound}
                title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
                className="p-2 sm:p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all active:scale-95"
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
                ) : (
                  <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                )}
              </button>

              {/* User Avatar & Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition-all"
                >
                  <img
                    src={currentUser?.avatarUrl || 'https://api.dicebear.com/7.x/bottts/svg?seed=guest'}
                    alt="avatar"
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-900 border border-cyan-500/50"
                  />
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-bold text-white truncate max-w-[100px]">
                      {currentUser?.fullName || 'Khách'}
                    </p>
                    <p className="text-[10px] text-cyan-400 font-semibold uppercase">
                      {currentUser?.role === 'teacher' ? 'Giáo viên' : `Học sinh Khối ${currentUser?.gradeLevel || 6}`}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-2xl p-2 shadow-2xl z-50 animate-pop-in">
                    <div className="p-2.5 border-b border-slate-800 mb-1">
                      <p className="text-xs font-bold text-white">{currentUser?.fullName}</p>
                      <p className="text-[11px] text-slate-400 font-mono">@{currentUser?.username}</p>
                      <div className="mt-2 block lg:hidden">
                        <XpBar />
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        setActiveTab('profile');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
                    >
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      <span>Hồ sơ & Huy hiệu</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        setShowPinModal(true);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/10 rounded-xl transition-colors"
                    >
                      <KeyRound className="w-4 h-4 text-emerald-400" />
                      <span>Nhập mã lớp / phòng</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10 rounded-xl transition-colors mt-1 border-t border-slate-800"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Nav Bar Footer */}
        <div className="md:hidden flex items-center justify-around border-t border-slate-800/80 bg-slate-950/90 py-2 px-2">
          <button
            onClick={() => setActiveTab('games')}
            className={`flex flex-col items-center gap-0.5 text-[11px] font-bold ${
              activeTab === 'games' ? 'text-cyan-400' : 'text-slate-400'
            }`}
          >
            <Gamepad2 className="w-5 h-5" />
            <span>Trò Chơi</span>
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex flex-col items-center gap-0.5 text-[11px] font-bold ${
              activeTab === 'leaderboard' ? 'text-amber-400' : 'text-slate-400'
            }`}
          >
            <Trophy className="w-5 h-5" />
            <span>Bảng Điểm</span>
          </button>
          <button
            onClick={() => setShowPinModal(true)}
            className="flex flex-col items-center gap-0.5 text-[11px] font-bold text-emerald-400"
          >
            <KeyRound className="w-5 h-5" />
            <span>Mã PIN</span>
          </button>
          <button
            onClick={() => {
              if (!isTeacher) loginAsDemoTeacher();
              setActiveTab('teacher');
            }}
            className={`flex flex-col items-center gap-0.5 text-[11px] font-bold ${
              activeTab === 'teacher' ? 'text-purple-400' : 'text-slate-400'
            }`}
          >
            <GraduationCap className="w-5 h-5" />
            <span>Giáo Viên</span>
          </button>
        </div>
      </header>

      {/* Quick PIN Modal */}
      <QuickPinModal
        isOpen={showPinModal}
        onClose={() => setShowPinModal(false)}
        onSuccess={() => setActiveTab('games')}
      />
    </>
  );
};
