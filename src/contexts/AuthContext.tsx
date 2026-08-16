import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole, SchoolLevel } from '../types';

interface AuthContextType {
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
  loginAsStudent: (name: string, gradeLevel: number, schoolLevel: SchoolLevel, joinCode?: string) => Promise<boolean>;
  loginAsTeacher: (email: string) => Promise<boolean>;
  loginAsDemoTeacher: () => void;
  loginAsDemoStudent: () => void;
  logout: () => void;
  updateUserXp: (additionalXp: number) => { newXp: number; newLevel: number; leveledUp: boolean };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUserState] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('edugame_current_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && (parsed.fullName?.includes('Nguyễn Văn Toàn') || parsed.username === 'giaovien.gdpt2018')) {
          parsed.fullName = 'Thầy Bộ (Giáo viên Tin & Công nghệ)';
          parsed.username = 'giaovien.tin';
          parsed.avatarUrl = 'https://api.dicebear.com/7.x/bottts/svg?seed=ThayBo';
          localStorage.setItem('edugame_current_user', JSON.stringify(parsed));
        }
        return parsed;
      } catch {
        return null;
      }
    }
    // Mặc định khởi tạo tài khoản học sinh trải nghiệm
    return {
      id: 'std_demo_01',
      username: 'hocsinh_vietnam',
      fullName: 'Nguyễn Minh Quân',
      role: 'student',
      schoolLevel: 'secondary',
      gradeLevel: 6,
      xpPoints: 340,
      level: 2,
      streakDays: 3,
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=MinhQuan',
      joinedClassId: 'cls_6a1',
      joinedClassName: 'Lớp 6A1 - THCS Trưng Vương',
    };
  });

  const setCurrentUser = (user: UserProfile | null) => {
    setCurrentUserState(user);
    if (user) {
      localStorage.setItem('edugame_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('edugame_current_user');
    }
  };

  const loginAsStudent = async (name: string, gradeLevel: number, schoolLevel: SchoolLevel, joinCode?: string): Promise<boolean> => {
    const newStudent: UserProfile = {
      id: 'std_' + Date.now().toString(36),
      username: name.toLowerCase().replace(/\s+/g, '_'),
      fullName: name,
      role: 'student',
      schoolLevel,
      gradeLevel,
      xpPoints: 100,
      level: 1,
      streakDays: 1,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
      joinedClassName: joinCode ? `Phòng thi ${joinCode}` : undefined,
    };
    setCurrentUser(newStudent);
    return true;
  };

  const loginAsTeacher = async (email: string): Promise<boolean> => {
    const teacherName = email.split('@')[0];
    const teacherProfile: UserProfile = {
      id: 'tch_' + Date.now().toString(36),
      username: email,
      fullName: `Thầy/Cô ${teacherName}`,
      role: 'teacher',
      schoolLevel: 'secondary',
      gradeLevel: 8,
      xpPoints: 3500,
      level: 15,
      streakDays: 12,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
    };
    setCurrentUser(teacherProfile);
    return true;
  };

  const loginAsDemoTeacher = () => {
    const teacherProfile: UserProfile = {
      id: 'teacher_demo_1',
      username: 'giaovien.tin',
      fullName: 'Thầy Bộ (Giáo viên Tin & Công nghệ)',
      role: 'teacher',
      schoolLevel: 'secondary',
      gradeLevel: 6,
      xpPoints: 4200,
      level: 18,
      streakDays: 14,
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=ThayBo',
    };
    setCurrentUser(teacherProfile);
  };

  const loginAsDemoStudent = () => {
    const studentProfile: UserProfile = {
      id: 'std_demo_01',
      username: 'hocsinh_vietnam',
      fullName: 'Nguyễn Minh Quân',
      role: 'student',
      schoolLevel: 'secondary',
      gradeLevel: 6,
      xpPoints: 340,
      level: 2,
      streakDays: 3,
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=MinhQuan',
      joinedClassId: 'cls_6a1',
      joinedClassName: 'Lớp 6A1 - THCS Trưng Vương',
    };
    setCurrentUser(studentProfile);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateUserXp = (additionalXp: number) => {
    if (!currentUser) return { newXp: 0, newLevel: 1, leveledUp: false };

    const newXp = currentUser.xpPoints + additionalXp;
    const oldLevel = currentUser.level;
    const newLevel = 1 + Math.floor(newXp / 250);
    const leveledUp = newLevel > oldLevel;

    const updated = {
      ...currentUser,
      xpPoints: newXp,
      level: newLevel,
    };
    setCurrentUser(updated);

    return { newXp, newLevel, leveledUp };
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        loginAsStudent,
        loginAsTeacher,
        loginAsDemoTeacher,
        loginAsDemoStudent,
        logout,
        updateUserXp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
