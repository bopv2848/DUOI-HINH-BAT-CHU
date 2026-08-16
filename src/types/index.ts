export type SchoolLevel = 'primary' | 'secondary' | 'high';
export type UserRole = 'admin' | 'teacher' | 'student';
export type GameType = 'catch_word' | 'quick_quiz' | 'word_match';

export interface UserProfile {
  id: string;
  authId?: string;
  username: string;
  fullName: string;
  role: UserRole;
  schoolLevel: SchoolLevel;
  gradeLevel: number;
  xpPoints: number;
  level: number;
  streakDays: number;
  avatarUrl: string;
  joinedClassId?: string;
  joinedClassName?: string;
  createdAt?: string;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  gradeLevel: number;
  schoolLevel: SchoolLevel;
  icon: string;
  colorTheme: string;
  description: string;
}

export interface GameQuestion {
  id: string;
  gameId: string;
  imageUrl?: string;
  imageSvg?: string; // Hỗ trợ vẽ vector / hình minh họa trực tiếp chất lượng cao
  answerText: string; // Đáp án (Ví dụ: "TRA CỨU DỮ LIỆU", "BẢN VẼ KỸ THUẬT", "TƯ DUY PHẢN BIỆN")
  hintText: string; // Gợi ý câu đố
  explanation?: string; // Lời giải thích kiến thức sau khi trả lời đúng
  timeLimitSeconds: number; // Mặc định 45s
  points: number; // Mặc định 100đ
  orderIndex: number;
}

export interface Game {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  subjectName?: string;
  subjectCode?: string;
  gameType: GameType;
  schoolLevel: SchoolLevel;
  gradeLevel: number;
  thumbnailUrl: string;
  totalQuestions: number;
  playsCount: number;
  authorId?: string;
  authorName?: string;
  isPublished: boolean;
  createdAt?: string;
  questions?: GameQuestion[];
}

export interface PlayHistory {
  id: string;
  studentId: string;
  studentName?: string;
  gameId: string;
  gameTitle?: string;
  classId?: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
  accuracyRate: number;
  timeSpentSeconds: number;
  maxCombo: number;
  completedAt: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'achievement' | 'skill' | 'milestone' | 'loyalty';
  requiredXp: number;
  requiredStreak: number;
  unlocked?: boolean;
  unlockedAt?: string;
}

export interface LeaderboardEntry {
  studentId: string;
  username: string;
  fullName: string;
  avatarUrl: string;
  schoolLevel: SchoolLevel;
  gradeLevel: number;
  xpPoints: number;
  level: number;
  totalScore: number;
  totalGamesPlayed: number;
  rank: number;
}

export interface ClassRoom {
  id: string;
  name: string;
  gradeLevel: number;
  schoolLevel: SchoolLevel;
  teacherId: string;
  teacherName?: string;
  joinCode: string; // 6 ký tự
  description?: string;
  studentCount?: number;
  createdAt?: string;
}

export interface TeacherAnalytics {
  gameId: string;
  gameTitle: string;
  subjectName: string;
  gradeLevel: number;
  totalPlays: number;
  avgScore: number;
  avgAccuracy: number;
  avgTimeSpent: number;
}
