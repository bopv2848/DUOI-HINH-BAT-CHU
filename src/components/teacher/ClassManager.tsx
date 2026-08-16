import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Copy, Check, School, Sparkles, BookOpen } from 'lucide-react';
import { ClassRoom, SchoolLevel } from '../../types';
import { getClasses, createNewClass } from '../../lib/supabase';
import { soundManager } from '../../lib/audio';
import { useAuth } from '../../contexts/AuthContext';

export const ClassManager: React.FC = () => {
  const { currentUser } = useAuth();
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // New Class Form State
  const [className, setClassName] = useState('');
  const [gradeLevel, setGradeLevel] = useState(6);
  const [schoolLevel, setSchoolLevel] = useState<SchoolLevel>('secondary');
  const [description, setDescription] = useState('');

  const loadClasses = async () => {
    const data = await getClasses();
    setClasses(data);
  };

  useEffect(() => {
    loadClasses();
  }, []);

  const handleCopyCode = (code: string) => {
    soundManager.playClick();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!className.trim()) return;

    soundManager.playCorrect();
    // Tạo mã PIN 6 ký tự
    const generatedPin = `${gradeLevel}A${Math.floor(100 + Math.random() * 900)}`;

    const newClassObj: ClassRoom = {
      id: 'cls_' + Date.now().toString(36),
      name: className.trim(),
      gradeLevel: Number(gradeLevel),
      schoolLevel,
      teacherId: currentUser?.id || 'teacher_demo',
      teacherName: currentUser?.fullName || 'Giáo viên phụ trách',
      joinCode: generatedPin,
      description: description.trim(),
      studentCount: 1,
      createdAt: new Date().toISOString(),
    };

    await createNewClass(newClassObj);
    await loadClasses();
    setShowAddModal(false);
    setClassName('');
    setDescription('');
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
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
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-black rounded-xl shadow-lg shadow-cyan-500/20 transition-all active:scale-95 text-xs sm:text-sm"
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
            className="p-5 bg-slate-950/80 border border-slate-800 hover:border-cyan-500/50 rounded-2xl transition-all relative flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Khối {c.gradeLevel}
                </span>
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <Users className="w-3.5 h-3.5 text-slate-500" />
                  <span>{c.studentCount || 0} học sinh</span>
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
                  {c.joinCode}
                </span>
              </div>

              <button
                onClick={() => handleCopyCode(c.joinCode)}
                className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition-colors"
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
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl"
          >
            <h3 className="text-xl font-black text-white mb-4">Tạo Lớp Học / Phòng Thi Mới</h3>

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
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Cấp Học
                  </label>
                  <select
                    value={schoolLevel}
                    onChange={(e) => setSchoolLevel(e.target.value as SchoolLevel)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-cyan-300 font-bold outline-none"
                  >
                    <option value="primary">Tiểu học</option>
                    <option value="secondary">THCS (GDPT 2018)</option>
                    <option value="high">THPT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Khối Lớp
                  </label>
                  <select
                    value={gradeLevel}
                    onChange={(e) => setGradeLevel(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-amber-300 font-bold outline-none"
                  >
                    <option value={6}>Khối 6</option>
                    <option value={7}>Khối 7</option>
                    <option value={8}>Khối 8</option>
                    <option value={9}>Khối 9</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Ghi chú / Mô tả
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
                  className="flex-1 py-2.5 bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-bold"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-black rounded-xl text-xs shadow-md"
                >
                  Tạo Lớp & Lấy Mã PIN
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
