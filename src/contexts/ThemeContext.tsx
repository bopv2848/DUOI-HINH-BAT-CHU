import React, { createContext, useContext, useState, useEffect } from 'react';
import { SchoolLevel } from '../types';

interface ThemeContextType {
  schoolLevel: SchoolLevel;
  setSchoolLevel: (level: SchoolLevel) => void;
  getThemeClasses: () => {
    bgClass: string;
    cardClass: string;
    accentClass: string;
    btnClass: string;
    textAccentClass: string;
    fontClass: string;
    badgeStyle: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [schoolLevel, setSchoolLevelState] = useState<SchoolLevel>(() => {
    const saved = localStorage.getItem('edugame_school_level');
    return (saved as SchoolLevel) || 'secondary';
  });

  const setSchoolLevel = (level: SchoolLevel) => {
    setSchoolLevelState(level);
    localStorage.setItem('edugame_school_level', level);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-school-level', schoolLevel);
  }, [schoolLevel]);

  const getThemeClasses = () => {
    switch (schoolLevel) {
      case 'primary':
        return {
          bgClass: 'bg-amber-50/70 text-slate-800',
          cardClass: 'bg-white border-4 border-amber-200 shadow-xl rounded-3xl',
          accentClass: 'bg-amber-400 text-amber-950 font-bold',
          btnClass: 'bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-slate-900 font-extrabold shadow-lg rounded-2xl border-b-4 border-amber-600 active:translate-y-1',
          textAccentClass: 'text-orange-500',
          fontClass: 'font-fun',
          badgeStyle: 'bg-orange-100 text-orange-700 border-2 border-orange-300',
        };
      case 'high':
        return {
          bgClass: 'bg-slate-950 text-slate-100',
          cardClass: 'bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-2xl rounded-xl',
          accentClass: 'bg-indigo-600 text-white font-medium',
          btnClass: 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold shadow-md rounded-lg active:scale-95 transition-all',
          textAccentClass: 'text-indigo-400',
          fontClass: 'font-primary',
          badgeStyle: 'bg-indigo-950/80 text-indigo-300 border border-indigo-700/50',
        };
      case 'secondary':
      default:
        return {
          bgClass: 'bg-slate-900 text-slate-100',
          cardClass: 'bg-slate-800/80 border border-slate-700/80 backdrop-blur-md shadow-xl rounded-2xl',
          accentClass: 'bg-cyan-500 text-slate-950 font-bold',
          btnClass: 'bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold shadow-lg shadow-cyan-500/20 rounded-xl active:scale-98 transition-all',
          textAccentClass: 'text-cyan-400',
          fontClass: 'font-cyber',
          badgeStyle: 'bg-cyan-950/70 text-cyan-300 border border-cyan-700/50',
        };
    }
  };

  return (
    <ThemeContext.Provider value={{ schoolLevel, setSchoolLevel, getThemeClasses }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
