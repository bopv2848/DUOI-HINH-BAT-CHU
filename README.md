# 🎯 EDUGAME HUB - NỀN TẢNG TRÒ CHƠI HỌC TẬP ĐUỔI HÌNH BẮT CHỮ (GDPT 2018)

Nền tảng Web Game Giáo dục chất lượng cao dành cho học sinh 3 cấp: **Tiểu học**, **THCS** và **THPT** với các môn học trọng tâm bám sát Chương trình Giáo dục Phổ thông 2018:
1. **Công nghệ (Khối 6, 7, 8, 9)**
2. **Hoạt động trải nghiệm, hướng nghiệp (Khối 6, 7, 8, 9)**
3. **Tin học (Khối 6, 7, 8, 9)**

---

## 🚀 Tính Năng Nổi Bật

- **Dynamic UI Theo 3 Cấp Học**:
  - *Tiểu học*: Màu sắc tươi sáng, mascot hoạt hình ngộ nghĩnh, font chữ bo tròn dễ thương.
  - *THCS (Trọng tâm)*: Năng động, tương phản sắc nét, phong cách khám phá vũ trụ tri thức.
  - *THPT*: Phong cách E-sports Minimalist, tập trung vào bảng xếp hạng và số liệu thi đấu.
- **Cơ Chế Game Hóa (Gamification) Toàn Diện**:
  - Thanh kinh nghiệm (XP Bar) thăng cấp độ (Level 1 → Level 20+).
  - Bộ sưu tập Huy hiệu (Badges) độc quyền.
  - Chuỗi Combo Multiplier (x1, x1.5, x2, x2.5, x3 khi đoán đúng liên tục).
  - Web Audio API Sound Synthesizer (chuông đúng, còi sai, combo, level up, đồng hồ đếm ngược tick tick).
  - Hiệu ứng pháo hoa Confetti chúc mừng.
- **Trò Chơi Đuổi Hình Bắt Chữ Cốt Lõi**:
  - Nhìn ảnh đoán chữ tiếng Việt chuẩn GDPT 2018.
  - Ô chữ kết quả tách từ thông minh, hỗ trợ click hoàn tác.
  - Bàn phím xáo trộn ký tự, hỗ trợ cả chuột/chạm cảm ứng và bàn phím máy tính (A-Z, Backspace).
  - Quyền trợ giúp: Mở 1 chữ cái chuẩn xác, Loại bỏ chữ thừa, Xem manh mối bài học.
  - Lời giải thích kiến thức bài học hiện ra sau khi hoàn thành.
- **Hệ Thống Phân Quyền & Quản Lý Dành Cho Giáo Viên**:
  - **Form Maker**: Giáo viên tự tạo bộ câu đố Đuổi hình bắt chữ trực quan trên web.
  - **Quản lý lớp học & Mã PIN**: Tạo phòng thi đấu 6 ký tự để học sinh vào tranh tài.
  - **Analytics Dashboard**: Thống kê điểm số trung bình, tỉ lệ hoàn thành từng bài học.
- **Bảng Xếp Hạng Realtime (Leaderboard)**:
  - Xếp hạng toàn trường / toàn hệ thống và xếp hạng riêng theo từng lớp học.
- **Kiến Trúc Supabase + Standalone Fallback**:
  - Tự động chạy offline / local storage mượt mà ngay lập tức khi chưa có Supabase key, và đồng bộ trực tiếp lên Cloud PostgreSQL khi cấu hình file `.env`.

---

## 🛠 Hướng Dẫn Cài Đặt & Chạy Cục Bộ

### 1. Cài đặt dependencies:
```bash
npm install
```

### 2. Chạy môi trường phát triển (Dev Server):
```bash
npm run dev
```
Trình duyệt sẽ mở tại địa chỉ: `http://localhost:3000`

### 3. Build bản phát hành (Production):
```bash
npm run build
```

---

## 🗄️ Cấu Hình Supabase Database (Tùy Chọn Khi Deploy Cloud)

1. Tạo dự án mới trên [Supabase.com](https://supabase.com).
2. Vào mục **SQL Editor** trên Supabase Dashboard.
3. Dán toàn bộ nội dung file `supabase/schema.sql` và bấm **Run**.
4. Lấy `SUPABASE_URL` và `SUPABASE_ANON_KEY` điền vào file `.env`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```
