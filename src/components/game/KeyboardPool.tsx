import React from 'react';
import { motion } from 'framer-motion';
import { soundManager } from '../../lib/audio';

interface KeyboardPoolProps {
  pool: string[]; // Mảng các ký tự trong kho xáo trộn
  usedIndices: number[]; // Các vị trí trong pool đã được chọn vào ô
  removedIndices: number[]; // Các vị trí bị trợ giúp loại bỏ
  onSelectChar: (char: string, poolIndex: number) => void;
  disabled?: boolean;
}

export const KeyboardPool: React.FC<KeyboardPoolProps> = ({
  pool,
  usedIndices,
  removedIndices,
  onSelectChar,
  disabled = false,
}) => {
  return (
    <div className="max-w-xl mx-auto my-3 select-none">
      <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 sm:gap-2.5 justify-items-center">
        {pool.map((char, index) => {
          const isUsed = usedIndices.includes(index);
          const isRemoved = removedIndices.includes(index);

          if (isRemoved) {
            return (
              <div
                key={`removed-${index}`}
                className="w-10 h-11 sm:w-12 sm:h-13 rounded-xl sm:rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 opacity-20 pointer-events-none"
              />
            );
          }

          return (
            <motion.button
              key={`pool-${index}-${char}`}
              whileHover={!isUsed && !disabled ? { scale: 1.1, y: -2 } : {}}
              whileTap={!isUsed && !disabled ? { scale: 0.9 } : {}}
              disabled={isUsed || disabled}
              onClick={() => {
                if (!isUsed && !disabled) {
                  soundManager.playClick();
                  onSelectChar(char, index);
                }
              }}
              className={`w-10 h-11 sm:w-12 sm:h-13 flex items-center justify-center font-mono text-base sm:text-xl font-black rounded-xl sm:rounded-2xl border-b-4 transition-all uppercase ${
                isUsed
                  ? 'border-slate-800 bg-slate-900/60 text-slate-600 opacity-40 cursor-not-allowed translate-y-1 border-b-0'
                  : 'border-cyan-600 bg-gradient-to-b from-slate-800 to-slate-900 hover:from-cyan-900/40 hover:to-slate-800 text-cyan-300 border border-cyan-500/40 shadow-md shadow-cyan-950/50 active:translate-y-1'
              }`}
            >
              {char}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
