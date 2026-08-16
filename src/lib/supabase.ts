import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { INITIAL_GAMES, INITIAL_SUBJECTS, INITIAL_BADGES } from './seedData';
import { Game, Subject, Badge, LeaderboardEntry, PlayHistory, ClassRoom, UserProfile } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('your-project-id')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ============================================================================
// DATA STORAGE REPOSITORY (HỖ TRỢ OFFLINE LOCAL DB & SUPABASE REALTIME DB)
// ============================================================================

const STORAGE_KEYS = {
  GAMES: 'edugame_games_db',
  SUBJECTS: 'edugame_subjects_db',
  BADGES: 'edugame_badges_db',
  PLAY_HISTORY: 'edugame_play_history_db',
  CLASSES: 'edugame_classes_db',
  PROFILES: 'edugame_profiles_db',
  CURRENT_USER: 'edugame_current_user',
};

// Khởi tạo Local DB ban đầu nếu chưa có
export const initLocalDatabase = () => {
  if (!localStorage.getItem(STORAGE_KEYS.SUBJECTS)) {
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(INITIAL_SUBJECTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.GAMES)) {
    localStorage.setItem(STORAGE_KEYS.GAMES, JSON.stringify(INITIAL_GAMES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.BADGES)) {
    localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(INITIAL_BADGES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CLASSES)) {
    const defaultClasses: ClassRoom[] = [
      {
        id: 'cls_6a1',
        name: 'Lớp 6A1 - THCS Trưng Vương',
        gradeLevel: 6,
        schoolLevel: 'secondary',
        teacherId: 'teacher_demo_1',
        teacherName: 'Cô Nguyễn Thu Hà',
        joinCode: '6A1202',
        description: 'Lớp chuyên cần sáng tạo môn Tin học & Công nghệ.',
        studentCount: 38,
      },
      {
        id: 'cls_8b2',
        name: 'Lớp 8B2 - THCS Chu Văn An',
        gradeLevel: 8,
        schoolLevel: 'secondary',
        teacherId: 'teacher_demo_1',
        teacherName: 'Thầy Trần Quốc Toản',
        joinCode: '8B2024',
        description: 'Đội tuyển thi đua Đuổi hình bắt chữ Công nghệ 8.',
        studentCount: 42,
      },
      {
        id: 'cls_9c3',
        name: 'Lớp 9C3 - Khóa Hướng Nghiệp',
        gradeLevel: 9,
        schoolLevel: 'secondary',
        teacherId: 'teacher_demo_2',
        teacherName: 'Cô Lê Thị Mai',
        joinCode: '9C3999',
        description: 'Sinh hoạt HĐTN hướng nghiệp chuẩn bị thi vào lớp 10.',
        studentCount: 36,
      },
    ];
    localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(defaultClasses));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PROFILES)) {
    const defaultProfiles: UserProfile[] = [
      {
        id: 'std_01',
        username: 'nguyenvana',
        fullName: 'Nguyễn Văn An',
        role: 'student',
        schoolLevel: 'secondary',
        gradeLevel: 6,
        xpPoints: 1250,
        level: 5,
        streakDays: 4,
        avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=An',
        joinedClassId: 'cls_6a1',
        joinedClassName: 'Lớp 6A1 - THCS Trưng Vương',
      },
      {
        id: 'std_02',
        username: 'lethibich',
        fullName: 'Lê Thị Bích',
        role: 'student',
        schoolLevel: 'secondary',
        gradeLevel: 8,
        xpPoints: 1680,
        level: 7,
        streakDays: 6,
        avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Bich',
        joinedClassId: 'cls_8b2',
        joinedClassName: 'Lớp 8B2 - THCS Chu Văn An',
      },
      {
        id: 'std_03',
        username: 'tranminhquan',
        fullName: 'Trần Minh Quân',
        role: 'student',
        schoolLevel: 'secondary',
        gradeLevel: 9,
        xpPoints: 920,
        level: 4,
        streakDays: 2,
        avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Quan',
        joinedClassId: 'cls_9c3',
        joinedClassName: 'Lớp 9C3 - Khóa Hướng Nghiệp',
      },
      {
        id: 'std_04',
        username: 'hoangviet',
        fullName: 'Hoàng Quốc Việt',
        role: 'student',
        schoolLevel: 'secondary',
        gradeLevel: 7,
        xpPoints: 750,
        level: 3,
        streakDays: 1,
        avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Viet',
      },
      {
        id: 'teacher_demo_1',
        username: 'giaovien.tin',
        fullName: 'Thầy Bộ (Giáo viên Tin & Công nghệ)',
        role: 'teacher',
        schoolLevel: 'secondary',
        gradeLevel: 6,
        xpPoints: 3500,
        level: 15,
        streakDays: 10,
        avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=ThayBo',
      }
    ];
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(defaultProfiles));
  }
};

// Khởi chạy khởi tạo local database
initLocalDatabase();

// --- DATA ACCESS METHODS ---

export const getSubjects = async (): Promise<Subject[]> => {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('subjects').select('*');
    if (!error && data && data.length > 0) return data as Subject[];
  }
  const raw = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
  return raw ? JSON.parse(raw) : INITIAL_SUBJECTS;
};

export const getGames = async (): Promise<Game[]> => {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('games').select(`
      *,
      questions:game_questions(*)
    `).eq('is_published', true);
    if (!error && data && data.length > 0) {
      return data.map((g: any) => ({
        id: g.id,
        title: g.title,
        description: g.description,
        subjectId: g.subject_id,
        gameType: g.game_type,
        schoolLevel: g.school_level,
        gradeLevel: g.grade_level,
        thumbnailUrl: g.thumbnail_url,
        totalQuestions: g.questions?.length || g.total_questions || 0,
        playsCount: g.plays_count || 0,
        isPublished: g.is_published,
        questions: g.questions?.map((q: any) => ({
          id: q.id,
          gameId: q.game_id,
          imageUrl: q.image_url,
          imageSvg: q.image_svg,
          answerText: q.answer_text,
          hintText: q.hint_text,
          explanation: q.explanation,
          timeLimitSeconds: q.time_limit_seconds,
          points: q.points,
          orderIndex: q.order_index,
        })) || [],
      })) as Game[];
    }
  }
  const raw = localStorage.getItem(STORAGE_KEYS.GAMES);
  return raw ? JSON.parse(raw) : INITIAL_GAMES;
};

export const saveNewGame = async (newGame: Game): Promise<boolean> => {
  if (isSupabaseConfigured && supabase) {
    const { data: gameData, error: gameError } = await supabase.from('games').insert({
      title: newGame.title,
      description: newGame.description,
      subject_id: newGame.subjectId,
      game_type: newGame.gameType,
      school_level: newGame.schoolLevel,
      grade_level: newGame.gradeLevel,
      thumbnail_url: newGame.thumbnailUrl,
      author_id: newGame.authorId,
      is_published: true,
      total_questions: newGame.questions?.length || 0,
    }).select().single();

    if (!gameError && gameData && newGame.questions) {
      const questionsToInsert = newGame.questions.map((q, idx) => ({
        game_id: gameData.id,
        image_url: q.imageUrl,
        image_svg: q.imageSvg,
        answer_text: q.answerText,
        hintText: q.hintText,
        explanation: q.explanation,
        time_limit_seconds: q.timeLimitSeconds,
        points: q.points,
        order_index: idx + 1,
      }));
      await supabase.from('game_questions').insert(questionsToInsert);
      return true;
    }
  }

  // Lưu vào Local Storage
  const raw = localStorage.getItem(STORAGE_KEYS.GAMES);
  const currentGames: Game[] = raw ? JSON.parse(raw) : INITIAL_GAMES;
  const updatedGames = [newGame, ...currentGames];
  localStorage.setItem(STORAGE_KEYS.GAMES, JSON.stringify(updatedGames));
  return true;
};

export const getLeaderboard = async (classId?: string): Promise<LeaderboardEntry[]> => {
  if (isSupabaseConfigured && supabase) {
    if (classId) {
      const { data } = await supabase.from('class_leaderboard_view').select('*').eq('class_id', classId);
      if (data && data.length > 0) {
        return data.map((d: any, idx: number) => ({
          studentId: d.student_id,
          username: d.username,
          fullName: d.full_name,
          avatarUrl: d.avatar_url,
          schoolLevel: 'secondary',
          gradeLevel: 6,
          xpPoints: d.xp_points,
          level: d.level,
          totalScore: d.class_total_score || 0,
          totalGamesPlayed: d.games_played_in_class || 0,
          rank: idx + 1,
        }));
      }
    } else {
      const { data } = await supabase.from('global_leaderboard_view').select('*');
      if (data && data.length > 0) {
        return data.map((d: any) => ({
          studentId: d.student_id,
          username: d.username,
          fullName: d.full_name,
          avatarUrl: d.avatar_url,
          schoolLevel: d.school_level,
          gradeLevel: d.grade_level,
          xpPoints: d.xp_points,
          level: d.level,
          totalScore: d.total_score || 0,
          totalGamesPlayed: d.total_games_played || 0,
          rank: Number(d.rank),
        }));
      }
    }
  }

  // Fallback Local Storage Leaderboard
  const rawProfiles = localStorage.getItem(STORAGE_KEYS.PROFILES);
  const profiles: UserProfile[] = rawProfiles ? JSON.parse(rawProfiles) : [];
  
  let students = profiles.filter((p) => p.role === 'student');
  if (classId) {
    students = students.filter((s) => s.joinedClassId === classId);
  }

  // Sắp xếp theo XP giảm dần
  students.sort((a, b) => b.xpPoints - a.xpPoints);

  return students.map((s, idx) => ({
    studentId: s.id,
    username: s.username,
    fullName: s.fullName,
    avatarUrl: s.avatarUrl,
    schoolLevel: s.schoolLevel,
    gradeLevel: s.gradeLevel,
    xpPoints: s.xpPoints,
    level: s.level,
    totalScore: Math.round(s.xpPoints * 1.8),
    totalGamesPlayed: Math.max(1, Math.floor(s.xpPoints / 180)),
    rank: idx + 1,
  }));
};

export const recordPlayHistory = async (history: PlayHistory): Promise<{ xpEarned: number; newLevel: number }> => {
  const earnedXp = Math.round(history.score * 0.5) + 20;

  if (isSupabaseConfigured && supabase) {
    await supabase.from('play_history').insert({
      student_id: history.studentId,
      game_id: history.gameId,
      class_id: history.classId || null,
      score: history.score,
      correct_count: history.correctCount,
      total_questions: history.totalQuestions,
      accuracy_rate: history.accuracyRate,
      time_spent_seconds: history.timeSpentSeconds,
      max_combo: history.maxCombo,
    });
  }

  // Cập nhật Local Storage
  const rawProfiles = localStorage.getItem(STORAGE_KEYS.PROFILES);
  const profiles: UserProfile[] = rawProfiles ? JSON.parse(rawProfiles) : [];
  const studentIndex = profiles.findIndex((p) => p.id === history.studentId);

  let newLevel = 1;
  if (studentIndex >= 0) {
    profiles[studentIndex].xpPoints += earnedXp;
    newLevel = 1 + Math.floor(profiles[studentIndex].xpPoints / 250);
    profiles[studentIndex].level = newLevel;
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));

    // Cập nhật Current User nếu là người đang chơi
    const rawCurrentUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (rawCurrentUser) {
      const current = JSON.parse(rawCurrentUser);
      if (current.id === history.studentId) {
        current.xpPoints += earnedXp;
        current.level = newLevel;
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(current));
      }
    }
  }

  // Tăng biến đếm plays_count của Game trong Local Storage
  const rawGames = localStorage.getItem(STORAGE_KEYS.GAMES);
  if (rawGames) {
    const games: Game[] = JSON.parse(rawGames);
    const game = games.find((g) => g.id === history.gameId);
    if (game) {
      game.playsCount += 1;
      localStorage.setItem(STORAGE_KEYS.GAMES, JSON.stringify(games));
    }
  }

  return { xpEarned: earnedXp, newLevel };
};

export const getClasses = async (): Promise<ClassRoom[]> => {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('classes').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map((d: any) => ({
          id: d.id,
          name: d.name,
          gradeLevel: d.grade_level || 6,
          schoolLevel: d.school_level || 'secondary',
          teacherId: d.teacher_id,
          teacherName: 'Thầy Bộ (Giáo viên Tin & Công nghệ)',
          joinCode: d.join_code || '',
          description: d.description || '',
          studentCount: 0,
          createdAt: d.created_at,
        }));
      }
    } catch (err) {
      console.warn('Lỗi đọc lớp từ Supabase:', err);
    }
  }
  const raw = localStorage.getItem(STORAGE_KEYS.CLASSES);
  return raw ? JSON.parse(raw) : [
    {
      id: 'c1a10000-0001-4000-8000-000000000001',
      name: 'Lớp 6A1 - THCS Trưng Vương',
      gradeLevel: 6,
      schoolLevel: 'secondary',
      teacherId: 'd9b1c1e0-0001-4000-8000-000000000001',
      teacherName: 'Thầy Bộ (Giáo viên Tin & Công nghệ)',
      joinCode: '6A1202',
      description: 'Lớp chuyên cần sáng tạo môn Tin học & Công nghệ.',
      studentCount: 28,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'c1a10000-0002-4000-8000-000000000002',
      name: 'Lớp 8B2 - THCS Chu Văn An',
      gradeLevel: 8,
      schoolLevel: 'secondary',
      teacherId: 'd9b1c1e0-0001-4000-8000-000000000001',
      teacherName: 'Thầy Bộ (Giáo viên Tin & Công nghệ)',
      joinCode: '8B2024',
      description: 'Đội tuyển thi đua Đuổi hình bắt chữ Công nghệ 8.',
      studentCount: 32,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'c1a10000-0003-4000-8000-000000000003',
      name: 'Lớp 9C3 - Khóa Hướng Nghiệp',
      gradeLevel: 9,
      schoolLevel: 'secondary',
      teacherId: 'd9b1c1e0-0001-4000-8000-000000000001',
      teacherName: 'Thầy Bộ (Giáo viên Tin & Công nghệ)',
      joinCode: '9C3999',
      description: 'Sinh hoạt HĐTN hướng nghiệp chuẩn bị thi vào lớp 10.',
      studentCount: 35,
      createdAt: new Date().toISOString(),
    }
  ];
};

export const joinClassByCode = async (code: string, studentId: string): Promise<{ success: boolean; classRoom?: ClassRoom; message: string }> => {
  const classes = await getClasses();
  const targetClass = classes.find((c) => (c.joinCode || '').toUpperCase() === code.trim().toUpperCase());
  if (!targetClass) {
    return { success: false, message: 'Mã lớp không tồn tại. Vui lòng kiểm tra lại 6 ký tự mã lớp!' };
  }

  // Cập nhật thông tin học sinh
  const rawProfiles = localStorage.getItem(STORAGE_KEYS.PROFILES);
  const profiles: UserProfile[] = rawProfiles ? JSON.parse(rawProfiles) : [];
  const sIdx = profiles.findIndex((p) => p.id === studentId);
  if (sIdx >= 0) {
    profiles[sIdx].joinedClassId = targetClass.id;
    profiles[sIdx].joinedClassName = targetClass.name;
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
  }

  const rawCurrent = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  if (rawCurrent) {
    const current = JSON.parse(rawCurrent);
    current.joinedClassId = targetClass.id;
    current.joinedClassName = targetClass.name;
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(current));
  }

  return { success: true, classRoom: targetClass, message: `Tham gia thành công ${targetClass.name}!` };
};

export const createNewClass = async (newClass: ClassRoom): Promise<boolean> => {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('classes').insert({
        name: newClass.name,
        grade_level: newClass.gradeLevel,
        school_level: newClass.schoolLevel,
        teacher_id: 'd9b1c1e0-0001-4000-8000-000000000001',
        join_code: newClass.joinCode,
        description: newClass.description || null,
      }).select().single();

      if (!error && data) {
        newClass.id = data.id;
      } else {
        console.warn('Lỗi Supabase khi tạo lớp:', error);
      }
    } catch (err) {
      console.warn('Lỗi kết nối Supabase tạo lớp:', err);
    }
  }

  // Cập nhật LocalStorage
  const raw = localStorage.getItem(STORAGE_KEYS.CLASSES);
  const currentClasses: ClassRoom[] = raw ? JSON.parse(raw) : [];
  const updated = [newClass, ...currentClasses.filter((c) => c.joinCode !== newClass.joinCode)];
  localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(updated));
  return true;
};

export const deleteClass = async (classId: string): Promise<boolean> => {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('classes').delete().eq('id', classId);
    } catch (err) {
      console.warn('Lỗi xóa lớp trên Supabase:', err);
    }
  }
  const raw = localStorage.getItem(STORAGE_KEYS.CLASSES);
  if (raw) {
    const current: ClassRoom[] = JSON.parse(raw);
    const filtered = current.filter((c) => c.id !== classId);
    localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(filtered));
  }
  return true;
};
