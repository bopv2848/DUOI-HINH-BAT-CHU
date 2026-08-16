import { Subject, Game, Badge } from '../types';

export const INITIAL_SUBJECTS: Subject[] = [
  // CÔNG NGHỆ 6, 7, 8, 9
  { id: 'sub_tech_6', code: 'CONG_NGHE_6', name: 'Công nghệ 6', gradeLevel: 6, schoolLevel: 'secondary', icon: 'Cpu', colorTheme: 'emerald', description: 'Nhà ở thông minh, bảo quản chế biến thực phẩm, trang phục và đồ dùng điện gia đình.' },
  { id: 'sub_tech_7', code: 'CONG_NGHE_7', name: 'Công nghệ 7', gradeLevel: 7, schoolLevel: 'secondary', icon: 'Sprout', colorTheme: 'emerald', description: 'Trồng trọt hữu cơ, bảo vệ cây trồng, kĩ thuật chăn nuôi và nuôi thủy sản sạch.' },
  { id: 'sub_tech_8', code: 'CONG_NGHE_8', name: 'Công nghệ 8', gradeLevel: 8, schoolLevel: 'secondary', icon: 'Wrench', colorTheme: 'emerald', description: 'Bản vẽ kĩ thuật, cơ khí chế tạo, kĩ thuật điện và an toàn điện trong nhà.' },
  { id: 'sub_tech_9', code: 'CONG_NGHE_9', name: 'Công nghệ 9', gradeLevel: 9, schoolLevel: 'secondary', icon: 'Cog', colorTheme: 'emerald', description: 'Lắp đặt mạng điện trong nhà, năng lượng mặt trời và định hướng nghề kỹ thuật.' },

  // HOẠT ĐỘNG TRẢI NGHIỆM, HƯỚNG NGHIỆP 6, 7, 8, 9
  { id: 'sub_hdtn_6', code: 'HDTN_HN_6', name: 'Hoạt động trải nghiệm, hướng nghiệp 6', gradeLevel: 6, schoolLevel: 'secondary', icon: 'Compass', colorTheme: 'amber', description: 'Khám phá bản thân, rèn luyện nền nếp và xây dựng tình bạn học đường thân thiện.' },
  { id: 'sub_hdtn_7', code: 'HDTN_HN_7', name: 'Hoạt động trải nghiệm, hướng nghiệp 7', gradeLevel: 7, schoolLevel: 'secondary', icon: 'Users', colorTheme: 'amber', description: 'Phát triển các mối quan hệ, quản lý cảm xúc và tham gia hoạt động thiện nguyện xã hội.' },
  { id: 'sub_hdtn_8', code: 'HDTN_HN_8', name: 'Hoạt động trải nghiệm, hướng nghiệp 8', gradeLevel: 8, schoolLevel: 'secondary', icon: 'Target', colorTheme: 'amber', description: 'Xây dựng hình ảnh bản thân, quản lý tài chính cá nhân và phòng chống bạo lực mạng.' },
  { id: 'sub_hdtn_9', code: 'HDTN_HN_9', name: 'Hoạt động trải nghiệm, hướng nghiệp 9', gradeLevel: 9, schoolLevel: 'secondary', icon: 'Briefcase', colorTheme: 'amber', description: 'Tìm hiểu thế giới nghề nghiệp trong thời đại 4.0, định hướng chọn trường và tương lai.' },

  // TIN HỌC 6, 7, 8, 9
  { id: 'sub_it_6', code: 'TIN_HOC_6', name: 'Tin học 6', gradeLevel: 6, schoolLevel: 'secondary', icon: 'Monitor', colorTheme: 'cyan', description: 'Thông tin và dữ liệu, mạng máy tính và Internet, sơ đồ tư duy Mindmap.' },
  { id: 'sub_it_7', code: 'TIN_HOC_7', name: 'Tin học 7', gradeLevel: 7, schoolLevel: 'secondary', icon: 'Table', colorTheme: 'cyan', description: 'Bảng tính điện tử Excel, phần mềm ứng dụng, đạo đức và văn hóa ứng xử mạng.' },
  { id: 'sub_it_8', code: 'TIN_HOC_8', name: 'Tin học 8', gradeLevel: 8, schoolLevel: 'secondary', icon: 'Code', colorTheme: 'cyan', description: 'Thuật toán logic, lập trình trực quan Scratch/Python, giải quyết vấn đề số.' },
  { id: 'sub_it_9', code: 'TIN_HOC_9', name: 'Tin học 9', gradeLevel: 9, schoolLevel: 'secondary', icon: 'Database', colorTheme: 'cyan', description: 'Cơ sở dữ liệu, an ninh không gian mạng và ứng dụng trí tuệ nhân tạo AI.' },

  // TIỂU HỌC & MÔN MỞ RỘNG
  { id: 'sub_tv_pri', code: 'TIENG_VIET_TH', name: 'Tiếng Việt Tiểu học (Thành ngữ & Tục ngữ)', gradeLevel: 4, schoolLevel: 'primary', icon: 'BookOpen', colorTheme: 'rose', description: 'Đuổi hình bắt chữ ca dao, tục ngữ và nét đẹp văn hóa dân gian Việt Nam.' },
  { id: 'sub_math_pri', code: 'TOAN_TH', name: 'Toán học Tiểu học & Vui nhộn', gradeLevel: 5, schoolLevel: 'primary', icon: 'Calculator', colorTheme: 'indigo', description: 'Khám phá hình khối, phân số và các phép tính logic lý thú.' },
  { id: 'sub_khtn_7', code: 'KHTN_7', name: 'Khoa học Tự nhiên 7 (Lý - Hóa - Sinh)', gradeLevel: 7, schoolLevel: 'secondary', icon: 'FlaskConical', colorTheme: 'teal', description: 'Quang hợp, phản ứng hóa học, năng lượng và thế giới vi sinh vật.' },
  { id: 'sub_lsdl_6', code: 'LICH_SU_DIA_LI_6', name: 'Lịch sử & Địa lí 6', gradeLevel: 6, schoolLevel: 'secondary', icon: 'Globe', colorTheme: 'orange', description: 'Khám phá danh lam thắng cảnh, di sản văn hóa và mốc son lịch sử hào hùng.' },
  { id: 'sub_en_sec', code: 'TIENG_ANH_THCS', name: 'Tiếng Anh THCS (English Catch Word)', gradeLevel: 8, schoolLevel: 'secondary', icon: 'Languages', colorTheme: 'sky', description: 'Chinh phục từ vựng tiếng Anh qua hình ảnh sinh động và mẹo ghi nhớ đỉnh cao.' },
  { id: 'sub_it_high', code: 'TIN_HOC_10', name: 'Tin học 10 (Khoa học Máy tính & AI)', gradeLevel: 10, schoolLevel: 'high', icon: 'Terminal', colorTheme: 'violet', description: 'Khoa học dữ liệu, lập trình Python và kiến trúc hệ thống hiện đại.' },
];

export const INITIAL_BADGES: Badge[] = [
  { id: 'badge_first_win', name: 'Khởi Đầu Nan', description: 'Hoàn thành ván chơi đầu tiên với điểm số xuất sắc', icon: 'Trophy', category: 'achievement', requiredXp: 50, requiredStreak: 0 },
  { id: 'badge_combo_king', name: 'Chiến Thần Tốc Độ', description: 'Đạt chuỗi Combo 5 câu trả lời đúng liên tiếp', icon: 'Zap', category: 'skill', requiredXp: 200, requiredStreak: 0 },
  { id: 'badge_scholar', name: 'Nhà Thông Thái', description: 'Tích lũy đạt 500 XP kiến thức trên hệ thống', icon: 'GraduationCap', category: 'milestone', requiredXp: 500, requiredStreak: 0 },
  { id: 'badge_master', name: 'Bậc Thầy Đuổi Hình', description: 'Tích lũy đạt 1,500 XP kiến thức đỉnh cao', icon: 'Crown', category: 'milestone', requiredXp: 1500, requiredStreak: 0 },
  { id: 'badge_streak_master', name: 'Chiến Binh Bền Bỉ', description: 'Duy trì chuỗi đăng nhập học tập 3 ngày liên tục', icon: 'Flame', category: 'loyalty', requiredXp: 300, requiredStreak: 3 },
];

export const INITIAL_GAMES: Game[] = [
  // GAME 1: TIN HỌC 6
  {
    id: 'game_it_6_catchword',
    title: 'Tin Học 6: Thế Giới Mạng & Sơ Đồ Tư Duy',
    description: 'Thử thách nhìn hình đoán các khái niệm cốt lõi trong môn Tin học 6: Mạng máy tính, Sơ đồ tư duy, Dữ liệu số.',
    subjectId: 'sub_it_6',
    subjectName: 'Tin học 6',
    subjectCode: 'TIN_HOC_6',
    gameType: 'catch_word',
    schoolLevel: 'secondary',
    gradeLevel: 6,
    thumbnailUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=80',
    totalQuestions: 6,
    playsCount: 142,
    isPublished: true,
    questions: [
      { id: 'q_it6_1', gameId: 'game_it_6_catchword', imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80', answerText: 'MẠNG MÁY TÍNH', hintText: 'Hệ thống kết nối nhiều thiết bị điện tử để chia sẻ dữ liệu và tài nguyên với nhau.', explanation: 'Mạng máy tính (Computer Network) là tập hợp các máy tính được kết nối theo một phương thức nào đó nhằm mục đích chia sẻ tài nguyên và trao đổi thông tin.', timeLimitSeconds: 45, points: 100, orderIndex: 1 },
      { id: 'q_it6_2', gameId: 'game_it_6_catchword', imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=80', answerText: 'SƠ ĐỒ TƯ DUY', hintText: 'Công cụ đồ họa thể hiện các ý tưởng phân nhánh xuất phát từ một chủ đề trung tâm.', explanation: 'Sơ đồ tư duy (Mindmap) giúp học sinh tổ chức, phân tích, tóm tắt và ghi nhớ kiến thức một cách trực quan, khoa học theo GDPT 2018.', timeLimitSeconds: 45, points: 100, orderIndex: 2 },
      { id: 'q_it6_3', gameId: 'game_it_6_catchword', imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80', answerText: 'BẢO MẬT THÔNG TIN', hintText: 'Hành động đặt mật khẩu mạnh, chống mã độc để bảo vệ an toàn cho dữ liệu cá nhân.', explanation: 'Bảo mật thông tin là việc ngăn chặn sự truy cập, sử dụng, tiết lộ, gián đoạn trái phép đối với thông tin và dữ liệu số.', timeLimitSeconds: 45, points: 100, orderIndex: 3 },
      { id: 'q_it6_4', gameId: 'game_it_6_catchword', imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80', answerText: 'TRÌNH DUYỆT WEB', hintText: 'Phần mềm ứng dụng dùng để truy cập, duyệt xem các trang thông tin trên mạng Internet.', explanation: 'Trình duyệt web (Web Browser) là cầu nối giúp người dùng tương tác và khai thác kho tàng tri thức khổng lồ trên mạng Internet.', timeLimitSeconds: 45, points: 100, orderIndex: 4 },
      { id: 'q_it6_5', gameId: 'game_it_6_catchword', imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=80', answerText: 'ĐIỆN TOÁN ĐÁM MÂY', hintText: 'Lưu trữ tệp tin và chạy phần mềm trên máy chủ từ xa qua mạng Internet.', explanation: 'Cloud Computing giúp truy cập dữ liệu mọi lúc mọi nơi từ Google Drive, OneDrive.', timeLimitSeconds: 45, points: 100, orderIndex: 5 },
      { id: 'q_it6_6', gameId: 'game_it_6_catchword', imageUrl: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&auto=format&fit=crop&q=80', answerText: 'BỘ NHỚ RAM', hintText: 'Bộ nhớ trong lưu trữ dữ liệu tạm thời của máy tính khi đang hoạt động.', explanation: 'RAM (Random Access Memory) là bộ nhớ truy xuất ngẫu nhiên, dữ liệu sẽ mất khi tắt nguồn máy tính.', timeLimitSeconds: 45, points: 100, orderIndex: 6 }
    ]
  },

  // GAME 2: CÔNG NGHỆ 8
  {
    id: 'game_tech_8_catchword',
    title: 'Công Nghệ 8: Cơ Khí Chế Tạo & An Toàn Điện',
    description: 'Chinh phục các câu đố hình ảnh về bản vẽ kĩ thuật, cơ khí chế tạo và thiết bị an toàn điện gia đình.',
    subjectId: 'sub_tech_8',
    subjectName: 'Công nghệ 8',
    subjectCode: 'CONG_NGHE_8',
    gameType: 'catch_word',
    schoolLevel: 'secondary',
    gradeLevel: 8,
    thumbnailUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
    totalQuestions: 6,
    playsCount: 98,
    isPublished: true,
    questions: [
      { id: 'q_tech8_1', gameId: 'game_tech_8_catchword', imageUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&auto=format&fit=crop&q=80', answerText: 'BẢN VẼ KỸ THUẬT', hintText: 'Bản vẽ mô tả hình dạng, kích thước, vật liệu và yêu cầu kĩ thuật của một sản phẩm cơ khí.', explanation: 'Bản vẽ kĩ thuật là ngôn ngữ chung của ngành kĩ thuật, là căn cứ để chế tạo, kiểm tra và lắp ráp chi tiết máy.', timeLimitSeconds: 45, points: 100, orderIndex: 1 },
      { id: 'q_tech8_2', gameId: 'game_tech_8_catchword', imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80', answerText: 'AN TOÀN ĐIỆN GIA ĐÌNH', hintText: 'Lắp đặt Aptomat chống giật, nối đất vỏ kim loại và không chạm tay ướt vào ổ cắm.', explanation: 'Tuân thủ quy tắc an toàn điện giúp phòng tránh triệt để tai nạn nguy hiểm và cháy nổ.', timeLimitSeconds: 45, points: 100, orderIndex: 2 },
      { id: 'q_tech8_3', gameId: 'game_tech_8_catchword', imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&auto=format&fit=crop&q=80', answerText: 'TIẾT KIỆM NĂNG LƯỢNG', hintText: 'Hành động tắt thiết bị điện khi không sử dụng và tận dụng ánh sáng tự nhiên.', explanation: 'Sử dụng năng lượng tiết kiệm và hiệu quả góp phần giảm chi phí sinh hoạt và bảo vệ môi trường sinh thái.', timeLimitSeconds: 45, points: 100, orderIndex: 3 },
      { id: 'q_tech8_4', gameId: 'game_tech_8_catchword', imageUrl: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=800&auto=format&fit=crop&q=80', answerText: 'TRUYỀN CHUYỂN ĐỘNG', hintText: 'Cơ cấu bánh răng, xích líp truyền chuyển động quay từ trục này sang trục khác trong máy cơ khí.', explanation: 'Cơ cấu truyền và biến đổi chuyển động giúp truyền lực và biến đổi tốc độ theo yêu cầu công việc.', timeLimitSeconds: 45, points: 100, orderIndex: 4 },
      { id: 'q_tech8_5', gameId: 'game_tech_8_catchword', imageUrl: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800&auto=format&fit=crop&q=80', answerText: 'DỤNG CỤ CƠ KHÍ', hintText: 'Bộ dụng cụ bao gồm cờ lê, mỏ lết, búa, kìm, tua vít dùng để sửa chữa máy móc gia đình.', explanation: 'Sử dụng thành thạo dụng cụ cơ khí cầm tay là kỹ năng thực hành quan trọng trong môn Công nghệ 8.', timeLimitSeconds: 45, points: 100, orderIndex: 5 },
      { id: 'q_tech8_6', gameId: 'game_tech_8_catchword', imageUrl: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800&auto=format&fit=crop&q=80', answerText: 'VẬT LIỆU KIM LOẠI', hintText: 'Nhóm vật liệu dẫn điện và dẫn nhiệt tốt như sắt, thép, đồng, nhôm trong cơ khí.', explanation: 'Kim loại và hợp kim là vật liệu cơ bản tạo nên khung vỏ và chi tiết chuyển động của máy móc.', timeLimitSeconds: 45, points: 100, orderIndex: 6 }
    ]
  },

  // GAME 3: HĐTN-HN 9
  {
    id: 'game_hdtn_9_catchword',
    title: 'HĐTN-HN 9: Định Hướng Tương Lai & Chọn Trường THPT',
    description: 'Khám phá thế giới nghề nghiệp, kỹ năng mềm và con đường chọn trường THPT phù hợp với năng lực bản thân.',
    subjectId: 'sub_hdtn_9',
    subjectName: 'HĐTN-HN 9',
    subjectCode: 'HDTN_HN_9',
    gameType: 'catch_word',
    schoolLevel: 'secondary',
    gradeLevel: 9,
    thumbnailUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop&q=80',
    totalQuestions: 6,
    playsCount: 165,
    isPublished: true,
    questions: [
      { id: 'q_hdtn9_1', gameId: 'game_hdtn_9_catchword', imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80', answerText: 'ĐỊNH HƯỚNG NGHỀ NGHIỆP', hintText: 'Quá trình tìm hiểu sở thích, năng lực cá nhân và nhu cầu xã hội để chọn ngành nghề tương lai.', explanation: 'Định hướng nghề nghiệp đúng từ cấp THCS giúp học sinh có động lực học tập và chọn đúng tổ hợp môn khi bước vào cấp THPT.', timeLimitSeconds: 45, points: 100, orderIndex: 1 },
      { id: 'q_hdtn9_2', gameId: 'game_hdtn_9_catchword', imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80', answerText: 'LẬP KẾ HOẠCH HỌC TẬP', hintText: 'Việc sắp xếp thời gian biểu, mục tiêu điểm số và các bước ôn thi vào lớp 10 rõ ràng.', explanation: 'Lập kế hoạch học tập giúp rèn luyện thói quen tự chủ, quản lý thời gian hiệu quả và giảm bớt áp lực thi cử.', timeLimitSeconds: 45, points: 100, orderIndex: 2 },
      { id: 'q_hdtn9_3', gameId: 'game_hdtn_9_catchword', imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&auto=format&fit=crop&q=80', answerText: 'TINH THẦN ĐỒNG ĐỘI', hintText: 'Sự gắn kết, hỗ trợ lẫn nhau giữa các thành viên trong nhóm để cùng hoàn thành mục tiêu chung.', explanation: 'Tinh thần đồng đội (Teamwork) giúp nhân đôi sức mạnh, xây dựng mối quan hệ gắn bó bền chặt và tạo ra những kết quả vượt bậc.', timeLimitSeconds: 45, points: 100, orderIndex: 3 },
      { id: 'q_hdtn9_4', gameId: 'game_hdtn_9_catchword', imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop&q=80', answerText: 'KỸ NĂNG THÍCH ỨNG', hintText: 'Khả năng nhanh chóng hòa nhập và linh hoạt xử lý khi môi trường sống hoặc học tập thay đổi.', explanation: 'Trong thế giới biến đổi nhanh chóng, khả năng thích ứng là chìa khóa then chốt để thành công.', timeLimitSeconds: 45, points: 100, orderIndex: 4 },
      { id: 'q_hdtn9_5', gameId: 'game_hdtn_9_catchword', imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80', answerText: 'TỰ HỌC SUỐT ĐỜI', hintText: 'Tinh thần chủ động tìm tòi, đọc sách và nâng cao kiến thức liên tục mọi lúc mọi nơi.', explanation: 'Tự học là năng lực quan trọng nhất để không bị tụt hậu trong kỷ nguyên trí tuệ nhân tạo.', timeLimitSeconds: 45, points: 100, orderIndex: 5 },
      { id: 'q_hdtn9_6', gameId: 'game_hdtn_9_catchword', imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80', answerText: 'TRẢI NGHIỆM THỰC TẾ', hintText: 'Các chuyến đi thực địa, tham quan doanh nghiệp để tìm hiểu thực tế công việc.', explanation: 'Học đi đôi với hành giúp biến kiến thức sách vở thành năng lực thực tiễn sống động.', timeLimitSeconds: 45, points: 100, orderIndex: 6 }
    ]
  },

  // GAME 4: TIẾNG VIỆT TIỂU HỌC
  {
    id: 'game_tv_pri_catchword',
    title: 'Tiếng Việt: Đuổi Hình Bắt Chữ Ca Dao Tục Ngữ',
    description: 'Khám phá kho tàng thành ngữ, tục ngữ, ca dao Việt Nam qua các hình ảnh ẩn dụ dí dỏm và giàu tính giáo dục.',
    subjectId: 'sub_tv_pri',
    subjectName: 'Tiếng Việt Tiểu học',
    subjectCode: 'TIENG_VIET_TH',
    gameType: 'catch_word',
    schoolLevel: 'primary',
    gradeLevel: 4,
    thumbnailUrl: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=600&auto=format&fit=crop&q=80',
    totalQuestions: 6,
    playsCount: 210,
    isPublished: true,
    questions: [
      { id: 'q_tv_1', gameId: 'game_tv_pri_catchword', imageUrl: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=800&auto=format&fit=crop&q=80', answerText: 'ĂN QUẢ NHỚ KẺ TRỒNG CÂY', hintText: 'Câu tục ngữ nhắc nhở con người phải luôn biết ơn những người đã giúp đỡ mình.', explanation: 'Uống nước nhớ nguồn, ăn quả nhớ kẻ trồng cây là bài học đạo lý căn bản trong Tiếng Việt tiểu học.', timeLimitSeconds: 45, points: 100, orderIndex: 1 },
      { id: 'q_tv_2', gameId: 'game_tv_pri_catchword', imageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&auto=format&fit=crop&q=80', answerText: 'LÁ LÀNH ĐÙM LÁ RÁCH', hintText: 'Thành ngữ ca ngợi tinh thần tương thân tương ái, người khá giả giúp đỡ người nghèo khó.', explanation: 'Truyền thống lá lành đùm lá rách thể hiện tinh thần đùm bọc yêu thương của dân tộc Việt Nam.', timeLimitSeconds: 45, points: 100, orderIndex: 2 },
      { id: 'q_tv_3', gameId: 'game_tv_pri_catchword', imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80', answerText: 'HỌC THẦY KHÔNG TÀY HỌC BẠN', hintText: 'Lời khuyên học hỏi từ thầy cô và cả từ bạn bè cùng trang lứa để cùng tiến bộ.', explanation: 'Học hỏi từ bạn bè là phương pháp học tập nhóm tích cực được khuyến khích trong SGK mới.', timeLimitSeconds: 45, points: 100, orderIndex: 3 },
      { id: 'q_tv_4', gameId: 'game_tv_pri_catchword', imageUrl: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=800&auto=format&fit=crop&q=80', answerText: 'ĐẤT LÀNH CHIM ĐẬU', hintText: 'Nơi có môi trường sống tốt đẹp, yên bình sẽ thu hút nhân tài và muôn loài về sinh sống.', explanation: 'Câu thành ngữ ví von nơi thanh bình thịnh vượng luôn là nơi đón nhận nhiều điều may mắn.', timeLimitSeconds: 45, points: 100, orderIndex: 4 },
      { id: 'q_tv_5', gameId: 'game_tv_pri_catchword', imageUrl: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800&auto=format&fit=crop&q=80', answerText: 'MƯA THUẬN GIÓ HÒA', hintText: 'Thời tiết khí hậu êm dịu, thuận lợi cho mùa màng tốt tươi và cuộc sống ấm no.', explanation: 'Ước vọng mưa thuận gió hòa là ước mơ ngàn đời của cư dân nông nghiệp lúa nước Việt Nam.', timeLimitSeconds: 45, points: 100, orderIndex: 5 },
      { id: 'q_tv_6', gameId: 'game_tv_pri_catchword', imageUrl: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=800&auto=format&fit=crop&q=80', answerText: 'CÔNG CHA NGHĨA MẸ', hintText: 'Công ơn sinh thành dưỡng dục cao dày như núi Thái Sơn, rộng lớn như biển Đông.', explanation: 'Hiếu thảo với cha mẹ là đạo đức nền tảng đầu tiên trong cuộc đời của mỗi người con.', timeLimitSeconds: 45, points: 100, orderIndex: 6 }
    ]
  }
];
