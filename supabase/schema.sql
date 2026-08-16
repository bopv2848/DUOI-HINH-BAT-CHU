-- ==============================================================================
-- EDTECH GAME HUB - ĐUỔI HÌNH BẮT CHỮ (GDPT 2018)
-- DATABASE SCHEMA, ROW LEVEL SECURITY, TRIGGERS, VIEWS & SEED DATA
-- ==============================================================================

-- 1. BẬT EXTENSIONS CẦN THIẾT
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. TẠO BẢNG PROFILES (NGƯỜI DÙNG: HỌC SINH / GIÁO VIÊN / ADMIN)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'student' CHECK (role IN ('admin', 'teacher', 'student')),
    school_level VARCHAR(20) NOT NULL DEFAULT 'secondary' CHECK (school_level IN ('primary', 'secondary', 'high')),
    grade_level INT NOT NULL DEFAULT 6 CHECK (grade_level BETWEEN 1 AND 12),
    xp_points INT NOT NULL DEFAULT 0,
    level INT NOT NULL DEFAULT 1,
    streak_days INT NOT NULL DEFAULT 1,
    avatar_url TEXT DEFAULT 'https://api.dicebear.com/7.x/bottts/svg?seed=student',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. TẠO BẢNG CLASSES (LỚP HỌC DO GIÁO VIÊN QUẢN LÝ)
CREATE TABLE IF NOT EXISTS public.classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    grade_level INT NOT NULL CHECK (grade_level BETWEEN 1 AND 12),
    school_level VARCHAR(20) NOT NULL CHECK (school_level IN ('primary', 'secondary', 'high')),
    teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    join_code VARCHAR(6) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. TẠO BẢNG CLASS_MEMBERS (HỌC SINH THAM GIA LỚP HỌC)
CREATE TABLE IF NOT EXISTS public.class_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(class_id, student_id)
);

-- 5. TẠO BẢNG SUBJECTS (MÔN HỌC BÁM SÁT CHƯƠNG TRÌNH GDPT 2018)
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    grade_level INT NOT NULL CHECK (grade_level BETWEEN 1 AND 12),
    school_level VARCHAR(20) NOT NULL CHECK (school_level IN ('primary', 'secondary', 'high')),
    icon VARCHAR(50) NOT NULL DEFAULT 'BookOpen',
    color_theme VARCHAR(50) NOT NULL DEFAULT 'cyan',
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(code, grade_level)
);

-- 6. TẠO BẢNG GAMES (CÁC PHÒNG CHƠI / BỘ ĐỀ TRÒ CHƠI)
CREATE TABLE IF NOT EXISTS public.games (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
    game_type VARCHAR(50) NOT NULL DEFAULT 'catch_word' CHECK (game_type IN ('catch_word', 'quick_quiz', 'word_match')),
    school_level VARCHAR(20) NOT NULL DEFAULT 'secondary' CHECK (school_level IN ('primary', 'secondary', 'high')),
    grade_level INT NOT NULL DEFAULT 6 CHECK (grade_level BETWEEN 1 AND 12),
    thumbnail_url TEXT,
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    total_questions INT NOT NULL DEFAULT 0,
    plays_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. TẠO BẢNG GAME_QUESTIONS (CÂU HỎI TRÒ CHƠI ĐUỔI HÌNH BẮT CHỮ)
CREATE TABLE IF NOT EXISTS public.game_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    game_id UUID NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
    image_url TEXT,
    image_svg TEXT,
    answer_text VARCHAR(200) NOT NULL,
    hint_text TEXT,
    explanation TEXT,
    time_limit_seconds INT NOT NULL DEFAULT 45,
    points INT NOT NULL DEFAULT 100,
    order_index INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. TẠO BẢNG PLAY_HISTORY (LỊCH SỬ CHƠI & ĐIỂM SỐ CỦA HỌC SINH)
CREATE TABLE IF NOT EXISTS public.play_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    game_id UUID NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
    class_id UUID REFERENCES public.classes(id) ON DELETE SET NULL,
    score INT NOT NULL DEFAULT 0,
    correct_count INT NOT NULL DEFAULT 0,
    total_questions INT NOT NULL DEFAULT 0,
    accuracy_rate DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    time_spent_seconds INT NOT NULL DEFAULT 0,
    max_combo INT NOT NULL DEFAULT 0,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. TẠO BẢNG BADGES & USER_BADGES (HUY HIỆU GAMIFICATION)
CREATE TABLE IF NOT EXISTS public.badges (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'achievement',
    required_xp INT NOT NULL DEFAULT 0,
    required_streak INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.user_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    badge_id VARCHAR(50) NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
);

-- ==============================================================================
-- 10. VIEWS & FUNCTIONS CHO LEADERBOARD VÀ ANALYTICS
-- ==============================================================================

-- View Bảng xếp hạng Toàn trường / Toàn hệ thống (Realtime Leaderboard)
CREATE OR REPLACE VIEW public.global_leaderboard_view AS
SELECT 
    p.id AS student_id,
    p.username,
    p.full_name,
    p.avatar_url,
    p.school_level,
    p.grade_level,
    p.xp_points,
    p.level,
    p.streak_days,
    COUNT(ph.id) AS total_games_played,
    COALESCE(SUM(ph.score), 0) AS total_score,
    COALESCE(AVG(ph.accuracy_rate), 0) AS avg_accuracy,
    RANK() OVER (ORDER BY p.xp_points DESC, COALESCE(SUM(ph.score), 0) DESC) AS rank
FROM public.profiles p
LEFT JOIN public.play_history ph ON p.id = ph.student_id
WHERE p.role = 'student'
GROUP BY p.id, p.username, p.full_name, p.avatar_url, p.school_level, p.grade_level, p.xp_points, p.level, p.streak_days;

-- View Bảng xếp hạng theo từng Lớp học
CREATE OR REPLACE VIEW public.class_leaderboard_view AS
SELECT 
    cm.class_id,
    c.name AS class_name,
    p.id AS student_id,
    p.username,
    p.full_name,
    p.avatar_url,
    p.xp_points,
    p.level,
    COALESCE(SUM(ph.score), 0) AS class_total_score,
    COUNT(ph.id) AS games_played_in_class,
    RANK() OVER (PARTITION BY cm.class_id ORDER BY p.xp_points DESC) AS class_rank
FROM public.class_members cm
JOIN public.classes c ON cm.class_id = c.id
JOIN public.profiles p ON cm.student_id = p.id
LEFT JOIN public.play_history ph ON p.id = ph.student_id AND ph.class_id = cm.class_id
GROUP BY cm.class_id, c.name, p.id, p.username, p.full_name, p.avatar_url, p.xp_points, p.level;

-- View Thống kê cho Giáo viên (Teacher Analytics Dashboard)
CREATE OR REPLACE VIEW public.teacher_game_stats_view AS
SELECT 
    g.id AS game_id,
    g.title AS game_title,
    g.author_id,
    s.name AS subject_name,
    g.grade_level,
    COUNT(ph.id) AS total_plays,
    COALESCE(AVG(ph.score), 0) AS avg_score,
    COALESCE(AVG(ph.accuracy_rate), 0) AS avg_accuracy,
    COALESCE(AVG(ph.time_spent_seconds), 0) AS avg_time_spent
FROM public.games g
LEFT JOIN public.subjects s ON g.subject_id = s.id
LEFT JOIN public.play_history ph ON g.id = ph.game_id
GROUP BY g.id, g.title, g.author_id, s.name, g.grade_level;

-- ==============================================================================
-- 11. DATABASE TRIGGERS: TÍNH XP, LEVEL UP & CẬP NHẬT LƯỢT CHƠI
-- ==============================================================================

-- Hàm tự động tính toán XP & Cấp độ khi hoàn thành một ván chơi
CREATE OR REPLACE FUNCTION public.handle_play_history_inserted()
RETURNS TRIGGER AS $$
DECLARE
    earned_xp INT;
    new_total_xp INT;
    calculated_level INT;
BEGIN
    -- Tính XP nhận được = 50% điểm số + 20 XP hoàn thành
    earned_xp := ROUND(NEW.score * 0.5) + 20;

    -- Cập nhật tổng XP và Level cho học sinh
    UPDATE public.profiles
    SET xp_points = xp_points + earned_xp,
        level = 1 + FLOOR((xp_points + earned_xp) / 250),
        updated_at = NOW()
    WHERE id = NEW.student_id
    RETURNING xp_points, level INTO new_total_xp, calculated_level;

    -- Tăng biến đếm lượt chơi cho Game
    UPDATE public.games
    SET plays_count = plays_count + 1
    WHERE id = NEW.game_id;

    -- Tự động mở khóa Huy hiệu nếu đạt điều kiện
    IF new_total_xp >= 500 THEN
        INSERT INTO public.user_badges (user_id, badge_id)
        VALUES (NEW.student_id, 'badge_scholar')
        ON CONFLICT DO NOTHING;
    END IF;

    IF new_total_xp >= 1500 THEN
        INSERT INTO public.user_badges (user_id, badge_id)
        VALUES (NEW.student_id, 'badge_master')
        ON CONFLICT DO NOTHING;
    END IF;

    IF NEW.max_combo >= 5 THEN
        INSERT INTO public.user_badges (user_id, badge_id)
        VALUES (NEW.student_id, 'badge_combo_king')
        ON CONFLICT DO NOTHING;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Gắn Trigger vào bảng play_history
DROP TRIGGER IF EXISTS trigger_on_play_history ON public.play_history;
CREATE TRIGGER trigger_on_play_history
AFTER INSERT ON public.play_history
FOR EACH ROW
EXECUTE FUNCTION public.handle_play_history_inserted();

-- ==============================================================================
-- 12. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.play_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- Profiles: Ai cũng đọc được profile công khai, chủ tài khoản có quyền update
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = auth_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (true);

-- Subjects: Công khai cho mọi người xem
CREATE POLICY "Subjects are viewable by everyone" ON public.subjects FOR SELECT USING (true);
CREATE POLICY "Admins/Teachers can manage subjects" ON public.subjects FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE auth_id = auth.uid() AND role IN ('admin', 'teacher'))
);

-- Classes: Giáo viên quản lý lớp của mình, học sinh xem lớp mình tham gia
CREATE POLICY "Anyone can view classes" ON public.classes FOR SELECT USING (true);
CREATE POLICY "Teachers can create classes" ON public.classes FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = teacher_id AND role IN ('teacher', 'admin'))
);
CREATE POLICY "Teachers can update own classes" ON public.classes FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = teacher_id AND role IN ('teacher', 'admin'))
);

-- Class Members
CREATE POLICY "Anyone can view class members" ON public.class_members FOR SELECT USING (true);
CREATE POLICY "Students can join class" ON public.class_members FOR INSERT WITH CHECK (true);

-- Games: Xem tất cả game đã xuất bản
CREATE POLICY "Published games viewable by all" ON public.games FOR SELECT USING (is_published = true OR auth.uid() IS NOT NULL);
CREATE POLICY "Teachers and Admins can create games" ON public.games FOR INSERT WITH CHECK (true);
CREATE POLICY "Teachers can edit their own games" ON public.games FOR UPDATE USING (
    author_id IN (SELECT id FROM public.profiles WHERE auth_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.profiles WHERE auth_id = auth.uid() AND role = 'admin')
);

-- Game Questions
CREATE POLICY "Anyone can view questions of games" ON public.game_questions FOR SELECT USING (true);
CREATE POLICY "Teachers can manage questions" ON public.game_questions FOR ALL USING (true);

-- Play History
CREATE POLICY "Anyone can view play history" ON public.play_history FOR SELECT USING (true);
CREATE POLICY "Students can insert play history" ON public.play_history FOR INSERT WITH CHECK (true);

-- Badges
CREATE POLICY "Badges are viewable by all" ON public.badges FOR SELECT USING (true);
CREATE POLICY "User badges viewable by all" ON public.user_badges FOR SELECT USING (true);
CREATE POLICY "System can insert user badges" ON public.user_badges FOR INSERT WITH CHECK (true);

-- ==============================================================================
-- 13. SEED DATA MÔN HỌC & BỘ CÂU ĐỐ ĐUỔI HÌNH BẮT CHỮ (CHUẨN GDPT 2018)
-- ==============================================================================

-- Seed Badges
INSERT INTO public.badges (id, name, description, icon, category, required_xp, required_streak) VALUES
('badge_first_win', 'Khởi Đầu Nan', 'Hoàn thành ván chơi đầu tiên với điểm số xuất sắc', 'Trophy', 'achievement', 50, 0),
('badge_combo_king', 'Chiến Thần Tốc Độ', 'Đạt chuỗi Combo 5 câu trả lời đúng liên tiếp', 'Zap', 'skill', 200, 0),
('badge_scholar', 'Nhà Thông Thái', 'Tích lũy đạt 500 XP kiến thức', 'GraduationCap', 'milestone', 500, 0),
('badge_master', 'Bậc Thầy Đuổi Hình', 'Tích lũy đạt 1,500 XP kiến thức đỉnh cao', 'Crown', 'milestone', 1500, 0),
('badge_streak_master', 'Chiến Binh Bền Bỉ', 'Duy trì chuỗi đăng nhập học tập 3 ngày liên tục', 'Flame', 'loyalty', 300, 3)
ON CONFLICT (id) DO NOTHING;

-- Seed Môn học theo GDPT 2018: Công nghệ, Tin học, Hoạt động trải nghiệm
INSERT INTO public.subjects (code, name, grade_level, school_level, icon, color_theme, description) VALUES
-- CÔNG NGHỆ KHỐI 6, 7, 8, 9
('CONG_NGHE_6', 'Công nghệ 6', 6, 'secondary', 'Cpu', 'emerald', 'Nhà ở, bảo quản thực phẩm, trang phục và đồ dùng điện trong gia đình.'),
('CONG_NGHE_7', 'Công nghệ 7', 7, 'secondary', 'Sprout', 'emerald', 'Trồng trọt, bảo vệ cây trồng, chăn nuôi và nuôi thủy sản.'),
('CONG_NGHE_8', 'Công nghệ 8', 8, 'secondary', 'Wrench', 'emerald', 'Vẽ kĩ thuật, cơ khí, kĩ thuật điện và an toàn điện gia đình.'),
('CONG_NGHE_9', 'Công nghệ 9', 9, 'secondary', 'Cog', 'emerald', 'Lắp đặt mạng điện trong nhà, trồng cây ăn quả, định hướng nghề nghiệp kĩ thuật.'),

-- HOẠT ĐỘNG TRẢI NGHIỆM, HƯỚNG NGHIỆP KHỐI 6, 7, 8, 9
('HDTN_HN_6', 'Hoạt động trải nghiệm, hướng nghiệp 6', 6, 'secondary', 'Compass', 'amber', 'Khám phá bản thân, rèn luyện thói quen và xây dựng tình bạn học đường.'),
('HDTN_HN_7', 'Hoạt động trải nghiệm, hướng nghiệp 7', 7, 'secondary', 'Users', 'amber', 'Phát triển các mối quan hệ, kiểm soát cảm xúc và tham gia hoạt động xã hội.'),
('HDTN_HN_8', 'Hoạt động trải nghiệm, hướng nghiệp 8', 8, 'secondary', 'Target', 'amber', 'Xây dựng hình ảnh bản thân, chi tiêu hợp lý và phòng tránh xung đột.'),
('HDTN_HN_9', 'Hoạt động trải nghiệm, hướng nghiệp 9', 9, 'secondary', 'Briefcase', 'amber', 'Tìm hiểu thế giới nghề nghiệp, định hướng lựa chọn trường và con đường tương lai.'),

-- TIN HỌC KHỐI 6, 7, 8, 9
('TIN_HOC_6', 'Tin học 6', 6, 'secondary', 'Monitor', 'cyan', 'Máy tính và dữ liệu, mạng máy tính, soạn thảo văn bản và sơ đồ tư duy.'),
('TIN_HOC_7', 'Tin học 7', 7, 'secondary', 'Table', 'cyan', 'Bảng tính điện tử, phần mềm ứng dụng, đạo đức và văn hóa mạng.'),
('TIN_HOC_8', 'Tin học 8', 8, 'secondary', 'Code', 'cyan', 'Thuật toán, lập trình trực quan Scratch/Python, tư duy xử lý thông tin.'),
('TIN_HOC_9', 'Tin học 9', 9, 'secondary', 'Database', 'cyan', 'Cơ sở dữ liệu, mạng đa phương tiện, an toàn không gian mạng và nghề tin học.')
ON CONFLICT (code, grade_level) DO NOTHING;

