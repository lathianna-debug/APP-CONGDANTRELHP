export enum Role {
  HOC_SINH = "hocsinh",
  GIAO_VIEN = "giaovien",
  PHU_HUYNH = "phuhuynh",
  ADMIN = "admin"
}

export interface StudentProfile {
  name: string;
  className: string;
  xp: number;
  level: number;
  completedQuests: string[]; // quest IDs
  joinedClubs: string[]; // club names
  unlockedBadges: string[]; // badge IDs
  goodDeedsCount: number;
}

export interface GoodDeed {
  id: string;
  studentName: string;
  studentClass: string;
  category: "Đạo đức" | "Pháp luật" | "Kỹ năng" | "Văn minh";
  description: string;
  timestamp: string;
  status: "Chờ duyệt" | "Đã duyệt" | "Đã từ chối";
  xpAwarded: number;
}

export interface Quest {
  id: string;
  title: string;
  category: "Đạo đức" | "Pháp luật" | "Kỹ năng" | "Văn minh";
  xp: number;
  completed: boolean;
  isCustom?: boolean; // created by teacher
  description?: string;
}

export interface Club {
  name: string;
  icon: string;
  color: string;
  description: string;
  membersCount: number;
  weeklyGoal: string;
}

export interface ClubMessage {
  id: string;
  clubName: string;
  sender: string;
  role: string;
  content: string;
  timestamp: string;
}

export interface Scenario {
  id: string;
  title: string;
  category: string;
  severity: "Bình thường" | "Nghiêm trọng" | "Cực kỳ nguy hiểm";
  ageGroup: string;
  description: string;
  questions: {
    questionText: string;
    choices: {
      text: string;
      feedback: string;
      xpChange: number;
      isBest: boolean;
    }[];
  }[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  answer: number; // index
  xp: number;
}

export interface Badge {
  id: string;
  title: string;
  icon: string;
  description: string;
  criteria: string;
}
