const supabaseUrl = 'https://ulgbwklsfkzqpyniztgq.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsZ2J3a2xzZmt6cXB5bml6dGdxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Njg5MTcyOCwiZXhwIjoyMTAyNDY3NzI4fQ.NFuWZTK_ezIq126YxYhLEEx-M0KfJevIMKIo4D8Zqa0';

const headers = {
  'apikey': serviceRoleKey,
  'Authorization': `Bearer ${serviceRoleKey}`,
  'Content-Type': 'application/json',
  'Prefer': 'resolution=merge-duplicates,return=representation',
};

async function apiPost(endpoint, data) {
  const res = await fetch(`${supabaseUrl}/rest/v1/${endpoint}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const txt = await res.text();
    console.error(`Lỗi API ${endpoint}:`, txt);
  }
  return res.json().catch(() => null);
}

async function apiGet(endpoint) {
  const res = await fetch(`${supabaseUrl}/rest/v1/${endpoint}`, {
    method: 'GET',
    headers,
  });
  return res.json().catch(() => []);
}

// 1. TẤT CẢ MÔN HỌC BỔ SUNG GDPT 2018
const ALL_SUBJECTS = [
  // CÔNG NGHỆ 6, 7, 8, 9
  { code: 'CONG_NGHE_6', name: 'Công nghệ 6', grade_level: 6, school_level: 'secondary', icon: 'Cpu', color_theme: 'emerald', description: 'Nhà ở, bảo quản chế biến thực phẩm, trang phục và đồ dùng điện gia đình.' },
  { code: 'CONG_NGHE_7', name: 'Công nghệ 7', grade_level: 7, school_level: 'secondary', icon: 'Sprout', color_theme: 'emerald', description: 'Trồng trọt, bảo vệ cây trồng, chăn nuôi và nuôi thủy sản sạch.' },
  { code: 'CONG_NGHE_8', name: 'Công nghệ 8', grade_level: 8, school_level: 'secondary', icon: 'Wrench', color_theme: 'emerald', description: 'Bản vẽ kỹ thuật, cơ khí chế tạo và an toàn điện gia đình.' },
  { code: 'CONG_NGHE_9', name: 'Công nghệ 9', grade_level: 9, school_level: 'secondary', icon: 'Cog', color_theme: 'emerald', description: 'Mạng điện trong nhà, năng lượng mặt trời và định hướng kỹ thuật.' },

  // HĐTN-HN 6, 7, 8, 9
  { code: 'HDTN_HN_6', name: 'Hoạt động trải nghiệm, hướng nghiệp 6', grade_level: 6, school_level: 'secondary', icon: 'Compass', color_theme: 'amber', description: 'Khám phá bản thân, rèn luyện nền nếp và xây dựng tình bạn học đường.' },
  { code: 'HDTN_HN_7', name: 'Hoạt động trải nghiệm, hướng nghiệp 7', grade_level: 7, school_level: 'secondary', icon: 'Users', color_theme: 'amber', description: 'Phát triển các mối quan hệ, làm chủ cảm xúc và hoạt động thiện nguyện.' },
  { code: 'HDTN_HN_8', name: 'Hoạt động trải nghiệm, hướng nghiệp 8', grade_level: 8, school_level: 'secondary', icon: 'Target', color_theme: 'amber', description: 'Quản lý tài chính cá nhân, xây dựng hình ảnh và kỹ năng thuyết trình.' },
  { code: 'HDTN_HN_9', name: 'Hoạt động trải nghiệm, hướng nghiệp 9', grade_level: 9, school_level: 'secondary', icon: 'Briefcase', color_theme: 'amber', description: 'Định hướng nghề nghiệp, kỹ năng thích ứng và chọn trường THPT.' },

  // TIN HỌC 6, 7, 8, 9
  { code: 'TIN_HOC_6', name: 'Tin học 6', grade_level: 6, school_level: 'secondary', icon: 'Monitor', color_theme: 'cyan', description: 'Mạng máy tính, sơ đồ tư duy Mindmap và bảo mật thông tin.' },
  { code: 'TIN_HOC_7', name: 'Tin học 7', grade_level: 7, school_level: 'secondary', icon: 'Table', color_theme: 'cyan', description: 'Bảng tính điện tử Excel, biểu đồ dữ liệu và bản quyền phần mềm.' },
  { code: 'TIN_HOC_8', name: 'Tin học 8', grade_level: 8, school_level: 'secondary', icon: 'Code', color_theme: 'cyan', description: 'Thuật toán logic, lập trình trực quan Scratch và tư duy giải quyết vấn đề.' },
  { code: 'TIN_HOC_9', name: 'Tin học 9', grade_level: 9, school_level: 'secondary', icon: 'Database', color_theme: 'cyan', description: 'Cơ sở dữ liệu, an ninh mạng và ứng dụng trí tuệ nhân tạo AI.' },

  // TIỂU HỌC & MÔN MỞ RỘNG
  { code: 'TIENG_VIET_TH', name: 'Tiếng Việt Tiểu học (Thành ngữ & Tục ngữ)', grade_level: 4, school_level: 'primary', icon: 'BookOpen', color_theme: 'rose', description: 'Đoán hình bắt chữ ca dao, tục ngữ và nét đẹp văn hóa dân gian Việt Nam.' },
  { code: 'TOAN_TH', name: 'Toán học Tiểu học & Vui nhộn', grade_level: 5, school_level: 'primary', icon: 'Calculator', color_theme: 'indigo', description: 'Khám phá hình học, phân số và các phép tính logic lý thú.' },
  { code: 'KHTN_7', name: 'Khoa học Tự nhiên 7 (Vật lí - Hóa học - Sinh học)', grade_level: 7, school_level: 'secondary', icon: 'FlaskConical', color_theme: 'teal', description: 'Quang hợp, phản ứng hóa học, năng lượng và thế giới vi sinh vật.' },
  { code: 'LICH_SU_DIA_LI_6', name: 'Lịch sử & Địa lí 6', grade_level: 6, school_level: 'secondary', icon: 'Globe', color_theme: 'orange', description: 'Khám phá danh lam thắng cảnh, di sản văn hóa và mốc son lịch sử hào hùng.' },
  { code: 'TIENG_ANH_THCS', name: 'Tiếng Anh THCS (English Catch Word)', grade_level: 8, school_level: 'secondary', icon: 'Languages', color_theme: 'sky', description: 'Chinh phục từ vựng tiếng Anh qua hình ảnh sinh động và mẹo ghi nhớ đỉnh cao.' },
  { code: 'TIN_HOC_10', name: 'Tin học 10 (Khoa học Máy tính & AI)', grade_level: 10, school_level: 'high', icon: 'Terminal', color_theme: 'violet', description: 'Khoa học dữ liệu, lập trình Python và kiến trúc hệ thống hiện đại.' }
];

// 2. NGÂN HÀNG 100+ CÂU HỎI HÌNH ẢNH TOÀN DIỆN
const ALL_SEED_GAMES = [
  // 1. TIN HỌC 6
  {
    code: 'TIN_HOC_6',
    title: 'Tin Học 6: Thế Giới Mạng & Sơ Đồ Tư Duy',
    schoolLevel: 'secondary',
    gradeLevel: 6,
    questions: [
      { answerText: 'MẠNG MÁY TÍNH', hintText: 'Hệ thống kết nối nhiều thiết bị điện tử để chia sẻ dữ liệu và tài nguyên.', explanation: 'Mạng máy tính (Computer Network) là tập hợp các máy tính kết nối với nhau để chia sẻ tài nguyên và trao đổi thông tin.', imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'SƠ ĐỒ TƯ DUY', hintText: 'Công cụ đồ họa thể hiện các ý tưởng phân nhánh từ chủ đề trung tâm.', explanation: 'Sơ đồ tư duy (Mindmap) giúp học sinh tổ chức, ghi nhớ và phát triển ý tưởng sáng tạo trong học tập.', imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'BẢO MẬT THÔNG TIN', hintText: 'Hành động đặt mật khẩu mạnh và chống virus để bảo vệ dữ liệu cá nhân.', explanation: 'Bảo mật thông tin giúp ngăn chặn các truy cập trái phép và bảo vệ an toàn trên không gian mạng.', imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'TRÌNH DUYỆT WEB', hintText: 'Phần mềm ứng dụng như Chrome, Edge để lướt xem các trang web trên Internet.', explanation: 'Trình duyệt Web (Web Browser) là cánh cổng để con người tương tác và khám phá kho tàng Internet.', imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'ĐIỆN TOÁN ĐÁM MÂY', hintText: 'Lưu trữ tệp tin và chạy phần mềm trên máy chủ từ xa qua mạng Internet.', explanation: 'Cloud Computing giúp truy cập dữ liệu mọi lúc mọi nơi từ Google Drive, OneDrive.', imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'BỘ NHỚ RAM', hintText: 'Bộ nhớ trong lưu trữ dữ liệu tạm thời của máy tính khi đang hoạt động.', explanation: 'RAM (Random Access Memory) là bộ nhớ truy xuất ngẫu nhiên, dữ liệu sẽ mất khi tắt nguồn máy tính.', imageUrl: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&auto=format&fit=crop&q=80' }
    ]
  },
  // 2. TIN HỌC 7
  {
    code: 'TIN_HOC_7',
    title: 'Tin Học 7: Bảng Tính Điện Tử & Văn Hóa Mạng',
    schoolLevel: 'secondary',
    gradeLevel: 7,
    questions: [
      { answerText: 'BẢNG TÍNH ĐIỆN TỬ', hintText: 'Phần mềm tổ chức dữ liệu dạng hàng và cột như Microsoft Excel hay Google Sheets.', explanation: 'Bảng tính điện tử (Spreadsheet) giúp tính toán và phân tích số liệu nhanh chóng bằng công thức.', imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'BIỂU ĐỒ CỘT', hintText: 'Dạng đồ thị biểu diễn số liệu trực quan dạng các thanh thẳng đứng so sánh đại lượng.', explanation: 'Biểu đồ cột (Column Chart) giúp so sánh trực quan các giá trị dữ liệu qua các năm hoặc đối tượng.', imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'BẢN QUYỀN PHẦN MỀM', hintText: 'Quyền tác giả hợp pháp của người viết phần mềm được pháp luật bảo hộ.', explanation: 'Tôn trọng bản quyền phần mềm là hành vi có văn hóa và đạo đức trong kỷ nguyên công nghệ số.', imageUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'VIRUS MÁY TÍNH', hintText: 'Đoạn mã độc lây lan phá hoại phần mềm và đánh cắp thông tin người dùng.', explanation: 'Virus máy tính là phần mềm độc hại có khả năng tự nhân bản và lây nhiễm sang các máy khác.', imageUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'ĐỊA CHỈ Ô TÍNH', hintText: 'Tên định danh giao giữa một cột chữ cái và một hàng chữ số (Ví dụ: A1, B5).', explanation: 'Địa chỉ ô (Cell Address) là tọa độ xác định duy nhất vị trí chứa dữ liệu trong bảng tính điện tử.', imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'CÔNG THỨC TÍNH TOÁN', hintText: 'Biểu thức bắt đầu bằng dấu bằng (=) dùng để thực hiện cộng, trừ, nhân, chia.', explanation: 'Công thức toán học trong Excel giúp tự động hóa việc tính toán bảng điểm và sổ sách thu chi.', imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80' }
    ]
  },
  // 3. TIN HỌC 8
  {
    code: 'TIN_HOC_8',
    title: 'Tin Học 8: Thuật Toán Logic & Lập Trình Scratch',
    schoolLevel: 'secondary',
    gradeLevel: 8,
    questions: [
      { answerText: 'THUẬT TOÁN', hintText: 'Dãy các chỉ dẫn hữu hạn, rõ ràng để giải quyết một bài toán xác định.', explanation: 'Thuật toán (Algorithm) là nền tảng cốt lõi của khoa học máy tính và lập trình ứng dụng.', imageUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'LẬP TRÌNH TRỰC QUAN', hintText: 'Phương pháp kéo thả khối lệnh như Scratch để tạo trò chơi và hoạt hình.', explanation: 'Lập trình kéo thả khối lệnh giúp học sinh rèn luyện tư duy logic toán học một cách trực quan.', imageUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'VÒNG LẶP HỮU HẠN', hintText: 'Cấu trúc điều khiển lặp lại một khối lệnh với số lần định trước (vòng lặp for).', explanation: 'Cấu trúc lặp giúp máy tính thực hiện hàng ngàn phép tính giống nhau mà không cần viết lại mã nguồn.', imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'BIẾN VÀ HẰNG SỐ', hintText: 'Đại lượng trong chương trình dùng để lưu trữ dữ liệu có thể thay đổi hoặc cố định.', explanation: 'Biến số (Variable) là ô nhớ có tên lưu trữ giá trị được cập nhật liên tục trong quá trình chạy chương trình.', imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'CẤU TRÚC RẼ NHÁNH', hintText: 'Câu lệnh điều kiện IF - ELSE kiểm tra đúng/sai để quyết định hành động tiếp theo.', explanation: 'Cấu trúc rẽ nhánh giúp chương trình đưa ra quyết định thông minh tùy thuộc vào hoàn cảnh đầu vào.', imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'SỬA LỖI CHƯƠNG TRÌNH', hintText: 'Quá trình phát hiện và khắc phục lỗi lập trình (Bug & Debugging).', explanation: 'Gỡ lỗi (Debug) là kỹ năng quan trọng giúp rèn luyện tính kiên nhẫn và tư duy phản biện cho lập trình viên.', imageUrl: 'https://images.unsplash.com/photo-1580894732488-825501869e5d?w=800&auto=format&fit=crop&q=80' }
    ]
  },
  // 4. TIN HỌC 9
  {
    code: 'TIN_HOC_9',
    title: 'Tin Học 9: Cơ Sở Dữ Liệu & Trí Tuệ Nhân Tạo',
    schoolLevel: 'secondary',
    gradeLevel: 9,
    questions: [
      { answerText: 'CƠ SỞ DỮ LIỆU', hintText: 'Tập hợp dữ liệu có cấu trúc được lưu trữ trên máy chủ để truy vấn (Database).', explanation: 'Cơ sở dữ liệu (Database) là trái tim của mọi ứng dụng ngân hàng, trường học và mạng xã hội.', imageUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'TRÍ TUỆ NHÂN TẠO', hintText: 'Công nghệ mô phỏng trí thông minh của con người (AI, ChatGPT, Gemini).', explanation: 'AI đang thay đổi cách con người làm việc, học tập và sáng tạo tri thức trong thế kỷ 21.', imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'AN NINH MẠNG', hintText: 'Hoạt động bảo vệ hệ thống máy tính và mạng viễn thông khỏi các cuộc tấn công số.', explanation: 'An ninh mạng là lĩnh vực then chốt bảo vệ an toàn quốc gia và quyền riêng tư cá nhân.', imageUrl: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'KỸ SƯ PHẦN MỀM', hintText: 'Nghề nghiệp chuyên thiết kế, lập trình và bảo trì các hệ thống phần mềm.', explanation: 'Kỹ sư phần mềm là nghề có nhu cầu nhân lực rất cao và đóng vai trò thúc đẩy chuyển đổi số quốc gia.', imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'MÃ HÓA DỮ LIỆU', hintText: 'Kỹ thuật chuyển đổi thông tin sang dạng ký tự bí mật để chống nghe lén.', explanation: 'Mã hóa (Encryption) bảo vệ an toàn cho giao dịch chuyển tiền trực tuyến và mật khẩu tài khoản.', imageUrl: 'https://images.unsplash.com/photo-1510511459019-5dda7724fd87?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'TRUY VẤN DỮ LIỆU', hintText: 'Hành động tìm kiếm, lọc và trích xuất thông tin từ kho dữ liệu bằng ngôn ngữ SQL.', explanation: 'Truy vấn SQL (Structured Query Language) là tiêu chuẩn vàng để giao tiếp với cơ sở dữ liệu quan hệ.', imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80' }
    ]
  },
  // 5. CÔNG NGHỆ 6
  {
    code: 'CONG_NGHE_6',
    title: 'Công Nghệ 6: Nhà Ở Thông Minh & Dinh Dưỡng Gia Đình',
    schoolLevel: 'secondary',
    gradeLevel: 6,
    questions: [
      { answerText: 'NGÔI NHÀ THÔNG MINH', hintText: 'Ngôi nhà trang bị hệ thống tự động điều khiển đèn, nhiệt độ, an ninh từ xa qua điện thoại.', explanation: 'Smart Home giúp nâng cao tiện nghi sống, tiết kiệm điện năng và bảo vệ an toàn cho gia đình.', imageUrl: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'BẢO QUẢN THỰC PHẨM', hintText: 'Phương pháp bảo quản độ tươi ngon, ngừa ôi thiu trong tủ lạnh hoặc phơi khô, hút chân không.', explanation: 'Bảo quản đúng cách giúp giữ nguyên giá trị dinh dưỡng và tránh ngộ độc thực phẩm.', imageUrl: 'https://images.unsplash.com/photo-1584473457406-6240486418e9?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'TIẾT KIỆM NĂNG LƯỢNG', hintText: 'Tận dụng ánh sáng mặt trời, gió tự nhiên và tắt thiết bị điện khi ra khỏi phòng.', explanation: 'Sử dụng năng lượng tiết kiệm và hiệu quả giúp bảo vệ môi trường và giảm chi tiêu gia đình.', imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'TRANG PHỤC HỢP THỜI TIẾT', hintText: 'Cách lựa chọn quần áo ấm áp vào mùa đông, thoáng mát thấm mồ hôi vào mùa hè.', explanation: 'Trang phục phù hợp giúp bảo vệ sức khỏe và thể hiện phong cách lịch sự, nhã nhặn.', imageUrl: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'BỮA ĂN HỢP LÝ', hintText: 'Bữa ăn cân đối đủ 4 nhóm dưỡng chất: chất bột đường, chất đạm, chất béo, vitamin và khoáng chất.', explanation: 'Dinh dưỡng hợp lý giúp cơ thể học sinh phát triển toàn diện cả về thể chất lẫn trí tuệ.', imageUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'NỒI CƠM ĐIỆN', hintText: 'Đồ dùng điện biến đổi điện năng thành nhiệt năng để nấu chín cơm tự động.', explanation: 'Nồi cơm điện là đồ dùng điện nhiệt phổ biến nhất trong mọi gian bếp gia đình Việt Nam.', imageUrl: 'https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?w=800&auto=format&fit=crop&q=80' }
    ]
  },
  // 6. CÔNG NGHỆ 7
  {
    code: 'CONG_NGHE_7',
    title: 'Công Nghệ 7: Nông Nghiệp Hữu Cơ & Thủy Sản Xanh',
    schoolLevel: 'secondary',
    gradeLevel: 7,
    questions: [
      { answerText: 'TRỒNG TRỌT HỮU CƠ', hintText: 'Phương pháp canh tác rau quả không dùng phân bón hóa học và thuốc trừ sâu độc hại.', explanation: 'Nông nghiệp hữu cơ tạo ra thực phẩm sạch, an toàn cho người tiêu dùng và giữ đất luôn màu mỡ.', imageUrl: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'NUÔI THỦY SẢN SẠCH', hintText: 'Kỹ thuật nuôi cá, tôm trong môi trường nước được kiểm soát và thức ăn vi sinh an toàn.', explanation: 'Nuôi thủy sản công nghệ cao bảo vệ nguồn lợi thủy sinh và gia tăng giá trị kinh tế xuất khẩu.', imageUrl: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'BẢO VỆ RỪNG ĐẦU NGUỒN', hintText: 'Hành động trồng rừng và ngăn chặn chặt phá rừng để chống xói mòn, giữ nguồn nước.', explanation: 'Rừng là lá phổi xanh điều hòa khí hậu và lá chắn phòng chống thiên tai lũ quét hiệu quả nhất.', imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'TIÊM PHÒNG VẮC XIN', hintText: 'Biện pháp tạo miễn dịch chủ động phòng ngừa dịch bệnh lây lan ở gia súc, gia cầm.', explanation: 'Phòng bệnh hơn chữa bệnh là nguyên tắc cốt lõi trong chăn nuôi bền vững.', imageUrl: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'PHÂN BÓN VI SINH', hintText: 'Chế phẩm chứa các vi sinh vật có ích giúp phân giải chất dinh dưỡng cho rễ cây hấp thụ.', explanation: 'Phân vi sinh cải tạo đất bạc màu và thân thiện với hệ sinh thái vi sinh vật trong lòng đất.', imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'TƯỚI NƯỚC NHỎ GIỌT', hintText: 'Công nghệ tưới tiết kiệm đưa từng giọt nước và dưỡng chất đến thẳng gốc cây trồng.', explanation: 'Tưới nhỏ giọt tiết kiệm đến 60% lượng nước ngọt và phù hợp với vùng khô hạn, đất cát.', imageUrl: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=800&auto=format&fit=crop&q=80' }
    ]
  },
  // 7. CÔNG NGHỆ 8
  {
    code: 'CONG_NGHE_8',
    title: 'Công Nghệ 8: Cơ Khí Chế Tạo & An Toàn Điện Gia Đình',
    schoolLevel: 'secondary',
    gradeLevel: 8,
    questions: [
      { answerText: 'BẢN VẼ KỸ THUẬT', hintText: 'Bản vẽ mô tả hình dạng, kích thước, vật liệu và yêu cầu kỹ thuật của chi tiết máy.', explanation: 'Bản vẽ kỹ thuật là ngôn ngữ chung quốc tế của các kỹ sư và thợ cơ khí chế tạo.', imageUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'AN TOÀN ĐIỆN GIA ĐÌNH', hintText: 'Lắp đặt Aptomat chống giật, nối đất vỏ kim loại và không chạm tay ướt vào ổ cắm.', explanation: 'Tuân thủ quy tắc an toàn điện giúp phòng tránh triệt để tai nạn nguy hiểm và cháy nổ.', imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'TRUYỀN CHUYỂN ĐỘNG', hintText: 'Cơ cấu bánh răng, dây đai truyền lực quay từ trục động cơ sang trục máy làm việc.', explanation: 'Cơ cấu truyền động giúp biến đổi tốc độ quay và mô-men xoắn theo yêu cầu làm việc.', imageUrl: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'DỤNG CỤ CƠ KHÍ', hintText: 'Bộ dụng cụ bao gồm cờ lê, mỏ lết, búa, kìm, tua vít dùng để sửa chữa máy móc gia đình.', explanation: 'Sử dụng thành thạo dụng cụ cơ khí cầm tay là kỹ năng thực hành quan trọng trong môn Công nghệ 8.', imageUrl: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'HÌNH CHIẾU VUÔNG GÓC', hintText: 'Phương pháp biểu diễn vật thể lên mặt phẳng chiếu đứng, chiếu bằng và chiếu cạnh.', explanation: 'Ba hình chiếu vuông góc giúp tái hiện trọn vẹn không gian 3 chiều của một vật thể kỹ thuật.', imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'VẬT LIỆU KIM LOẠI', hintText: 'Nhóm vật liệu dẫn điện và dẫn nhiệt tốt như sắt, thép, đồng, nhôm trong cơ khí.', explanation: 'Kim loại và hợp kim là vật liệu cơ bản tạo nên khung vỏ và chi tiết chuyển động của máy móc.', imageUrl: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800&auto=format&fit=crop&q=80' }
    ]
  },
  // 8. CÔNG NGHỆ 9
  {
    code: 'CONG_NGHE_9',
    title: 'Công Nghệ 9: Mạng Điện Trong Nhà & Năng Lượng Mặt Trời',
    schoolLevel: 'secondary',
    gradeLevel: 9,
    questions: [
      { answerText: 'MẠNG ĐIỆN TRONG NHÀ', hintText: 'Hệ thống dây dẫn, công tắc, bảng điện phân phối điện năng 220V đến các phòng.', explanation: 'Mạng điện trong nhà cần được thiết kế mạch điện song song để các tải hoạt động độc lập.', imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'NĂNG LƯỢNG MẶT TRỜI', hintText: 'Tấm pin quang điện chuyển đổi ánh sáng mặt trời thành nguồn điện sạch.', explanation: 'Điện mặt trời mái nhà là xu hướng năng lượng tái tạo phát triển mạnh mẽ theo định hướng quốc gia.', imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'CÔNG TẮC BA CỰC', hintText: 'Loại công tắc dùng trong mạch đèn cầu thang để bật tắt một bóng đèn ở hai vị trí khác nhau.', explanation: 'Mạch đèn cầu thang dùng 2 công tắc ba cực điều khiển 1 đèn là bài thực hành tiêu biểu của Công nghệ 9.', imageUrl: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'CẢM BIẾN TỰ ĐỘNG', hintText: 'Thiết bị nhận biết chuyển động của con người hoặc độ sáng môi trường để tự động bật đèn.', explanation: 'Cảm biến (Sensor) là thành phần đầu vào giúp hệ thống tự động hóa phản hồi thông minh.', imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'BÚT THỬ ĐIỆN', hintText: 'Dụng cụ kiểm tra nhanh xem ổ cắm hoặc vỏ thiết bị có bị rò rỉ điện hay không.', explanation: 'Kiểm tra bằng bút thử điện trước khi chạm vào dây dẫn là quy tắc sống còn trong nghề điện.', imageUrl: 'https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'ĐỒNG HỒ VẠN NĂNG', hintText: 'Thiết bị đo điện đa năng: đo hiệu điện thế (V), cường độ dòng điện (A) và điện trở (Ohm).', explanation: 'Đồng hồ VOM giúp thợ điện chẩn đoán chính xác sự cố đứt mạch và đo thông số linh kiện.', imageUrl: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&auto=format&fit=crop&q=80' }
    ]
  },
  // 9. HĐTN-HN 6
  {
    code: 'HDTN_HN_6',
    title: 'HĐTN-HN 6: Tình Bạn Học Đường & Tôn Sư Trọng Đạo',
    schoolLevel: 'secondary',
    gradeLevel: 6,
    questions: [
      { answerText: 'TÌNH BẠN TRONG SÁNG', hintText: 'Mối quan hệ bạn bè chân thành, luôn giúp đỡ nhau cùng tiến bộ trong học tập.', explanation: 'Tình bạn đẹp tuổi học trò là điểm tựa tinh thần quý giá giúp mỗi học sinh hoàn thiện nhân cách.', imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'LẮNG NGHE TÍCH CỰC', hintText: 'Kỹ năng tập trung chú ý, thấu hiểu cảm xúc của người đối diện khi giao tiếp.', explanation: 'Lắng nghe tích cực giúp xóa bỏ bất đồng và tạo sự tin cậy trong các mối quan hệ học đường.', imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'QUẢN LÝ THỜI GIAN', hintText: 'Cách sắp xếp thời gian biểu học tập, vui chơi và nghỉ ngơi một cách khoa học.', explanation: 'Kỹ năng quản lý thời gian giúp học sinh giảm căng thẳng và đạt kết quả học tập tối ưu.', imageUrl: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'TÔN SƯ TRỌNG ĐẠO', hintText: 'Truyền thống đạo lý tốt đẹp bày tỏ lòng kính trọng và biết ơn công lao Thầy Cô giáo.', explanation: 'Tôn sư trọng đạo là nét đẹp văn hóa ngàn đời của dân tộc Việt Nam được giáo dục trong GDPT 2018.', imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'GIA ĐÌNH YÊU THƯƠNG', hintText: 'Mái ấm nơi cha mẹ và con cái sẻ chia, động viên nhau vượt qua thử thách.', explanation: 'Tình cảm gia đình ấm áp là cội nguồn sức mạnh và bến đỗ bình yên của mỗi con người.', imageUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'LÒNG TỰ TRỌNG', hintText: 'Ý thức giữ gìn phẩm giá, không gian dối trong thi cử và có trách nhiệm với lời hứa.', explanation: 'Lòng tự trọng là kim chỉ nam giúp học sinh đứng vững trước những cám dỗ sai trái.', imageUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800&auto=format&fit=crop&q=80' }
    ]
  },
  // 10. HĐTN-HN 7
  {
    code: 'HDTN_HN_7',
    title: 'HĐTN-HN 7: Kiểm Soát Cảm Xúc & Hoạt Động Xã Hội',
    schoolLevel: 'secondary',
    gradeLevel: 7,
    questions: [
      { answerText: 'KIỂM SOÁT CẢM XÚC', hintText: 'Khả năng giữ bình tĩnh, làm chủ sự nóng giận khi gặp tình huống bất như ý.', explanation: 'Làm chủ cảm xúc giúp học sinh xử lý xung đột ôn hòa và xây dựng môi trường học đường không bạo lực.', imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'HOẠT ĐỘNG THIỆN NGUYỆN', hintText: 'Việc chung tay quyên góp sách vở, giúp đỡ các bạn học sinh có hoàn cảnh khó khăn vùng cao.', explanation: 'Hoạt động nhân đạo giúp lan tỏa tình yêu thương và bồi dưỡng lòng trắc ẩn cho thanh thiếu niên.', imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'TÔN TRỌNG SỰ KHÁC BIỆT', hintText: 'Thái độ đón nhận tích cực sở thích, hoàn cảnh và cá tính riêng của mỗi người xung quanh.', explanation: 'Tôn trọng sự đa dạng là nền tảng để xây dựng tập thể lớp đoàn kết và tôn trọng lẫn nhau.', imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'BẢO VỆ MÔI TRƯỜNG', hintText: 'Phân loại rác tại nguồn, hạn chế sử dụng túi nilon và rác thải nhựa dùng một lần.', explanation: 'Ý thức bảo vệ môi trường sống từ những hành động nhỏ giúp Trái Đất mãi xanh tươi.', imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'LÒNG TRẮC ẨN', hintText: 'Cảm xúc rung động và mong muốn giúp đỡ khi chứng kiến nỗi đau của đồng loại.', explanation: 'Lòng trắc ẩn là hạt giống của đạo đức và là thước đo giá trị nhân văn của con người.', imageUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'KỸ NĂNG TỪ CHỐI', hintText: 'Sự dũng cảm nói "Không" một cách lịch sự trước những lời rủ rê xấu của bạn bè.', explanation: 'Biết từ chối đúng lúc giúp học sinh tự bảo vệ bản thân khỏi các tệ nạn xã hội.', imageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&auto=format&fit=crop&q=80' }
    ]
  },
  // 11. HĐTN-HN 8
  {
    code: 'HDTN_HN_8',
    title: 'HĐTN-HN 8: Quản Lý Tài Chính & Hình Ảnh Bản Thân',
    schoolLevel: 'secondary',
    gradeLevel: 8,
    questions: [
      { answerText: 'QUẢN LÝ TÀI CHÍNH', hintText: 'Thói quen ghi chép chi tiêu, nuôi heo đất và phân biệt rõ ràng giữa Cần (Needs) và Muốn (Wants).', explanation: 'Giáo dục tài chính sớm giúp học sinh có trách nhiệm với đồng tiền và rèn luyện tính tiết kiệm.', imageUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'HÌNH ẢNH BẢN THÂN', hintText: 'Phong cách ứng xử chuẩn mực, lời nói văn minh và sự tự tin về điểm mạnh của chính mình.', explanation: 'Xây dựng thương hiệu cá nhân tích cực giúp tạo ấn tượng tốt đẹp trong mắt thầy cô và bạn bè.', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'VĂN HÓA MẠNG XÃ HỘI', hintText: 'Hành vi không bình luận công kích, không chia sẻ tin giả ác ý trên Facebook, TikTok.', explanation: 'Văn hóa ứng xử mạng văn minh giúp bảo vệ sức khỏe tinh thần cho cộng đồng mạng.', imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'KỸ NĂNG THUYẾT TRÌNH', hintText: 'Khả năng đứng trước lớp trình bày bài tập dự án một cách tự tin, mạch lạc và lôi cuốn.', explanation: 'Kỹ năng nói trước đám đông là một trong những năng lực thiết yếu của công dân toàn cầu.', imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'GIẢI QUYẾT XUNG ĐỘT', hintText: 'Biện pháp hòa giải thông qua đối thoại xây dựng và tìm giải pháp đôi bên cùng có lợi.', explanation: 'Giải quyết xung đột ôn hòa giúp giữ gìn tình bạn lâu bền và tạo môi trường học tập hạnh phúc.', imageUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'MỤC TIÊU CUỘC ĐỜI', hintText: 'Tầm nhìn về nghề nghiệp và lý tưởng sống mà mỗi người theo đuổi trong tương lai.', explanation: 'Xác định mục tiêu rõ ràng giúp học sinh định hướng nỗ lực và không bị lạc lối.', imageUrl: 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=800&auto=format&fit=crop&q=80' }
    ]
  },
  // 12. HĐTN-HN 9
  {
    code: 'HDTN_HN_9',
    title: 'HĐTN-HN 9: Chọn Trường THPT & Hành Trang Tương Lai',
    schoolLevel: 'secondary',
    gradeLevel: 9,
    questions: [
      { answerText: 'ĐỊNH HƯỚNG NGHỀ NGHIỆP', hintText: 'Quá trình tìm hiểu sở thích, năng lực cá nhân và nhu cầu xã hội để chọn ngành nghề tương lai.', explanation: 'Định hướng nghề nghiệp sớm giúp học sinh chọn đúng tổ hợp môn học ở cấp THPT mới.', imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'LẬP KẾ HOẠCH HỌC TẬP', hintText: 'Sắp xếp thời gian biểu, đặt mục tiêu điểm số và các bước ôn thi vào lớp 10 rõ ràng.', explanation: 'Kế hoạch học tập chi tiết giúp học sinh tự chủ, giảm áp lực và tự tin bước vào kỳ thi quan trọng.', imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'TINH THẦN ĐỒNG ĐỘI', hintText: 'Sự gắn kết, hỗ trợ lẫn nhau giữa các thành viên để cùng hoàn thành mục tiêu dự án chung.', explanation: 'Tinh thần Teamwork giúp nhân đôi sức mạnh và tạo ra những thành quả xuất sắc vượt bậc.', imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'KỸ NĂNG THÍCH ỨNG', hintText: 'Khả năng nhanh chóng hòa nhập và linh hoạt xử lý khi môi trường sống hoặc học tập thay đổi.', explanation: 'Trong thế giới biến đổi nhanh chóng, khả năng thích ứng là chìa khóa then chốt để thành công.', imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'TỰ HỌC SUỐT ĐỜI', hintText: 'Tinh thần chủ động tìm tòi, đọc sách và nâng cao kiến thức liên tục mọi lúc mọi nơi.', explanation: 'Tự học là năng lực quan trọng nhất để không bị tụt hậu trong kỷ nguyên trí tuệ nhân tạo.', imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'TRẢI NGHIỆM THỰC TẾ', hintText: 'Các chuyến đi thực địa, tham quan doanh nghiệp để tìm hiểu thực tế công việc.', explanation: 'Học đi đôi với hành giúp biến kiến thức sách vở thành năng lực thực tiễn sống động.', imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80' }
    ]
  },
  // 13. TIẾNG VIỆT TIỂU HỌC: THÀNH NGỮ TỤC NGỮ
  {
    code: 'TIENG_VIET_TH',
    title: 'Tiếng Việt: Đuổi Hình Bắt Chữ Ca Dao Tục Ngữ',
    schoolLevel: 'primary',
    gradeLevel: 4,
    questions: [
      { answerText: 'ĂN QUẢ NHỚ KẺ TRỒNG CÂY', hintText: 'Câu tục ngữ nhắc nhở con người phải luôn biết ơn những người đã giúp đỡ mình.', explanation: 'Uống nước nhớ nguồn, ăn quả nhớ kẻ trồng cây là bài học đạo lý căn bản trong Tiếng Việt tiểu học.', imageUrl: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'LÁ LÀNH ĐÙM LÁ RÁCH', hintText: 'Thành ngữ ca ngợi tinh thần tương thân tương ái, người khá giả giúp đỡ người nghèo khó.', explanation: 'Truyền thống lá lành đùm lá rách thể hiện tinh thần đùm bọc yêu thương của dân tộc Việt Nam.', imageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'HỌC THẦY KHÔNG TÀY HỌC BẠN', hintText: 'Lời khuyên học hỏi từ thầy cô và cả từ bạn bè cùng trang lứa để cùng tiến bộ.', explanation: 'Học hỏi từ bạn bè là phương pháp học tập nhóm tích cực được khuyến khích trong SGK mới.', imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'ĐẤT LÀNH CHIM ĐẬU', hintText: 'Nơi có môi trường sống tốt đẹp, yên bình sẽ thu hút nhân tài và muôn loài về sinh sống.', explanation: 'Câu thành ngữ ví von nơi thanh bình thịnh vượng luôn là nơi đón nhận nhiều điều may mắn.', imageUrl: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'MƯA THUẬN GIÓ HÒA', hintText: 'Thời tiết khí hậu êm dịu, thuận lợi cho mùa màng tốt tươi và cuộc sống ấm no.', explanation: 'Ước vọng mưa thuận gió hòa là ước mơ ngàn đời của cư dân nông nghiệp lúa nước Việt Nam.', imageUrl: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'CÔNG CHA NGHĨA MẸ', hintText: 'Công ơn sinh thành dưỡng dục cao dày như núi Thái Sơn, rộng lớn như biển Đông.', explanation: 'Hiếu thảo với cha mẹ là đạo đức nền tảng đầu tiên trong cuộc đời của mỗi người con.', imageUrl: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=800&auto=format&fit=crop&q=80' }
    ]
  },
  // 14. TOÁN HỌC TIỂU HỌC & LOGIC VUI
  {
    code: 'TOAN_TH',
    title: 'Toán Học Vui: Hình Khối & Thử Thách Tư Duy',
    schoolLevel: 'primary',
    gradeLevel: 5,
    questions: [
      { answerText: 'HÌNH TAM GIÁC ĐỀU', hintText: 'Hình học có 3 cạnh bằng nhau và 3 góc bằng nhau (mỗi góc 60 độ).', explanation: 'Hình tam giác đều có tính chất đối xứng hoàn hảo và ứng dụng rất nhiều trong kiến trúc xây dựng.', imageUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'PHÂN SỐ TỐI GIẢN', hintText: 'Phân số có tử số và mẫu số không cùng chia hết cho số nào khác ngoài 1.', explanation: 'Rút gọn phân số về dạng tối giản là kỹ năng tính toán trọng tâm của Toán lớp 4 và 5.', imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'ĐƯỜNG KÍNH HÌNH TRÒN', hintText: 'Đoạn thẳng đi qua tâm hình tròn và nối hai điểm trên đường tròn, dài gấp đôi bán kính.', explanation: 'Đường kính là trục đối xứng của hình tròn và dùng để tính chu vi, diện tích.', imageUrl: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'HÌNH HỘP CHỮ NHẬT', hintText: 'Khối không gian có 6 mặt đều là hình chữ nhật (như bao diêm hoặc thùng carton).', explanation: 'Hình hộp chữ nhật có 8 đỉnh, 12 cạnh và là bài học mở đầu về hình học không gian tiểu học.', imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'PHÉP TÍNH NHÂN NHẨM', hintText: 'Mẹo tính nhanh kết quả của hai số mà không cần đặt bút tính trên giấy.', explanation: 'Tính nhẩm rèn luyện sự nhanh nhạy của não bộ và khả năng ước lượng số liệu thực tế.', imageUrl: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'TỶ SỐ PHẦN TRĂM', hintText: 'Tỷ số giữa hai số được quy về mẫu số là 100 và biểu diễn bằng ký hiệu (%).', explanation: 'Tỷ số phần trăm ứng dụng liên tục trong đời sống: giảm giá khuyến mãi, lãi suất ngân hàng.', imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&auto=format&fit=crop&q=80' }
    ]
  },
  // 15. KHOA HỌC TỰ NHIÊN 7
  {
    code: 'KHTN_7',
    title: 'KHTN 7: Bí Mật Sinh Học & Vật Lý Lý Thú',
    schoolLevel: 'secondary',
    gradeLevel: 7,
    questions: [
      { answerText: 'QUANG HỢP Ở THỰC VẬT', hintText: 'Quá trình lá cây dùng ánh sáng mặt trời biến nước và CO2 thành chất dinh dưỡng và khí O2.', explanation: 'Quang hợp là phản ứng sinh hóa quan trọng nhất duy trì sự sống và dưỡng khí trên Trái Đất.', imageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'KHÚC XẠ ÁNH SÁNG', hintText: 'Hiện tượng tia sáng bị gãy khúc khi truyền xiên góc qua mặt phân cách hai môi trường trong suốt.', explanation: 'Khúc xạ ánh sáng tạo ra ảo ảnh nước trên đường nhựa mùa hè và giải thích nguyên lý kính đeo mắt.', imageUrl: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'TẾ BÀO ĐỘNG VẬT', hintText: 'Đơn vị cấu trúc và chức năng cơ bản của mọi cơ thể sinh vật sống.', explanation: 'Tế bào gồm màng sinh chất, tế bào chất và nhân mang thông tin di truyền ADN.', imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'TRỌNG LỰC TRÁI ĐẤT', hintText: 'Lực hút của Trái Đất kéo mọi vật thể rơi về phía tâm quả đất (lực hấp dẫn).', explanation: 'Trọng lực giữ cho bầu khí quyển không bị bay vào vũ trụ và giúp con người đứng vững trên mặt đất.', imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'VÒNG TUẦN HOÀN NƯỚC', hintText: 'Quá trình nước bốc hơi tạo thành mây, ngưng tụ thành mưa rơi xuống đất rồi chảy ra biển.', explanation: 'Vòng tuần hoàn nước điều hòa khí hậu toàn cầu và phân phối nguồn nước ngọt cho sự sống.', imageUrl: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'NGUYÊN TỬ VÀ PHÂN TỬ', hintText: 'Hạt vô cùng nhỏ cấu tạo nên mọi chất gồm hạt nhân mang điện dương và electron mang điện âm.', explanation: 'Nguyên tử là khối xây dựng cơ bản của bảng tuần hoàn hóa học Men-đê-lê-ép.', imageUrl: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800&auto=format&fit=crop&q=80' }
    ]
  },
  // 16. LỊCH SỬ & ĐỊA LÍ 6
  {
    code: 'LICH_SU_DIA_LI_6',
    title: 'Lịch Sử & Địa Lí: Non Sông Gấm Vóc & Di Sản Hào Hùng',
    schoolLevel: 'secondary',
    gradeLevel: 6,
    questions: [
      { answerText: 'CHIẾN THẮNG BẠCH ĐẰNG', hintText: 'Trận thủy chiến lừng lẫy với cọc gỗ ngầm đánh tan quân xâm lược phương Bắc.', explanation: 'Chiến thắng Bạch Đằng năm 938 của Ngô Quyền mở ra kỷ nguyên độc lập lâu dài cho dân tộc.', imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'VĂN MIẾU QUỐC TỬ GIÁM', hintText: 'Trường đại học đầu tiên của Việt Nam thờ Khổng Tử và lưu danh bia tiến sĩ.', explanation: 'Văn Miếu là biểu tượng của tinh thần hiếu học và trọng dụng nhân tài của nước ta.', imageUrl: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'ĐỈNH PHAN XI PĂNG', hintText: 'Nóc nhà Đông Dương với độ cao 3.143 mét thuộc dãy núi Hoàng Liên Sơn.', explanation: 'Phan-xi-păng là đỉnh núi cao nhất bán đảo Đông Dương, niềm tự hào của địa lí Việt Nam.', imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'ĐỒNG BẰNG SÔNG CỬU LONG', hintText: 'Vựa lúa và trái cây lớn nhất cả nước do dòng sông Mê Kông bồi đắp phù sa màu mỡ.', explanation: 'Vùng Tây Nam Bộ nổi tiếng với chợ nổi, miệt vườn trù phú và nguồn thủy sản dồi dào.', imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'TRỐNG ĐỒNG ĐÔNG SƠN', hintText: 'Bảo vật quốc gia biểu tượng cho nền văn minh nông nghiệp lúa nước thời đại Hùng Vương.', explanation: 'Hoa văn chim lạc và mặt trời trên trống đồng phản ánh đời sống tinh thần phong phú của người Việt cổ.', imageUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'HANG SƠN ĐOÒNG', hintText: 'Hang động tự nhiên lớn nhất thế giới nằm trong Vườn quốc gia Phong Nha - Kẻ Bàng.', explanation: 'Sơn Đoòng có hệ sinh thái rừng nhiệt đới riêng và là kỳ quan địa chất vô giá của Việt Nam.', imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80' }
    ]
  },
  // 17. TIẾNG ANH THCS
  {
    code: 'TIENG_ANH_THCS',
    title: 'English Catch Word: Từ Vựng Tiếng Anh Sinh Động',
    schoolLevel: 'secondary',
    gradeLevel: 8,
    questions: [
      { answerText: 'ARTIFICIAL INTELLIGENCE', hintText: 'The simulation of human intelligence in machines (AI).', explanation: 'Trí tuệ nhân tạo là từ khóa công nghệ phổ biến nhất thế giới hiện nay.', imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'ENVIRONMENTAL PROTECTION', hintText: 'The practice of protecting the natural environment for future generations.', explanation: 'Bảo vệ môi trường là chủ đề thảo luận trọng tâm trong chương trình Tiếng Anh toàn cầu.', imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'ONLINE LEARNING', hintText: 'Education that takes place over the Internet using computers and Zoom.', explanation: 'Học trực tuyến đã trở thành phương thức tiếp cận tri thức linh hoạt của học sinh thời đại số.', imageUrl: 'https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'SOLAR ENERGY', hintText: 'Radiant light and heat from the Sun that is harnessed using solar panels.', explanation: 'Năng lượng mặt trời là nguồn năng lượng sạch vô tận thay thế nhiên liệu hóa thạch.', imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'HEALTHY LIFESTYLE', hintText: 'Living habits that include good nutrition, daily exercise and adequate sleep.', explanation: 'Lối sống lành mạnh giúp học sinh có thể lực sung mãn và tinh thần minh mẫn để học tập tốt.', imageUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'GLOBAL CITIZEN', hintText: 'A person who understands wider world and their place in it, taking active role in community.', explanation: 'Công dân toàn cầu là mục tiêu đào tạo của chương trình GDPT 2018 hội nhập quốc tế.', imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80' }
    ]
  },
  // 18. TIN HỌC 10 (THPT)
  {
    code: 'TIN_HOC_10',
    title: 'Tin Học 10: Khoa Học Máy Tính & Lập Trình Python',
    schoolLevel: 'high',
    gradeLevel: 10,
    questions: [
      { answerText: 'NGÔN NGỮ LẬP TRÌNH PYTHON', hintText: 'Ngôn ngữ lập trình bậc cao cú pháp trong sáng, mạnh mẽ về AI và phân tích dữ liệu.', explanation: 'Python là ngôn ngữ lập trình chính thức được đưa vào chương trình Tin học 10 GDPT 2018.', imageUrl: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'KIỂU DỮ LIỆU DANH SÁCH', hintText: 'Cấu trúc dữ liệu List trong Python dùng để chứa nhiều phần tử tuần tự trong dấu ngoặc vuông [].', explanation: 'List là kiểu dữ liệu linh hoạt nhất trong Python hỗ trợ thêm, xóa, sửa phần tử dễ dàng.', imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'ĐỘ PHỨC TẠP THUẬT TOÁN', hintText: 'Đại lượng Big-O đo lường thời gian chạy và dung lượng bộ nhớ thuật toán tiêu thụ.', explanation: 'Đánh giá độ phức tạp giúp lập trình viên chọn thuật toán tối ưu cho dữ liệu lớn (Big Data).', imageUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'HỆ THỐNG ĐIỀU HÀNH MỞ', hintText: 'Hệ điều hành mã nguồn mở như Linux/Ubuntu cho phép cộng đồng cùng phát triển miễn phí.', explanation: 'Linux là nền tảng máy chủ chiếm hơn 90% các trung tâm dữ liệu đám mây trên toàn thế giới.', imageUrl: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'INTERNET VẠN VẬT', hintText: 'Mạng lưới kết nối hàng tỷ thiết bị thông minh qua Internet (IoT - Internet of Things).', explanation: 'IoT kết nối ô tô tự lái, đồng hồ thông minh và cảm biến nông nghiệp vào mạng lưới toàn cầu.', imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80' },
      { answerText: 'HÀM TRONG LẬP TRÌNH', hintText: 'Khối lệnh có tên được định nghĩa bằng từ khóa "def" để tái sử dụng nhiều lần.', explanation: 'Chia nhỏ chương trình thành các hàm (Function) giúp mã nguồn sạch sẽ và dễ bảo trì.', imageUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&auto=format&fit=crop&q=80' }
    ]
  }
];

async function seedAll() {
  console.log('🚀 Bắt đầu cập nhật Môn học và nạp 100+ Câu hỏi chuẩn GDPT 2018 lên Supabase...');

  // 1. Nạp Môn học
  await apiPost('subjects', ALL_SUBJECTS);
  console.log('✓ Đã cập nhật 18 Môn học theo GDPT 2018');

  // 2. Lấy Map Subjects
  const subjects = await apiGet('subjects?select=id,code');
  const subMap = {};
  if (Array.isArray(subjects)) {
    subjects.forEach(s => { subMap[s.code] = s.id; });
  }

  let totalGames = 0;
  let totalQuestions = 0;

  for (let i = 0; i < ALL_SEED_GAMES.length; i++) {
    const item = ALL_SEED_GAMES[i];
    const hexIndex = (i + 1).toString(16).padStart(4, '0');
    const gameId = `a0000000-${hexIndex}-4000-8000-000000000001`;
    const subjectId = subMap[item.code] || null;

    // 3. Tạo Game
    const gameData = [{
      id: gameId,
      title: item.title,
      description: `Bộ câu đố tương tác Đuổi hình bắt chữ chủ đề ${item.title} chuẩn GDPT 2018.`,
      subject_id: subjectId,
      game_type: 'catch_word',
      school_level: item.schoolLevel,
      grade_level: item.gradeLevel,
      thumbnail_url: item.questions[0].imageUrl,
      total_questions: item.questions.length,
      plays_count: 90 + (i * 15),
      is_published: true,
      author_id: 'd9b1c1e0-0001-4000-8000-000000000001',
    }];
    await apiPost('games', gameData);
    totalGames++;

    // 4. Tạo Questions
    const questionsData = item.questions.map((q, idx) => ({
      id: `b0000000-${hexIndex}-4000-8000-${(idx + 1).toString(16).padStart(12, '0')}`,
      game_id: gameId,
      image_url: q.imageUrl,
      answer_text: q.answerText,
      hint_text: q.hintText,
      explanation: q.explanation,
      time_limit_seconds: 45,
      points: 100,
      order_index: idx + 1,
    }));
    await apiPost('game_questions', questionsData);
    totalQuestions += questionsData.length;
  }

  console.log(`🎉 NẠP THÀNH CÔNG ${totalGames} PHÒNG CHƠI VỚI ${totalQuestions} CÂU HỎI HÌNH ẢNH TOÀN DIỆN VÀO SUPABASE DATABASE CLOUD!`);
}

seedAll();
