import React, { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import { useTheme } from './contexts/ThemeContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HeroBanner } from './components/home/HeroBanner';
import { SubjectFilter } from './components/home/SubjectFilter';
import { GameCard } from './components/home/GameCard';
import { CatchWordBoard } from './components/game/CatchWordBoard';
import { RealtimeLeaderboard } from './components/game/RealtimeLeaderboard';
import { QuestionMaker } from './components/teacher/QuestionMaker';
import { ClassManager } from './components/teacher/ClassManager';
import { AnalyticsDashboard } from './components/teacher/AnalyticsDashboard';
import { UserProfileView } from './components/profile/UserProfileView';
import { QuickPinModal } from './components/common/QuickPinModal';
import { Game, Subject } from './types';
import { getGames, getSubjects } from './lib/supabase';
import { soundManager } from './lib/audio';
import { Sparkles, School, BarChart3, PlusCircle } from 'lucide-react';

export const App: React.FC = () => {
  const { currentUser } = useAuth();
  const { schoolLevel } = useTheme();

  const [activeTab, setActiveTab] = useState<'games' | 'leaderboard' | 'teacher' | 'profile'>('games');
  const [teacherSubTab, setTeacherSubTab] = useState<'create' | 'classes' | 'analytics'>('create');
  const [activeGame, setActiveGame] = useState<Game | null>(null);

  const [games, setGames] = useState<Game[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedSubjectCode, setSelectedSubjectCode] = useState<string>('ALL');
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPinModal, setShowPinModal] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const [fetchedGames, fetchedSubjects] = await Promise.all([getGames(), getSubjects()]);
    setGames(fetchedGames);
    setSubjects(fetchedSubjects);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Lọc trò chơi theo Cấp học, Môn học, Khối lớp và Từ khóa tìm kiếm
  const filteredGames = games.filter((game) => {
    // Lọc theo search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = game.title.toLowerCase().includes(q);
      const matchDesc = game.description.toLowerCase().includes(q);
      const matchSubject = game.subjectName?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchSubject) return false;
    }

    // Lọc theo Khối lớp
    if (selectedGrade !== null && game.gradeLevel !== selectedGrade) {
      return false;
    }

    // Lọc theo Môn học
    if (selectedSubjectCode !== 'ALL') {
      if (selectedSubjectCode === 'CONG_NGHE') {
        return game.subjectCode?.startsWith('CONG_NGHE') || game.title.includes('Công nghệ') || game.title.includes('Kỹ thuật');
      }
      if (selectedSubjectCode === 'HDTN_HN') {
        return game.subjectCode?.startsWith('HDTN_HN') || game.title.includes('Định Hướng') || game.title.includes('Trải Nghiệm');
      }
      if (selectedSubjectCode === 'TIN_HOC') {
        return game.subjectCode?.startsWith('TIN_HOC') || game.title.includes('Tin học') || game.title.includes('Mạng') || game.title.includes('Thuật Toán');
      }
    }

    return true;
  });

  const handleStartGame = (game: Game) => {
    soundManager.playClick();
    setActiveGame(game);
  };

  const handleQuickPlay = () => {
    if (games.length > 0) {
      handleStartGame(games[0]);
    }
  };

  // Màn hình chơi game Đuổi hình bắt chữ
  if (activeGame) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-white">
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 py-4">
          <CatchWordBoard
            game={activeGame}
            onExit={() => setActiveGame(null)}
            onGoToLeaderboard={() => {
              setActiveGame(null);
              setActiveTab('leaderboard');
            }}
          />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-white">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* TAB 1: KHO TRÒ CHƠI HỌC TẬP (GAMES) */}
        {activeTab === 'games' && (
          <div className="space-y-6">
            <HeroBanner
              onQuickPlay={handleQuickPlay}
              onOpenPinModal={() => setShowPinModal(true)}
            />

            <SubjectFilter
              subjects={subjects}
              selectedSubjectCode={selectedSubjectCode}
              onSelectSubjectCode={setSelectedSubjectCode}
              selectedGrade={selectedGrade}
              onSelectGrade={setSelectedGrade}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />

            {/* Games Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  <span>Trò Chơi Đuổi Hình Bắt Chữ</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {filteredGames.length} bộ đề
                  </span>
                </h2>
              </div>

              {loading ? (
                <div className="py-20 text-center">
                  <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-sm text-slate-400">Đang tải kho trò chơi học tập...</p>
                </div>
              ) : filteredGames.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredGames.map((game) => (
                    <GameCard key={game.id} game={game} onPlay={handleStartGame} />
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center bg-slate-900/60 border border-slate-800 rounded-3xl p-8">
                  <p className="text-base text-slate-300 font-bold mb-2">
                    Không tìm thấy trò chơi phù hợp với bộ lọc hiện tại.
                  </p>
                  <p className="text-xs text-slate-500 mb-4">
                    Thử chọn "Tất Cả Khối" hoặc "Tất Cả Môn" để khám phá thêm nhiều bài học thú vị.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedSubjectCode('ALL');
                      setSelectedGrade(null);
                      setSearchQuery('');
                    }}
                    className="px-4 py-2 bg-slate-800 text-cyan-300 text-xs font-bold rounded-xl border border-slate-700"
                  >
                    Đặt Lại Bộ Lọc
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: BẢNG XẾP HẠNG REALTIME (LEADERBOARD) */}
        {activeTab === 'leaderboard' && <RealtimeLeaderboard />}

        {/* TAB 3: DÀNH CHO GIÁO VIÊN (TEACHER HUB) */}
        {activeTab === 'teacher' && (
          <div className="space-y-6">
            {/* Teacher Subtabs */}
            <div className="flex items-center gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl max-w-xl mx-auto">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setTeacherSubTab('create');
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  teacherSubTab === 'create'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                <span>Soạn Trò Chơi</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playClick();
                  setTeacherSubTab('classes');
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  teacherSubTab === 'classes'
                    ? 'bg-cyan-500 text-slate-950 shadow-lg font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <School className="w-4 h-4" />
                <span>Quản Lý Lớp & Mã PIN</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playClick();
                  setTeacherSubTab('analytics');
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  teacherSubTab === 'analytics'
                    ? 'bg-emerald-500 text-slate-950 shadow-lg font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Thống Kê Điểm Số</span>
              </button>
            </div>

            {/* Subtab Contents */}
            {teacherSubTab === 'create' && (
              <QuestionMaker
                subjects={subjects}
                onGameCreated={() => {
                  loadData();
                  setActiveTab('games');
                }}
              />
            )}

            {teacherSubTab === 'classes' && <ClassManager />}

            {teacherSubTab === 'analytics' && <AnalyticsDashboard games={games} />}
          </div>
        )}

        {/* TAB 4: HỒ SƠ & HUY HIỆU (PROFILE) */}
        {activeTab === 'profile' && <UserProfileView />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Quick PIN Modal */}
      <QuickPinModal
        isOpen={showPinModal}
        onClose={() => setShowPinModal(false)}
        onSuccess={() => setActiveTab('games')}
      />
    </div>
  );
};
