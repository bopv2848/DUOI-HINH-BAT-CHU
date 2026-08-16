import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyRound, X, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { joinClassByCode } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { soundManager } from '../../lib/audio';

interface QuickPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const QuickPinModal: React.FC<QuickPinModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { currentUser } = useAuth();
  const [pinCode, setPinCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinCode.trim()) return;

    soundManager.playClick();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const studentId = currentUser?.id || 'std_temp_' + Date.now();
      const res = await joinClassByCode(pinCode, studentId);

      if (res.success) {
        soundManager.playCorrect();
        setSuccessMsg(res.message);
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 1200);
      } else {
        soundManager.playWrong();
        setErrorMsg(res.message);
      }
    } catch {
      setErrorMsg('Có lỗi xảy ra khi kết nối. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden"
        >
          {/* Decorative background glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto mb-3 bg-gradient-to-tr from-cyan-500 to-teal-400 rounded-2xl flex items-center justify-center text-slate-950 shadow-lg shadow-cyan-500/30">
              <KeyRound className="w-7 h-7" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">Nhập Mã Phòng / Lớp Học</h3>
            <p className="text-sm text-slate-400 mt-1">
              Nhập mã 6 ký tự do Thầy/Cô cung cấp để vào phòng thi đấu trực tiếp
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 text-center">
                MÃ PIN LỚP HỌC (Ví dụ: 6A1202, 8B2024)
              </label>
              <input
                type="text"
                maxLength={8}
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value.toUpperCase())}
                placeholder="NHẬP MÃ PIN..."
                autoFocus
                className="w-full text-center tracking-[0.3em] font-mono text-2xl font-extrabold uppercase py-3.5 px-4 bg-slate-950/80 border-2 border-cyan-500/50 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/20 rounded-2xl text-cyan-300 placeholder:text-slate-600 outline-none transition-all"
              />
            </div>

            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </motion.div>
            )}

            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading || pinCode.length < 3}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 disabled:opacity-50 text-slate-950 font-black rounded-2xl shadow-lg shadow-cyan-500/20 active:scale-98 transition-all"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Vào Phòng Thi Ngay</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Quick helper codes */}
          <div className="mt-5 pt-4 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-400 mb-2">Mã mẫu thử nghiệm nhanh:</p>
            <div className="flex justify-center gap-2 flex-wrap">
              {['6A1202', '8B2024', '9C3999'].map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setPinCode(code);
                  }}
                  className="px-2.5 py-1 text-xs font-mono font-bold bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 rounded-lg transition-colors"
                >
                  {code}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
