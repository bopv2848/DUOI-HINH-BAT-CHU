import React from 'react';
import { motion } from 'framer-motion';
import { Play, Sparkles, BookOpen, Users, Clock } from 'lucide-react';
import { Game } from '../../types';
import { soundManager } from '../../lib/audio';

interface GameCardProps {
  game: Game;
  onPlay: (game: Game) => void;
}

export const GameCard: React.FC<GameCardProps> = ({ game, onPlay }) => {
  const questionCount = game.questions?.length || game.totalQuestions || 4;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/60 shadow-xl transition-all duration-300"
    >
      <div>
        {/* Thumbnail Image Container */}
        <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
          <img
            src={game.thumbnailUrl}
            alt={game.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

          {/* Badges: Subject & Grade */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
            <span className="px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider bg-slate-950/80 text-cyan-300 border border-cyan-500/40 backdrop-blur-md">
              {game.subjectName || 'Môn học'}
            </span>
            <span className="px-2 py-1 rounded-xl text-[10px] font-black bg-amber-400 text-slate-950 shadow-sm">
              Khối {game.gradeLevel}
            </span>
          </div>

          {/* Plays Count Badge */}
          <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-lg bg-slate-950/80 text-slate-300 text-[11px] font-mono flex items-center gap-1 border border-slate-800 backdrop-blur-sm">
            <Users className="w-3 h-3 text-cyan-400" />
            <span>{game.playsCount} lượt</span>
          </div>
        </div>

        {/* Info Content */}
        <div className="p-5 space-y-2">
          <h3 className="text-base sm:text-lg font-black text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
            {game.title}
          </h3>

          <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
            {game.description}
          </p>

          <div className="flex items-center gap-3 pt-2 text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span>{questionCount} câu đố</span>
            </div>
            <div className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>+{(questionCount * 100)} điểm</span>
            </div>
          </div>
        </div>
      </div>

      {/* Button Chơi Ngay */}
      <div className="p-5 pt-0">
        <button
          onClick={() => {
            soundManager.playClick();
            onPlay(game);
          }}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-black rounded-2xl shadow-lg shadow-cyan-500/20 active:scale-95 transition-all text-xs sm:text-sm group-hover:shadow-cyan-500/40"
        >
          <Play className="w-4 h-4 fill-slate-950" />
          <span>Vào Chơi Trận Này</span>
        </button>
      </div>
    </motion.div>
  );
};
