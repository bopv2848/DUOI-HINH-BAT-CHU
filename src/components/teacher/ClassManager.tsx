import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, Copy, Check, School, Sparkles, BookOpen, Trash2, X } from 'lucide-react';
import { ClassRoom, SchoolLevel } from '../../types';
import { getClasses, createNewClass, deleteClass } from '../../lib/supabase';
import { soundManager } from '../../lib/audio';
import { useAuth } from '../../contexts/AuthContext';

export const ClassManager: React.FC = () => {
  const { currentUser } = useAuth();
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // New Class Form State
  const [className, setClassName] = useState('');
  const [schoolLevel, setSchoolLevel] = useState<SchoolLevel>('secondary');
  const [gradeLevel, setGradeLevel] = useState(6);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadClasses = async () => {
    const data = await getClasses();
    setClasses(data);
  };

  useEffect(() => {
    loadClasses();
  }, []);

  // Cập nhật khối lớp mặc định khi đổi cấp học
  const handleSchoolLevelChange = (level: SchoolLevel) => {
    setSchoolLevel(level);
    if (level === 'primary') setGradeLevel(4);
    else if (level === 'secondary') setGradeLevel(6);
    else if (level === 'high') setGradeLevel(10);
  };

  const handleCopyCode = (code: string) => {
    soundManager.playClick();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleDeleteClass = async (classId: string, name: string, joinCode?: string) => {
    if (window.confirm(`Thầy có chắc chắn muốn xóa lớp "${name}" không?`)) {
      soundManager.playClick();
      await deleteClass(classId, joinCode);
      await loadClasses();
      setSuccessMessage(`Đã xóa thành công lớp "${name}"`);
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!className.trim() || isSubmitting) return;

    setIsSubmitting(true);
    soundManager.playCorrect();

    // Tạo mã PIN 6 ký tự ngẫu nhiên (Ví dụ: 6A382, 8B719...)
    const letter = ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)];
    const generatedPin = `${gradeLevel}${letter}${Math.floor(100 + Math.random() * 900)}`;

    const newClassObj: ClassRoom = {
      id: 'cls_' + Date.now().toString(36),
      name: className.trim(),
      gradeLevel: Number(gradeLevel),
      schoolLevel,
      teacherId: currentUser?.id || 'd9b1c1e0-0001-4000-8000-000000000001',
      teacherName: currentUser?.fullName || 'Thầy Bộ (Giáo viên Tin & Công nghệ)',
      joinCode: generatedPin,
      description: description.trim() || 'Lớp học thi đua Đuổi hình bắt chữ.',
      studentCount: 0,
      createdAt: new Date().toISOString(),
    };

    await createNewClass(newClassObj);
    await loadClasses();
    setIsSubmitting(false);
    setShowAddModal(false);
    setClassName('');
    setDescription('');

    // Hiển thị thông báo thành công
    setSuccessMessage(`Đã tạo thành công lớp "${newClassObj.name}" với Mã PIN: ${generatedPin}`);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  // Danh sách các khối lớp theo cấp học
  const getGradeOptions = () => {
    if (schoolLevel === 'primary') return [1, 2, 3, 4, 5];
    if (schoolLevel === 'high') return [10, 11, 12];
    return [6, 7, 8, 9];
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
      {/* Toast thông báo tạo thành công */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-4 p-4 bg-emerald-500/20 border border-emerald-500/50 rounded-2xl flex items-center justify-between text-emerald-300 text-sm font-bold shadow-lg"
          >
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
            <button onClick={() => setSuccessMessage(null)} className="text-emerald-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
            <School className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Quản Lý Lớp Học & Phòng Thi Đấu
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Tạo mã PIN để học sinh tham gia thi đấu theo từng lớp học
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            soundManager.playClick();
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-black rounded-xl shadow-lg shadow-cyan-500/25 transition-all active:scale-95 text-xs sm:text-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo Lớp Học Mới</span>
        </button>
      </div>

      {/* Danh sách các lớp */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.map((c) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 bg-slate-950/80 border border-slate-800 hover:border-cyan-500/50 rounded-2xl transition-all relative flex flex-col justify-between group shadow-md"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Khối {c.gradeLevel || 6}
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    <span>{c.studentCount || 0} học sinh</span>
                  </div>
                  <button
                    onClick={() => handleDeleteClass(c.id, c.name, c.joinCode)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all cursor-pointer"
                    title="Xóa lớp học này"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-base font-black text-white group-hover:text-cyan-300 transition-colors">
                {c.name}
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                {c.description || 'Chưa có mô tả chi tiết.'}
              </p>
            </div>

            {/* Mã PIN & Copy Button */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 font-semibold uppercase block">
                  MÃ PIN THAM GIA
                </span>
                <span className="text-lg font-mono font-black text-amber-400 tracking-wider">
                  {c.joinCode || 'CHƯA CÓ'}
                </span>
              </div>

              <button
                onClick={() => handleCopyCode(c.joinCode)}
                className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                title="Sao chép mã PIN gửi học sinh"
              >
                {copiedCode === c.joinCode ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Đã chép</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Sao chép</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal Tạo Lớp Mới */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl relative"
            >
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <School className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Tạo Lớp Học / Phòng Thi Mới</h3>
                  <p className="text-xs text-slate-400">Cấp mã PIN 6 số tự động cho học sinh</p>
                </div>
              </div>

              <form onSubmit={handleCreateClass} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Tên Lớp Học *
                  </label>
                  <input
                    type="text"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    placeholder="Ví dụ: Lớp 6A3 - Môn Tin Học"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-cyan-400 outline-none"
                    required
                    autoFocus
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                      Cấp Học
                    </label>
                    <select
                      value={schoolLevel}
                      onChange={(e) => handleSchoolLevelChange(e.target.value as SchoolLevel)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-cyan-300 font-bold outline-none cursor-pointer"
                    >
                      <option value="primary">Tiểu học (Lớp 1-5)</option>
                      <option value="secondary">THCS (Khối 6-9)</option>
                      <option value="high">THPT (Khối 10-12)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                      Khối Lớp
                    </label>
                    <select
                      value={gradeLevel}
                      onChange={(e) => setGradeLevel(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-amber-300 font-bold outline-none cursor-pointer"
                    >
                      {getGradeOptions().map((g) => (
                        <option key={g} value={g}>
                          Khối {g}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Ghi chú / Mô tả ngắn
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Mô tả nhóm học tập hoặc chủ đề thi đấu..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:border-cyan-400 outline-none"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-black rounded-xl text-xs shadow-md active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{isSubmitting ? 'Đang tạo...' : 'Tạo Lớp & Cấp PIN'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
