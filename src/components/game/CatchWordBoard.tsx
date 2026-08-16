import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Timer, 
  Sparkles, 
  Zap, 
  Lightbulb, 
  CheckCircle2, 
  ArrowRight, 
  Maximize2, 
  X,
  BookOpen,
  Volume2
} from 'lucide-react';
import { Game, GameQuestion } from '../../types';
import { LetterSlots } from './LetterSlots';
import { KeyboardPool } from './KeyboardPool';
import { GameHintModal } from './GameHintModal';
import { GameResultModal } from './GameResultModal';
import { soundManager } from '../../lib/audio';
import { triggerBurst } from '../common/ConfettiEffect';
import { recordPlayHistory } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface CatchWordBoardProps {
  game: Game;
  onExit: () => void;
  onGoToLeaderboard: () => void;
}

// Bảng ký tự chữ cái tiếng Việt gây nhiễu
const EXTRA_CHARS = ['A', 'B', 'C', 'D', 'Đ', 'E', 'G', 'H', 'I', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'X', 'Y'];

export const CatchWordBoard: React.FC<CatchWordBoardProps> = ({ game, onExit, onGoToLeaderboard }) => {
  const { currentUser, updateUserXp } = useAuth();

  const questions: GameQuestion[] = useMemo(() => {
    return game.questions && game.questions.length > 0 ? game.questions : [];
  }, [game.questions]);

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const currentQuestion: GameQuestion | undefined = questions[currentQIndex];

  // Game Play State
  const [userInputs, setUserInputs] = useState<{ char: string; poolIndex: number }[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // Time & Score State
  const [timeLeft, setTimeLeft] = useState(currentQuestion?.timeLimitSeconds || 45);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [totalScore, setTotalScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [currentCombo, setCurrentCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);

  // Hints State
  const [revealsLeft, setRevealsLeft] = useState(2);
  const [removesLeft, setRemovesLeft] = useState(2);
  const [removedIndices, setRemovedIndices] = useState<number[]>([]);
  const [showHintModal, setShowHintModal] = useState(false);
  const [showZoomImage, setShowZoomImage] = useState(false);

  // End Game Result State
  const [isGameOver, setIsGameOver] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);
  const [newLevel, setNewLevel] = useState(1);
  const [leveledUp, setLeveledUp] = useState(false);

  // Chuẩn hóa đáp án thành danh sách các từ và ký tự
  const answerWords = useMemo(() => {
    if (!currentQuestion) return [];
    return currentQuestion.answerText.trim().toUpperCase().split(/\s+/);
  }, [currentQuestion]);

  const rawAnswerLetters = useMemo(() => {
    return answerWords.join('').split('');
  }, [answerWords]);

  // Tạo kho ký tự xáo trộn cho câu hỏi hiện tại
  const [keyboardPool, setKeyboardPool] = useState<string[]>([]);

  const setupQuestion = useCallback((q: GameQuestion) => {
    const letters = q.answerText.trim().toUpperCase().replace(/\s+/g, '').split('');
    // Thêm 4 - 6 ký tự gây nhiễu
    const distractors: string[] = [];
    while (distractors.length < 5) {
      const randomChar = EXTRA_CHARS[Math.floor(Math.random() * EXTRA_CHARS.length)];
      distractors.push(randomChar);
    }
    // Xáo trộn
    const allChars = [...letters, ...distractors].sort(() => Math.random() - 0.5);
    setKeyboardPool(allChars);
    setUserInputs([]);
    setIsCorrect(null);
    setShowExplanation(false);
    setRemovedIndices([]);
    setTimeLeft(q.timeLimitSeconds || 45);
    setIsTimerRunning(true);
  }, []);

  // Khởi tạo câu hỏi đầu tiên
  useEffect(() => {
    if (currentQuestion) {
      setupQuestion(currentQuestion);
    }
  }, [currentQuestion, setupQuestion]);

  // Bộ đếm ngược thời gian
  useEffect(() => {
    if (!isTimerRunning || isGameOver || showExplanation) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Hết giờ câu hỏi này
          soundManager.playWrong();
          handleTimeout();
          return 0;
        }
        if (prev <= 6) {
          soundManager.playTick();
        }
        return prev - 1;
      });
      setTotalTimeSpent((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerRunning, isGameOver, showExplanation]);

  const handleTimeout = () => {
    setIsCorrect(false);
    setCurrentCombo(0);
    setShowExplanation(true);
  };

  // Chọn ký tự từ bàn phím
  const handleSelectChar = (char: string, poolIndex: number) => {
    if (userInputs.length >= rawAnswerLetters.length || isCorrect !== null) return;

    const newInputs = [...userInputs, { char, poolIndex }];
    setUserInputs(newInputs);

    // Kiểm tra xem đã điền đủ ô chưa
    if (newInputs.length === rawAnswerLetters.length) {
      checkAnswer(newInputs);
    }
  };

  // Hoàn tác ký tự trong ô
  const handleRemoveChar = (inputIndex: number) => {
    if (isCorrect !== null) return;
    const newInputs = [...userInputs];
    newInputs.splice(inputIndex, 1);
    setUserInputs(newInputs);
  };

  // Kiểm tra đáp án
  const checkAnswer = (inputs: { char: string; poolIndex: number }[]) => {
    const inputString = inputs.map((i) => i.char).join('');
    const targetString = rawAnswerLetters.join('');

    if (inputString === targetString) {
      // ĐOÁN ĐÚNG!
      setIsCorrect(true);
      setIsTimerRunning(false);
      const newCombo = currentCombo + 1;
      setCurrentCombo(newCombo);
      if (newCombo > maxCombo) setMaxCombo(newCombo);

      // Tính điểm: Điểm cơ bản + Điểm tốc độ + Thưởng combo
      const speedBonus = Math.round((timeLeft / (currentQuestion?.timeLimitSeconds || 45)) * 40);
      const comboMultiplier = 1 + (newCombo - 1) * 0.25;
      const questionScore = Math.round(((currentQuestion?.points || 100) + speedBonus) * comboMultiplier);

      setTotalScore((prev) => prev + questionScore);
      setCorrectCount((prev) => prev + 1);

      if (newCombo >= 2) {
        soundManager.playCombo(newCombo);
      } else {
        soundManager.playCorrect();
      }
      triggerBurst();

      // Hiển thị lời giải thích kiến thức
      setShowExplanation(true);
    } else {
      // ĐOÁN SAI!
      setIsCorrect(false);
      soundManager.playWrong();
      setCurrentCombo(0);

      // Tự động xóa các ô chữ sau 0.8s để học sinh ghép lại
      setTimeout(() => {
        setUserInputs([]);
        setIsCorrect(null);
      }, 900);
    }
  };

  // Trợ giúp: Mở 1 ô chữ đúng
  const handleRevealOneLetter = () => {
    if (revealsLeft <= 0 || isCorrect !== null) return;

    // Tìm vị trí ô trống đầu tiên chưa khớp
    const nextSlotIndex = userInputs.length;
    if (nextSlotIndex >= rawAnswerLetters.length) return;

    const neededChar = rawAnswerLetters[nextSlotIndex];

    // Tìm ký tự này trong keyboardPool chưa được dùng
    const usedPoolIndices = userInputs.map((i) => i.poolIndex);
    const targetPoolIndex = keyboardPool.findIndex(
      (c, idx) => c === neededChar && !usedPoolIndices.includes(idx) && !removedIndices.includes(idx)
    );

    if (targetPoolIndex >= 0) {
      setRevealsLeft((prev) => prev - 1);
      handleSelectChar(neededChar, targetPoolIndex);
    }
  };

  // Trợ giúp: Loại bỏ 3 ký tự thừa
  const handleRemoveDistractors = () => {
    if (removesLeft <= 0 || isCorrect !== null) return;

    const neededChars = [...rawAnswerLetters];
    const usedPoolIndices = userInputs.map((i) => i.poolIndex);
    const toRemove: number[] = [];

    keyboardPool.forEach((char, idx) => {
      if (toRemove.length >= 3) return;
      if (usedPoolIndices.includes(idx) || removedIndices.includes(idx)) return;

      const neededIndex = neededChars.indexOf(char);
      if (neededIndex === -1) {
        toRemove.push(idx);
      } else {
        neededChars.splice(neededIndex, 1);
      }
    });

    if (toRemove.length > 0) {
      setRemovesLeft((prev) => prev - 1);
      setRemovedIndices((prev) => [...prev, ...toRemove]);
    }
  };

  // Chuyển sang câu hỏi tiếp theo
  const handleNextQuestion = () => {
    soundManager.playClick();
    if (currentQIndex + 1 < questions.length) {
      setCurrentQIndex((prev) => prev + 1);
    } else {
      finishGame();
    }
  };

  // Hoàn thành toàn bộ game
  const finishGame = async () => {
    setIsGameOver(true);
    const accuracyRate = Math.round((correctCount / Math.max(1, questions.length)) * 100);

    const historyRecord = {
      id: 'hist_' + Date.now().toString(36),
      studentId: currentUser?.id || 'std_guest',
      studentName: currentUser?.fullName || 'Học sinh',
      gameId: game.id,
      gameTitle: game.title,
      classId: currentUser?.joinedClassId,
      score: totalScore,
      correctCount,
      totalQuestions: questions.length,
      accuracyRate,
      timeSpentSeconds: totalTimeSpent,
      maxCombo,
      completedAt: new Date().toISOString(),
    };

    // Ghi vào database & tính XP
    const result = await recordPlayHistory(historyRecord);
    const authResult = updateUserXp(result.xpEarned);

    setEarnedXp(result.xpEarned);
    setNewLevel(authResult.newLevel);
    setLeveledUp(authResult.leveledUp);
  };

  const usedPoolIndices = useMemo(() => {
    return userInputs.map((i) => i.poolIndex);
  }, [userInputs]);

  // Hỗ trợ bấm phím vật lý từ bàn phím máy tính
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isGameOver || showHintModal || showZoomImage || isCorrect !== null) return;

      if (e.key === 'Backspace') {
        e.preventDefault();
        if (userInputs.length > 0) {
          handleRemoveChar(userInputs.length - 1);
          soundManager.playClick();
        }
        return;
      }

      // Xử lý các ký tự chữ cái
      const keyUpper = e.key.toUpperCase();
      if (keyUpper.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        // Tìm xem ký tự này có trong pool và chưa dùng không
        const poolIdx = keyboardPool.findIndex(
          (c, idx) => c === keyUpper && !usedPoolIndices.includes(idx) && !removedIndices.includes(idx)
        );
        if (poolIdx >= 0) {
          soundManager.playClick();
          handleSelectChar(keyUpper, poolIdx);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keyboardPool, usedPoolIndices, removedIndices, userInputs, isGameOver, showHintModal, showZoomImage, isCorrect]);

  if (!currentQuestion) {
    return (
      <div className="text-center py-20 text-slate-400">
        <p>Bộ trò chơi này hiện chưa có câu hỏi nào.</p>
        <button
          onClick={onExit}
          className="mt-4 px-6 py-2 bg-slate-800 text-white rounded-xl font-bold"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  const timePercent = Math.max(0, (timeLeft / (currentQuestion.timeLimitSeconds || 45)) * 100);

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between gap-3 mb-4 bg-slate-900/90 border border-slate-800/80 p-3 sm:p-4 rounded-2xl backdrop-blur-md">
        {/* Nút Thoát */}
        <button
          onClick={() => {
            soundManager.playClick();
            onExit();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Thoát</span>
        </button>

        {/* Tiêu đề câu hỏi & Tiến độ */}
        <div className="text-center">
          <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-bold block">
            {game.subjectName || 'BỘ MÔN HỌC TẬP'}
          </span>
          <h2 className="text-sm sm:text-base font-black text-white truncate max-w-[200px] sm:max-w-md">
            Câu {currentQIndex + 1}/{questions.length}: {game.title}
          </h2>
        </div>

        {/* Điểm số & Combo Multiplier */}
        <div className="flex items-center gap-2">
          {currentCombo >= 2 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1 px-2.5 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-xl text-xs font-black animate-pulse"
            >
              <Zap className="w-3.5 h-3.5 fill-amber-400" />
              <span>x{1 + (currentCombo - 1) * 0.25}</span>
            </motion.div>
          )}

          <div className="px-3 py-1 bg-slate-950/80 border border-slate-800 rounded-xl text-right">
            <span className="text-[10px] text-slate-400 block font-semibold">ĐIỂM SỐ</span>
            <span className="text-sm sm:text-base font-mono font-black text-cyan-300">
              {totalScore}
            </span>
          </div>
        </div>
      </div>

      {/* Timer Bar */}
      <div className="w-full bg-slate-950/80 rounded-full h-3 sm:h-3.5 p-0.5 border border-slate-800 mb-4 overflow-hidden relative">
        <motion.div
          className={`h-full rounded-full transition-all duration-300 ${
            timeLeft <= 10
              ? 'bg-gradient-to-r from-red-500 to-orange-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]'
              : 'bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400'
          }`}
          style={{ width: `${timePercent}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-bold text-white drop-shadow">
          <Timer className="w-3 h-3 mr-1 inline" /> {timeLeft}s
        </div>
      </div>

      {/* Main Game Screen */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl relative overflow-hidden">
        {/* Decorative corner glows */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Khung Hình Ảnh Câu Đố */}
        <div className="relative max-w-lg mx-auto mb-4 group">
          <div className="relative rounded-2xl overflow-hidden border-2 border-slate-700/80 bg-slate-950 shadow-xl aspect-video flex items-center justify-center">
            {currentQuestion.imageUrl ? (
              <img
                src={currentQuestion.imageUrl}
                alt="Câu đố đuổi hình bắt chữ"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : currentQuestion.imageSvg ? (
              <div
                className="w-full h-full p-4 flex items-center justify-center"
                dangerouslySetInnerHTML={{ __html: currentQuestion.imageSvg }}
              />
            ) : (
              <div className="text-slate-500 text-center p-6">
                <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-40" />
                <p className="text-sm">Hình ảnh minh họa kiến thức</p>
              </div>
            )}

            {/* Nút Phóng to ảnh */}
            {currentQuestion.imageUrl && (
              <button
                onClick={() => setShowZoomImage(true)}
                className="absolute top-3 right-3 p-2 bg-slate-950/70 hover:bg-slate-950 text-white rounded-xl backdrop-blur-sm transition-all opacity-80 hover:opacity-100"
                title="Phóng to ảnh"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            )}

            {/* Badge Độ khó / Điểm */}
            <div className="absolute bottom-3 left-3 px-2.5 py-1 bg-slate-950/80 backdrop-blur-sm rounded-lg border border-slate-700/60 text-xs font-mono font-bold text-amber-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>+{currentQuestion.points}đ</span>
            </div>
          </div>
        </div>

        {/* Vùng Ô Chữ Kết Quả */}
        <LetterSlots
          answerWords={answerWords}
          userInputs={userInputs}
          onRemoveChar={handleRemoveChar}
          isCorrect={isCorrect}
        />

        {/* Nút Trợ Giúp Tri Thức */}
        <div className="flex items-center justify-center gap-3 my-3">
          <button
            onClick={() => {
              soundManager.playClick();
              setShowHintModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs sm:text-sm font-bold shadow-sm active:scale-95 transition-all"
          >
            <Lightbulb className="w-4 h-4 text-amber-400 animate-bounce" />
            <span>Trợ Giúp ({revealsLeft + removesLeft})</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setUserInputs([]);
            }}
            disabled={userInputs.length === 0 || isCorrect !== null}
            className="px-3.5 py-2 bg-slate-800/80 hover:bg-slate-700 disabled:opacity-40 text-slate-300 text-xs sm:text-sm font-semibold rounded-xl border border-slate-700 transition-all active:scale-95"
          >
            Xóa hết ô
          </button>
        </div>

        {/* Bàn Phím Ký Tự Xáo Trộn */}
        <KeyboardPool
          pool={keyboardPool}
          usedIndices={usedPoolIndices}
          removedIndices={removedIndices}
          onSelectChar={handleSelectChar}
          disabled={isCorrect !== null}
        />

        {/* Explanation Card (Hiển thị khi đoán đúng hoặc hết giờ) */}
        <AnimatePresence>
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-5 p-4 sm:p-5 bg-gradient-to-br from-emerald-950/80 to-slate-900 border-2 border-emerald-500/50 rounded-2xl shadow-2xl text-left"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2 text-emerald-400 font-black text-base sm:text-lg">
                  <CheckCircle2 className="w-6 h-6 shrink-0" />
                  <span>ĐÁP ÁN CHÍNH XÁC: {currentQuestion.answerText}</span>
                </div>
              </div>

              {currentQuestion.explanation && (
                <div className="p-3 bg-slate-950/60 rounded-xl border border-emerald-500/20 text-xs sm:text-sm text-slate-200 leading-relaxed font-medium mb-4">
                  <span className="text-emerald-300 font-bold block mb-1">
                    📚 Góc Kiến Thức:
                  </span>
                  {currentQuestion.explanation}
                </div>
              )}

              <button
                onClick={handleNextQuestion}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-black rounded-xl shadow-lg shadow-emerald-500/20 active:scale-98 transition-all text-sm sm:text-base"
              >
                <span>
                  {currentQIndex + 1 < questions.length ? 'Câu Tiếp Theo' : 'Xem Tổng Kết Điểm Số'}
                </span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal Trợ Giúp */}
      <GameHintModal
        isOpen={showHintModal}
        onClose={() => setShowHintModal(false)}
        hintText={currentQuestion.hintText}
        onRevealOneLetter={handleRevealOneLetter}
        onRemoveDistractors={handleRemoveDistractors}
        revealsLeft={revealsLeft}
        removesLeft={removesLeft}
      />

      {/* Modal Phóng to Ảnh */}
      {showZoomImage && currentQuestion.imageUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="relative max-w-3xl w-full bg-slate-900 rounded-3xl p-4 border border-slate-700 shadow-2xl">
            <button
              onClick={() => setShowZoomImage(false)}
              className="absolute top-4 right-4 p-2 bg-slate-800 text-white rounded-full hover:bg-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={currentQuestion.imageUrl}
              alt="Zoomed"
              className="w-full h-auto max-h-[75vh] object-contain rounded-2xl"
            />
          </div>
        </div>
      )}

      {/* Modal Kết Quả Cuối Ván */}
      {isGameOver && (
        <GameResultModal
          score={totalScore}
          totalQuestions={questions.length}
          correctCount={correctCount}
          timeSpentSeconds={totalTimeSpent}
          maxCombo={maxCombo}
          xpEarned={earnedXp}
          newLevel={newLevel}
          leveledUp={leveledUp}
          onPlayAgain={() => {
            setCurrentQIndex(0);
            setTotalScore(0);
            setCorrectCount(0);
            setCurrentCombo(0);
            setMaxCombo(0);
            setTotalTimeSpent(0);
            setRevealsLeft(2);
            setRemovesLeft(2);
            setIsGameOver(false);
            if (questions[0]) setupQuestion(questions[0]);
          }}
          onGoToLeaderboard={onGoToLeaderboard}
          onBackToHome={onExit}
        />
      )}
    </div>
  );
};
