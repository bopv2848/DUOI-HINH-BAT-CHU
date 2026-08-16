import React from 'react';
import { motion } from 'framer-motion';
import { soundManager } from '../../lib/audio';

interface LetterSlotsProps {
  answerWords: string[]; // Các từ trong đáp án, ví dụ: ["MẠNG", "MÁY", "TÍNH"]
  userInputs: { char: string; poolIndex: number }[];
  onRemoveChar: (inputIndex: number) => void;
  isCorrect: boolean | null;
}

export const LetterSlots: React.FC<LetterSlotsProps> = ({
  answerWords,
  userInputs,
  onRemoveChar,
  isCorrect,
}) => {
  let globalCharIndex = 0;

  return (
    <div className="flex flex-wrap items-center justify-center gap-y-3 gap-x-6 my-4 select-none">
      {answerWords.map((word, wordIdx) => {
        const letters = word.split('');

        return (
          <div key={`word-${wordIdx}`} className="flex items-center gap-1 sm:gap-2">
            {letters.map((_, charIdx) => {
              const currentInputIdx = globalCharIndex++;
              const filledItem = userInputs[currentInputIdx];
              const isFilled = Boolean(filledItem && filledItem.char);

              let statusColor = 'border-cyan-500/50 bg-slate-900/90 text-cyan-300 shadow-inner';
              if (isCorrect === true) {
                statusColor = 'border-emerald-400 bg-emerald-500/20 text-emerald-300 shadow-emerald-500/30 scale-105';
              } else if (isCorrect === false) {
                statusColor = 'border-red-400 bg-red-500/20 text-red-300 animate-shake';
              } else if (isFilled) {
                statusColor = 'border-cyan-400 bg-cyan-950/60 text-white shadow-md shadow-cyan-500/20';
              }

              return (
                <motion.button
                  key={`slot-${wordIdx}-${charIdx}`}
                  whileHover={isFilled ? { scale: 1.08 } : {}}
                  whileTap={isFilled ? { scale: 0.92 } : {}}
                  onClick={() => {
                    if (isFilled && isCorrect === null) {
                      soundManager.playClick();
                      onRemoveChar(currentInputIdx);
                    }
                  }}
                  className={`w-9 h-11 sm:w-12 sm:h-14 md:w-14 md:h-16 flex items-center justify-center font-mono text-lg sm:text-2xl md:text-3xl font-black rounded-xl sm:rounded-2xl border-2 transition-all cursor-pointer ${statusColor}`}
                >
                  {isFilled ? (
                    <motion.span
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="uppercase"
                    >
                      {filledItem.char}
                    </motion.span>
                  ) : (
                    <span className="w-2.5 h-1 bg-slate-700/80 rounded-full" />
                  )}
                </motion.button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
