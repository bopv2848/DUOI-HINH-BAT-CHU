import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Trash2, BookOpen, X, Sparkles } from 'lucide-react';
import { soundManager } from '../../lib/audio';

interface GameHintModalProps {
  isOpen: boolean;
  onClose: () => void;
  hintText: string;
  onRevealOneLetter: () => void;
  onRemoveDistractors: () => void;
  revealsLeft: number;
  removesLeft: number;
}

export const GameHintModal: React.FC<GameHintModalProps> = ({
  isOpen,
  onClose,
  hintText,
  onRevealOneLetter,
  onRemoveDistractors,
  revealsLeft,
  removesLeft,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl overflow-hidden"
        >
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

          {/* Title */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Lightbulb className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white">Quyền Trợ Giúp Tri Thức</h3>
              <p className="text-xs text-slate-400">Chọn trợ giúp để vượt qua câu đố hóc búa</p>
            </div>
          </div>

          {/* Gợi ý kiến thức */}
          <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl mb-4">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 mb-1.5 uppercase">
              <BookOpen className="w-4 h-4" /> Manh Mối Gợi Ý:
            </div>
            <p className="text-sm text-slate-200 leading-relaxed font-medium">
              "{hintText}"
            </p>
          </div>

          {/* Các quyền trợ giúp tương tác */}
          <div className="space-y-3">
            {/* Trợ giúp 1: Mở 1 chữ cái */}
            <button
              disabled={revealsLeft <= 0}
              onClick={() => {
                soundManager.playCorrect();
                onRevealOneLetter();
                onClose();
              }}
              className="w-full flex items-center justify-between p-3.5 bg-gradient-to-r from-cyan-950/60 to-slate-800/80 hover:from-cyan-900/60 hover:to-slate-700/80 disabled:opacity-40 border border-cyan-500/30 rounded-2xl text-left transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-cyan-300">
                    Mở 1 Chữ Cái Chuẩn Xác
                  </h4>
                  <p className="text-xs text-slate-400">Điền tự động 1 ký tự vào đúng ô trống</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Còn {revealsLeft} lượt
              </span>
            </button>

            {/* Trợ giúp 2: Bỏ chữ thừa */}
            <button
              disabled={removesLeft <= 0}
              onClick={() => {
                soundManager.playCorrect();
                onRemoveDistractors();
                onClose();
              }}
              className="w-full flex items-center justify-between p-3.5 bg-gradient-to-r from-amber-950/60 to-slate-800/80 hover:from-amber-900/60 hover:to-slate-700/80 disabled:opacity-40 border border-amber-500/30 rounded-2xl text-left transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-amber-300">
                    Loại Bỏ Ký Tự Thừa
                  </h4>
                  <p className="text-xs text-slate-400">Xóa bớt 3 chữ cái gây nhiễu trên bàn phím</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Còn {removesLeft} lượt
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
