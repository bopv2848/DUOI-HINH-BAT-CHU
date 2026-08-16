import React from 'react';
import { Cpu, Compass, Monitor, BookOpen, Filter, Search, Layers } from 'lucide-react';
import { Subject } from '../../types';
import { soundManager } from '../../lib/audio';

interface SubjectFilterProps {
  subjects: Subject[];
  selectedSubjectCode: string;
  onSelectSubjectCode: (code: string) => void;
  selectedGrade: number | null;
  onSelectGrade: (grade: number | null) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const SubjectFilter: React.FC<SubjectFilterProps> = ({
  subjects,
  selectedSubjectCode,
  onSelectSubjectCode,
  selectedGrade,
  onSelectGrade,
  searchQuery,
  onSearchChange,
}) => {
  // Nhóm các môn chính
  const mainSubjectGroups = [
    {
      id: 'ALL',
      name: 'Tất Cả Môn',
      icon: Layers,
      color: 'from-cyan-500 to-teal-500',
    },
    {
      id: 'CONG_NGHE',
      name: 'Công Nghệ (6-9)',
      icon: Cpu,
      color: 'from-emerald-500 to-teal-600',
    },
    {
      id: 'HDTN_HN',
      name: 'HĐ Trải Nghiệm (6-9)',
      icon: Compass,
      color: 'from-amber-500 to-orange-600',
    },
    {
      id: 'TIN_HOC',
      name: 'Tin Học (6-9)',
      icon: Monitor,
      color: 'from-blue-500 to-cyan-600',
    },
  ];

  const grades = [6, 7, 8, 9];

  return (
    <div className="space-y-4 mb-8">
      {/* Search & Grade Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm kiếm bài học, chủ đề đuổi hình bắt chữ..."
            className="w-full bg-slate-900/90 border border-slate-700/80 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
          />
        </div>

        {/* Grade Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs text-slate-400 font-bold hidden md:inline mr-1">
            Khối Lớp:
          </span>
          <button
            onClick={() => {
              soundManager.playClick();
              onSelectGrade(null);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              selectedGrade === null
                ? 'bg-white text-slate-950 font-black shadow-md'
                : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
            }`}
          >
            Tất Cả Khối
          </button>
          {grades.map((grade) => (
            <button
              key={`grade-${grade}`}
              onClick={() => {
                soundManager.playClick();
                onSelectGrade(grade);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedGrade === grade
                  ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/30'
                  : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              Khối {grade}
            </button>
          ))}
        </div>
      </div>

      {/* Main Subject Category Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {mainSubjectGroups.map((group) => {
          const Icon = group.icon;
          const isSelected = selectedSubjectCode === group.id;

          return (
            <button
              key={group.id}
              onClick={() => {
                soundManager.playClick();
                onSelectSubjectCode(group.id);
              }}
              className={`flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl border transition-all text-left group ${
                isSelected
                  ? 'bg-slate-800 border-cyan-400 shadow-lg shadow-cyan-500/15 scale-[1.02]'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div
                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr ${group.color} text-slate-950 flex items-center justify-center font-bold shadow-md group-hover:scale-105 transition-transform shrink-0`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-white group-hover:text-cyan-300 transition-colors truncate">
                  {group.name}
                </h4>
                <p className="text-[10px] text-slate-400 font-medium">
                  {group.id === 'ALL' ? 'Toàn bộ học liệu' : 'Học liệu tương tác'}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
