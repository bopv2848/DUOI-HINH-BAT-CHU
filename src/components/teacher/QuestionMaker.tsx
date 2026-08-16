import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  PlusCircle, 
  Trash2, 
  Sparkles, 
  Save, 
  Image as ImageIcon, 
  Lightbulb, 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { Subject, Game, GameQuestion, SchoolLevel } from '../../types';
import { saveNewGame } from '../../lib/supabase';
import { soundManager } from '../../lib/audio';
import { useAuth } from '../../contexts/AuthContext';

interface QuestionMakerProps {
  subjects: Subject[];
  onGameCreated: () => void;
}

export const QuestionMaker: React.FC<QuestionMakerProps> = ({ subjects, onGameCreated }) => {
  const { currentUser } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || '');
  const [schoolLevel, setSchoolLevel] = useState<SchoolLevel>('secondary');
  const [gradeLevel, setGradeLevel] = useState(6);
  const [thumbnailUrl, setThumbnailUrl] = useState('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80');

  // Danh sách các câu hỏi đang tạo
  const [questions, setQuestions] = useState<Omit<GameQuestion, 'id' | 'gameId'>[]>([
    {
      imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
      answerText: 'AN TOÀN MẠNG',
      hintText: 'Biện pháp bảo vệ tài khoản và phòng tránh mã độc khi trực tuyến.',
      explanation: 'An toàn thông tin mạng là yếu tố then chốt giúp học sinh sử dụng Internet thông minh và văn minh.',
      timeLimitSeconds: 45,
      points: 100,
      orderIndex: 1,
    },
  ]);

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleAddQuestion = () => {
    soundManager.playClick();
    setQuestions((prev) => [
      ...prev,
      {
        imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
        answerText: '',
        hintText: '',
        explanation: '',
        timeLimitSeconds: 45,
        points: 100,
        orderIndex: prev.length + 1,
      },
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    soundManager.playClick();
    if (questions.length <= 1) return;
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index: number, field: keyof Omit<GameQuestion, 'id' | 'gameId'>, value: any) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!title.trim()) {
      setErrorMsg('Vui lòng nhập tên bộ trò chơi!');
      return;
    }

    // Kiểm tra các câu hỏi
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.answerText.trim()) {
        setErrorMsg(`Câu ${i + 1} chưa có đáp án chữ cái!`);
        return;
      }
      if (!q.hintText.trim()) {
        setErrorMsg(`Câu ${i + 1} chưa có gợi ý manh mối!`);
        return;
      }
    }

    soundManager.playClick();
    setSaving(true);

    try {
      const gameId = 'game_custom_' + Date.now().toString(36);
      const selectedSubject = subjects.find((s) => s.id === selectedSubjectId);

      const formattedQuestions: GameQuestion[] = questions.map((q, idx) => ({
        id: `q_${gameId}_${idx + 1}`,
        gameId,
        imageUrl: q.imageUrl,
        answerText: q.answerText.trim().toUpperCase(),
        hintText: q.hintText.trim(),
        explanation: q.explanation?.trim() || undefined,
        timeLimitSeconds: q.timeLimitSeconds || 45,
        points: q.points || 100,
        orderIndex: idx + 1,
      }));

      const newGame: Game = {
        id: gameId,
        title: title.trim(),
        description: description.trim() || 'Bộ câu đố Đuổi hình bắt chữ do giáo viên biên soạn.',
        subjectId: selectedSubjectId,
        subjectName: selectedSubject?.name || 'Môn học',
        subjectCode: selectedSubject?.code || 'CUSTOM',
        gameType: 'catch_word',
        schoolLevel,
        gradeLevel: Number(gradeLevel),
        thumbnailUrl: thumbnailUrl.trim() || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
        totalQuestions: formattedQuestions.length,
        playsCount: 0,
        authorId: currentUser?.id,
        authorName: currentUser?.fullName || 'Giáo viên',
        isPublished: true,
        questions: formattedQuestions,
      };

      const success = await saveNewGame(newGame);
      if (success) {
        soundManager.playCorrect();
        setSuccessMsg('Đã tạo và xuất bản bộ trò chơi thành công vào kho học liệu!');
        setTimeout(() => {
          onGameCreated();
        }, 1200);
      } else {
        setErrorMsg('Không thể lưu trò chơi. Vui lòng kiểm tra lại!');
      }
    } catch {
      setErrorMsg('Đã có lỗi xảy ra trong quá trình lưu trò chơi.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
        <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Công Cụ Soạn Trò Chơi (Form Maker)
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Tự tạo bộ câu đố Đuổi hình bắt chữ bám sát kiến thức bài giảng GDPT 2018
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Thông tin chung */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Tên Bộ Trò Chơi *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ví dụ: Đuổi Hình Bắt Chữ: Bản Vẽ Kỹ Thuật 8"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-purple-400 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Mô tả ngắn gọn
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả nội dung bài học, mục tiêu cần đạt..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-purple-400 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Môn Học (GDPT 2018)
              </label>
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs font-bold text-cyan-300 outline-none"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Khối Lớp
              </label>
              <select
                value={gradeLevel}
                onChange={(e) => setGradeLevel(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs font-bold text-amber-300 outline-none"
              >
                <option value={6}>Khối 6</option>
                <option value={7}>Khối 7</option>
                <option value={8}>Khối 8</option>
                <option value={9}>Khối 9</option>
                <option value={4}>Khối 4 (Tiểu học)</option>
                <option value={10}>Khối 10 (THPT)</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Ảnh bìa Thumbnail (URL)
              </label>
              <input
                type="url"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:border-purple-400 outline-none font-mono"
              />
            </div>
          </div>
        </div>

        {/* Danh sách các câu đố hình ảnh */}
        <div className="pt-6 border-t border-slate-800 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span>Danh Sách Câu Hỏi ({questions.length})</span>
            </h3>
            <button
              type="button"
              onClick={handleAddQuestion}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 rounded-xl text-xs font-bold transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Thêm Câu Đố</span>
            </button>
          </div>

          {questions.map((q, idx) => (
            <motion.div
              key={`question-form-${idx}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 sm:p-5 bg-slate-950/70 border border-slate-800 rounded-2xl relative space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-lg text-xs font-black">
                  CÂU ĐỐ #{idx + 1}
                </span>

                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveQuestion(idx)}
                    className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Xóa câu hỏi này"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                    <ImageIcon className="w-3.5 h-3.5 text-cyan-400" /> URL Hình Ảnh Câu Đố *
                  </label>
                  <input
                    type="url"
                    value={q.imageUrl}
                    onChange={(e) => handleQuestionChange(idx, 'imageUrl', e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none font-mono focus:border-cyan-400"
                    required
                  />

                  {q.imageUrl && (
                    <div className="mt-2 w-full h-24 rounded-lg overflow-hidden border border-slate-800 bg-slate-900 flex items-center justify-center">
                      <img src={q.imageUrl} alt="preview" className="h-full object-contain" />
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Đáp Án Chữ Cái (Tự Động Viết Hoa) *
                    </label>
                    <input
                      type="text"
                      value={q.answerText}
                      onChange={(e) => handleQuestionChange(idx, 'answerText', e.target.value.toUpperCase())}
                      placeholder="Ví dụ: BẢN VẼ KỸ THUẬT"
                      className="w-full bg-slate-900 border-2 border-cyan-500/50 rounded-xl px-3 py-2 text-sm font-black text-cyan-300 uppercase tracking-wider outline-none focus:border-cyan-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-400" /> Manh Mối Gợi Ý *
                    </label>
                    <input
                      type="text"
                      value={q.hintText}
                      onChange={(e) => handleQuestionChange(idx, 'hintText', e.target.value)}
                      placeholder="Gợi ý giúp học sinh suy luận..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Lời giải thích kiến thức GDPT 2018 */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-400" /> Góc Kiến Thức GDPT 2018 (Hiển thị sau khi giải đúng)
                </label>
                <textarea
                  rows={2}
                  value={q.explanation || ''}
                  onChange={(e) => handleQuestionChange(idx, 'explanation', e.target.value)}
                  placeholder="Giải thích ngắn gọn ý nghĩa khái niệm để củng cố kiến thức cho học sinh..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white outline-none focus:border-emerald-400"
                />
              </div>

              {/* Thời gian & Điểm */}
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-400">Thời gian:</span>
                  <select
                    value={q.timeLimitSeconds}
                    onChange={(e) => handleQuestionChange(idx, 'timeLimitSeconds', Number(e.target.value))}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white font-mono"
                  >
                    <option value={30}>30 giây</option>
                    <option value={45}>45 giây</option>
                    <option value={60}>60 giây</option>
                    <option value={90}>90 giây</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-slate-400">Điểm thưởng:</span>
                  <select
                    value={q.points}
                    onChange={(e) => handleQuestionChange(idx, 'points', Number(e.target.value))}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-amber-300 font-mono font-bold"
                  >
                    <option value={50}>50 điểm</option>
                    <option value={100}>100 điểm</option>
                    <option value={150}>150 điểm</option>
                    <option value={200}>200 điểm</option>
                  </select>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Thông báo lỗi / thành công */}
        {errorMsg && (
          <div className="flex items-center gap-2 p-3.5 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="flex items-center gap-2 p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Nút Submit */}
        <button
          type="submit"
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-black rounded-2xl shadow-xl shadow-purple-500/20 active:scale-98 transition-all text-sm sm:text-base"
        >
          {saving ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>Xuất Bản Bộ Trò Chơi Lên Hệ Thống</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
