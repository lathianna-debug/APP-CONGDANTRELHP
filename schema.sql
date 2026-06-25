-- SQL Schema for THCS Lê Hồng Phong Education App
-- Copy and run this in your Supabase SQL Editor (https://supabase.com/dashboard)

-- 1. Create student_profiles table
CREATE TABLE IF NOT EXISTS student_profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  className TEXT NOT NULL,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  completedQuests JSONB DEFAULT '[]'::jsonb,
  joinedClubs JSONB DEFAULT '[]'::jsonb,
  unlockedBadges JSONB DEFAULT '[]'::jsonb,
  goodDeedsCount INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default student profile
INSERT INTO student_profiles (id, name, className, xp, level, completedQuests, joinedClubs, unlockedBadges, goodDeedsCount)
VALUES (
  'default_student',
  'Trần Minh Anh',
  '7A5',
  2350,
  12,
  '["q_daily_1"]'::jsonb,
  '["CLB Đại sứ xanh học đường"]'::jsonb,
  '["b1", "b2"]'::jsonb,
  15
) ON CONFLICT (id) DO NOTHING;


-- 2. Create good_deeds table
CREATE TABLE IF NOT EXISTS good_deeds (
  id TEXT PRIMARY KEY,
  studentName TEXT NOT NULL,
  studentClass TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  status TEXT DEFAULT 'Chờ duyệt',
  xpAwarded INTEGER DEFAULT 40,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial good deeds
INSERT INTO good_deeds (id, studentName, studentClass, category, description, timestamp, status, xpAwarded)
VALUES 
('gd1', 'Nguyễn Linh', '8A1', 'Đạo đức', 'Nhặt được chiếc ví đựng tiền học phí của bạn học sinh khối 6 rơi ở hành lang và nộp lại ngay cho phòng Đoàn Đội để trả lại cho bạn.', '2026-06-24 14:30', 'Đã duyệt', 50),
('gd2', 'Trần Minh Anh', '7A5', 'Văn minh', 'Hỗ trợ bạn Lan nhặt lại hộp bút rơi ở lớp và chủ động giảng lại bài toán khó cho bạn hiểu.', '2026-06-24 16:15', 'Đã duyệt', 40),
('gd3', 'Lê Hoàng Kiên', '9B2', 'Kỹ năng', 'Tự mang bình nước cá nhân đi học để giảm tiêu thụ chai nhựa và thu gom pin cũ mang nộp cho CLB Đại sứ xanh.', '2026-06-24 09:10', 'Đã duyệt', 40)
ON CONFLICT (id) DO NOTHING;


-- 3. Create quests table
CREATE TABLE IF NOT EXISTS quests (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  xp INTEGER NOT NULL,
  completed BOOLEAN DEFAULT false,
  isCustom BOOLEAN DEFAULT false,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial quests
INSERT INTO quests (id, title, category, xp, completed, description)
VALUES
('q_daily_1', 'Nói lời cảm ơn bạn học khi được chia sẻ bài tập hoặc giúp đỡ', 'Đạo đức', 50, true, NULL),
('q_daily_2', 'Đọc & Xử lý tình huống về phòng chống bắt nạt trên mạng xã hội', 'Pháp luật', 100, false, 'Vào mục Kho tình huống, chọn và giải quyết tốt nhất 1 tình huống.'),
('q_daily_3', 'Giúp đỡ phụ huynh dọn dẹp nhà cửa chuẩn bị cuối tuần', 'Kỹ năng', 70, false, NULL)
ON CONFLICT (id) DO NOTHING;


-- 4. Create quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
  id TEXT PRIMARY KEY,
  question TEXT NOT NULL,
  options JSONB NOT NULL, -- JSON array of strings
  answer INTEGER NOT NULL,
  xp INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial quizzes
INSERT INTO quizzes (id, question, options, answer, xp)
VALUES
('q1', 'Hành vi ứng xử nào dưới đây thể hiện chuẩn mực đạo đức tốt nhất của học sinh THCS Lê Hồng Phong trên Internet?', '["Nói lời cảm ơn, dùng ngôn từ văn minh và không chia sẻ tin giả.", "Sử dụng nick ảo để bình luận ẩn danh bôi nhọ giáo viên và bạn học.", "Chỉ sử dụng mạng để thả tim tất cả bài đăng vô thưởng vô phạt.", "Hùa theo đám đông bắt nạt hội đồng bạn cùng trường vì bất đồng ý kiến."]'::jsonb, 0, 100),
('q2', 'Khi thấy nhóm bạn học lôi kéo chuẩn bị thực hiện một hành vi bạo lực học đường, em nên ứng xử thế nào?', '["Từ chối tham gia, can ngăn ôn hòa và lập tức báo cáo Giáo viên hoặc giám thị.", "Hùa theo cổ vũ và quay video đăng tải lên Facebook cá nhân để câu tương tác.", "Phớt lờ vì lo ngại ảnh hưởng tới sự an toàn cá nhân và coi như không thấy gì.", "Tự mình tổ chức một nhóm phản kháng khác để kéo nhau đi đánh trả thù."]'::jsonb, 0, 120),
('q3', 'Luật Trẻ em 2016 quy định quyền lợi quan trọng nào giúp học sinh tự chủ học hỏi và rèn luyện kỹ năng?', '["Quyền được vui chơi, giải trí, tham gia hoạt động văn hóa học hỏi chuẩn mực xã hội.", "Quyền được từ chối tuân thủ tất cả nội quy và quy chế rèn luyện của nhà trường.", "Quyền bỏ học đi làm tự do trước tuổi quy định để kiếm sống.", "Quyền chia sẻ mật khẩu tài khoản và thông tin cá nhân của người khác vô điều kiện."]'::jsonb, 0, 100),
('q4', 'Theo Luật An ninh mạng Việt Nam, hành vi nào sau đây bị nghiêm cấm hoàn toàn trên môi trường mạng?', '["Đăng tải thông tin sai sự thật gây hoang mang dư luận, xuyên tạc lịch sử.", "Tìm kiếm tư liệu phục vụ học tập môn Giáo dục công dân.", "Đăng ký tham gia câu lạc bộ thiện nguyện trực tuyến của trường học.", "Nhắn tin trao đổi bài tập nhóm với các bạn trong lớp."]'::jsonb, 0, 150)
ON CONFLICT (id) DO NOTHING;


-- 5. Create club_messages table
CREATE TABLE IF NOT EXISTS club_messages (
  id TEXT PRIMARY KEY,
  clubName TEXT NOT NULL,
  sender TEXT NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial club messages
INSERT INTO club_messages (id, clubName, sender, role, content, timestamp)
VALUES
('m1', 'CLB Đại sứ xanh học đường', 'Cô Phương Thảo', 'Giáo viên', 'Chào mừng các đại sứ xanh lớp 7A5! Tuần này chúng mình phấn đấu thu gom đủ 20kg giấy vụn nhé!', '2026-06-24 10:15'),
('m2', 'CLB Đại sứ xanh học đường', 'Hoàng Kiên', 'Lớp 9B2', 'Em đã tập hợp được 3kg báo cũ rồi ạ. Chiều nay em nộp ở kho Đoàn Đội nhé cô.', '2026-06-24 11:20')
ON CONFLICT (id) DO NOTHING;


-- 6. Create encouragements table
CREATE TABLE IF NOT EXISTS encouragements (
  id SERIAL PRIMARY KEY,
  text TEXT NOT NULL,
  sender TEXT NOT NULL,
  claimed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial encouragement
INSERT INTO encouragements (text, sender, claimed)
VALUES
('Bố mẹ luôn tự hào về con yêu. Hãy rèn luyện kỹ năng thật chăm ngoan nhé!', 'Phụ huynh', false)
ON CONFLICT (id) DO NOTHING;


-- Enable Row Level Security (RLS) optionally, or use simple public access for simplicity
-- For development speed and compatibility with direct Anon client key:
ALTER TABLE student_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE good_deeds DISABLE ROW LEVEL SECURITY;
ALTER TABLE quests DISABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes DISABLE ROW LEVEL SECURITY;
ALTER TABLE club_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE encouragements DISABLE ROW LEVEL SECURITY;
