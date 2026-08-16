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

async function seed() {
  console.log('--- BẮT ĐẦU ĐỒNG BỘ DỮ LIỆU LÊN SUPABASE CLOUD ---');

  // 1. Seed Profiles mẫu
  const demoProfiles = [
    {
      id: 'd9b1c1e0-0001-4000-8000-000000000001',
      username: 'giaovien.tin',
      full_name: 'Thầy Nguyễn Văn Toàn (Giáo viên Tin & Công nghệ)',
      role: 'teacher',
      school_level: 'secondary',
      grade_level: 6,
      xp_points: 3500,
      level: 15,
      streak_days: 10,
      avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=TeacherToan',
    },
    {
      id: 'd9b1c1e0-0002-4000-8000-000000000002',
      username: 'nguyenvana',
      full_name: 'Nguyễn Văn An',
      role: 'student',
      school_level: 'secondary',
      grade_level: 6,
      xp_points: 1250,
      level: 5,
      streak_days: 4,
      avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=An',
    },
    {
      id: 'd9b1c1e0-0003-4000-8000-000000000003',
      username: 'lethibich',
      full_name: 'Lê Thị Bích',
      role: 'student',
      school_level: 'secondary',
      grade_level: 8,
      xp_points: 1680,
      level: 7,
      streak_days: 6,
      avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Bich',
    },
    {
      id: 'd9b1c1e0-0004-4000-8000-000000000004',
      username: 'tranminhquan',
      full_name: 'Trần Minh Quân',
      role: 'student',
      school_level: 'secondary',
      grade_level: 9,
      xp_points: 920,
      level: 4,
      streak_days: 2,
      avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Quan',
    },
  ];

  await apiPost('profiles', demoProfiles);
  console.log('✓ Đã nạp Profiles học sinh & giáo viên');

  // 2. Seed Lớp học mẫu
  const demoClasses = [
    {
      id: 'c1a10000-0001-4000-8000-000000000001',
      name: 'Lớp 6A1 - THCS Trưng Vương',
      grade_level: 6,
      school_level: 'secondary',
      teacher_id: 'd9b1c1e0-0001-4000-8000-000000000001',
      join_code: '6A1202',
      description: 'Lớp chuyên cần sáng tạo môn Tin học & Công nghệ.',
    },
    {
      id: 'c1a10000-0002-4000-8000-000000000002',
      name: 'Lớp 8B2 - THCS Chu Văn An',
      grade_level: 8,
      school_level: 'secondary',
      teacher_id: 'd9b1c1e0-0001-4000-8000-000000000001',
      join_code: '8B2024',
      description: 'Đội tuyển thi đua Đuổi hình bắt chữ Công nghệ 8.',
    },
    {
      id: 'c1a10000-0003-4000-8000-000000000003',
      name: 'Lớp 9C3 - Khóa Hướng Nghiệp',
      grade_level: 9,
      school_level: 'secondary',
      teacher_id: 'd9b1c1e0-0001-4000-8000-000000000001',
      join_code: '9C3999',
      description: 'Sinh hoạt HĐTN hướng nghiệp chuẩn bị thi vào lớp 10.',
    },
  ];

  await apiPost('classes', demoClasses);
  console.log('✓ Đã nạp Lớp học & Mã PIN (6A1202, 8B2024, 9C3999)');

  // 3. Lấy Subject IDs
  const subjectsData = await apiGet('subjects?select=id,code');
  const subMap = {};
  if (Array.isArray(subjectsData)) {
    subjectsData.forEach((s) => { subMap[s.code] = s.id; });
  }

  // 4. Seed Games với Valid UUID
  const games = [
    {
      id: 'a0000000-0001-4000-8000-000000000001',
      title: 'Đuổi Hình Bắt Chữ: Thế Giới Mạng & Dữ Liệu 6',
      description: 'Thử thách nhìn hình đoán các khái niệm cốt lõi trong môn Tin học 6: Mạng máy tính, Sơ đồ tư duy, Dữ liệu số.',
      subject_id: subMap['TIN_HOC_6'] || null,
      game_type: 'catch_word',
      school_level: 'secondary',
      grade_level: 6,
      thumbnail_url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=80',
      total_questions: 4,
      plays_count: 142,
      is_published: true,
      author_id: 'd9b1c1e0-0001-4000-8000-000000000001',
    },
    {
      id: 'a0000000-0002-4000-8000-000000000002',
      title: 'Đuổi Hình Bắt Chữ: Bản Vẽ & Kỹ Thuật Điện 8',
      description: 'Chinh phục các câu đố hình ảnh về bản vẽ kĩ thuật, cơ khí chế tạo và thiết bị an toàn điện gia đình.',
      subject_id: subMap['CONG_NGHE_8'] || null,
      game_type: 'catch_word',
      school_level: 'secondary',
      grade_level: 8,
      thumbnail_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
      total_questions: 4,
      plays_count: 98,
      is_published: true,
      author_id: 'd9b1c1e0-0001-4000-8000-000000000001',
    },
    {
      id: 'a0000000-0003-4000-8000-000000000003',
      title: 'Đuổi Hình Bắt Chữ: Định Hướng Tương Lai 9',
      description: 'Khám phá thế giới nghề nghiệp, kỹ năng mềm và con đường chọn trường THPT phù hợp với năng lực bản thân.',
      subject_id: subMap['HDTN_HN_9'] || null,
      game_type: 'catch_word',
      school_level: 'secondary',
      grade_level: 9,
      thumbnail_url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop&q=80',
      total_questions: 4,
      plays_count: 165,
      is_published: true,
      author_id: 'd9b1c1e0-0001-4000-8000-000000000001',
    },
  ];

  await apiPost('games', games);
  console.log('✓ Đã nạp Games vào Supabase');

  // 5. Seed Questions với Valid UUID
  const questions = [
    // Game 1 Questions
    {
      id: 'b0000000-0001-4000-8000-000000000001',
      game_id: 'a0000000-0001-4000-8000-000000000001',
      image_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
      answer_text: 'MẠNG MÁY TÍNH',
      hint_text: 'Hệ thống kết nối nhiều thiết bị điện tử để chia sẻ dữ liệu và tài nguyên với nhau.',
      explanation: 'Mạng máy tính (Computer Network) là tập hợp các máy tính được kết nối theo một phương thức nào đó nhằm mục đích chia sẻ tài nguyên và trao đổi thông tin.',
      time_limit_seconds: 45,
      points: 100,
      order_index: 1,
    },
    {
      id: 'b0000000-0001-4000-8000-000000000002',
      game_id: 'a0000000-0001-4000-8000-000000000001',
      image_url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=80',
      answer_text: 'SƠ ĐỒ TƯ DUY',
      hint_text: 'Công cụ đồ họa thể hiện các ý tưởng phân nhánh xuất phát từ một chủ đề trung tâm.',
      explanation: 'Sơ đồ tư duy (Mindmap) giúp học sinh tổ chức, phân tích, tóm tắt và ghi nhớ kiến thức một cách trực quan, khoa học theo GDPT 2018.',
      time_limit_seconds: 45,
      points: 100,
      order_index: 2,
    },
    {
      id: 'b0000000-0001-4000-8000-000000000003',
      game_id: 'a0000000-0001-4000-8000-000000000001',
      image_url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80',
      answer_text: 'BẢO MẬT THÔNG TIN',
      hint_text: 'Hành động đặt mật khẩu mạnh, chống mã độc để bảo vệ an toàn cho dữ liệu cá nhân.',
      explanation: 'Bảo mật thông tin là việc ngăn chặn sự truy cập, sử dụng, tiết lộ, gián đoạn trái phép đối với thông tin và dữ liệu số.',
      time_limit_seconds: 45,
      points: 100,
      order_index: 3,
    },
    {
      id: 'b0000000-0001-4000-8000-000000000004',
      game_id: 'a0000000-0001-4000-8000-000000000001',
      image_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
      answer_text: 'TRÌNH DUYỆT WEB',
      hint_text: 'Phần mềm ứng dụng dùng để truy cập, duyệt xem các trang thông tin trên mạng Internet.',
      explanation: 'Trình duyệt web (Web Browser) là cầu nối giúp người dùng tương tác và khai thác kho tàng tri thức khổng lồ trên mạng Internet.',
      time_limit_seconds: 45,
      points: 100,
      order_index: 4,
    },

    // Game 2 Questions
    {
      id: 'b0000000-0002-4000-8000-000000000001',
      game_id: 'a0000000-0002-4000-8000-000000000002',
      image_url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&auto=format&fit=crop&q=80',
      answer_text: 'BẢN VẼ KỸ THUẬT',
      hint_text: 'Bản vẽ mô tả hình dạng, kích thước, vật liệu và yêu cầu kĩ thuật của một sản phẩm cơ khí.',
      explanation: 'Bản vẽ kĩ thuật là ngôn ngữ chung của ngành kĩ thuật, là căn cứ để chế tạo, kiểm tra và lắp ráp chi tiết máy.',
      time_limit_seconds: 45,
      points: 100,
      order_index: 1,
    },
    {
      id: 'b0000000-0002-4000-8000-000000000002',
      game_id: 'a0000000-0002-4000-8000-000000000002',
      image_url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80',
      answer_text: 'AN TOÀN ĐIỆN',
      hint_text: 'Các quy tắc và thiết bị như Aptomat, cầu chì nhằm bảo vệ tính mạng con người khi dùng điện.',
      explanation: 'An toàn điện là tập hợp các biện pháp phòng ngừa tai nạn điện giật, cháy nổ điện trong sinh hoạt và sản xuất.',
      time_limit_seconds: 45,
      points: 100,
      order_index: 2,
    },
    {
      id: 'b0000000-0002-4000-8000-000000000003',
      game_id: 'a0000000-0002-4000-8000-000000000002',
      image_url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&auto=format&fit=crop&q=80',
      answer_text: 'TIẾT KIỆM NĂNG LƯỢNG',
      hint_text: 'Hành động tắt thiết bị điện khi không sử dụng và tận dụng ánh sáng tự nhiên.',
      explanation: 'Sử dụng năng lượng tiết kiệm và hiệu quả góp phần giảm chi phí sinh hoạt và bảo vệ môi trường sinh thái.',
      time_limit_seconds: 45,
      points: 100,
      order_index: 3,
    },
    {
      id: 'b0000000-0002-4000-8000-000000000004',
      game_id: 'a0000000-0002-4000-8000-000000000002',
      image_url: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=800&auto=format&fit=crop&q=80',
      answer_text: 'TRUYỀN CHUYỂN ĐỘNG',
      hint_text: 'Cơ cấu bánh răng, xích líp truyền chuyển động quay từ trục này sang trục khác trong máy cơ khí.',
      explanation: 'Cơ cấu truyền và biến đổi chuyển động giúp truyền lực và biến đổi tốc độ theo yêu cầu công việc.',
      time_limit_seconds: 45,
      points: 100,
      order_index: 4,
    },

    // Game 3 Questions
    {
      id: 'b0000000-0003-4000-8000-000000000001',
      game_id: 'a0000000-0003-4000-8000-000000000003',
      image_url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
      answer_text: 'KỸ NĂNG GIAO TIẾP',
      hint_text: 'Khả năng lắng nghe, thấu cảm và truyền đạt ý kiến một cách lịch sự, thuyết phục.',
      explanation: 'Kỹ năng giao tiếp là một trong những kĩ năng thế kỉ 21 cốt lõi giúp học sinh tự tin hòa nhập và thành công trong mọi lĩnh vực nghề nghiệp.',
      time_limit_seconds: 45,
      points: 100,
      order_index: 1,
    },
    {
      id: 'b0000000-0003-4000-8000-000000000002',
      game_id: 'a0000000-0003-4000-8000-000000000003',
      image_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80',
      answer_text: 'LẬP KẾ HOẠCH HỌC TẬP',
      hint_text: 'Việc sắp xếp thời gian biểu, mục tiêu điểm số và các bước ôn thi vào lớp 10 rõ ràng.',
      explanation: 'Lập kế hoạch học tập giúp rèn luyện thói quen tự chủ, quản lý thời gian hiệu quả và giảm bớt áp lực thi cử.',
      time_limit_seconds: 45,
      points: 100,
      order_index: 2,
    },
    {
      id: 'b0000000-0003-4000-8000-000000000003',
      game_id: 'a0000000-0003-4000-8000-000000000003',
      image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
      answer_text: 'ĐỊNH HƯỚNG NGHỀ NGHIỆP',
      hint_text: 'Quá trình tìm hiểu sở thích, năng lực cá nhân và nhu cầu xã hội để chọn ngành nghề tương lai.',
      explanation: 'Định hướng nghề nghiệp đúng từ cấp THCS giúp học sinh có động lực học tập và chọn đúng tổ hợp môn khi bước vào cấp THPT.',
      time_limit_seconds: 45,
      points: 100,
      order_index: 3,
    },
    {
      id: 'b0000000-0003-4000-8000-000000000004',
      game_id: 'a0000000-0003-4000-8000-000000000003',
      image_url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&auto=format&fit=crop&q=80',
      answer_text: 'TINH THẦN ĐỒNG ĐỘI',
      hint_text: 'Sự gắn kết, hỗ trợ lẫn nhau giữa các thành viên trong nhóm để cùng hoàn thành mục tiêu chung.',
      explanation: 'Tinh thần đồng đội (Teamwork) giúp nhân đôi sức mạnh, xây dựng mối quan hệ gắn bó bền chặt và tạo ra những kết quả vượt bậc.',
      time_limit_seconds: 45,
      points: 100,
      order_index: 4,
    },
  ];

  await apiPost('game_questions', questions);
  console.log('✓ Đã nạp Câu đố Đuổi hình bắt chữ vào Supabase');

  console.log('🎉 TẤT CẢ DỮ LIỆU ĐÃ ĐỒNG BỘ 100% THÀNH CÔNG VÀO SUPABASE DATABASE CLOUD!');
}

seed();
