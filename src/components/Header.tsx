import React from "react";
import { Role, StudentProfile } from "../types";
import { GraduationCap, Scale, Heart, Zap, Smile, Globe, Sparkles } from "lucide-react";

interface HeaderProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
  profile: StudentProfile;
}

export const Header: React.FC<HeaderProps> = ({ currentRole, onRoleChange, profile }) => {
  return (
    <>
      {/* TOP VALUE BAR (Giá trị cốt lõi phong cách Cyber) */}
      <div id="top-value-bar" className="relative z-30 bg-slate-950/60 backdrop-blur-md border-b border-white/5 text-xs py-2.5 px-4 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-1.5 font-bold">
            <span className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider animate-pulse">
              Giá trị cốt lõi
            </span>
            <span className="hidden md:inline text-slate-300">Hành trình Lê Hồng Phong:</span>
          </div>
          <div className="flex flex-wrap gap-4 items-center justify-center font-semibold text-slate-200">
            <span className="flex items-center gap-1.5 hover:text-red-400 transition-colors cursor-help" title="Hiểu để tuân thủ và bảo vệ lẽ phải">
              <Scale className="w-3.5 h-3.5 text-red-400" /> Hiểu pháp luật
            </span>
            <span className="flex items-center gap-1.5 hover:text-pink-400 transition-colors cursor-help" title="Sống yêu thương, biết ơn và làm việc thiện">
              <Heart className="w-3.5 h-3.5 text-pink-400" /> Sống đạo đức
            </span>
            <span className="flex items-center gap-1.5 hover:text-yellow-400 transition-colors cursor-help" title="Tự chủ học hỏi và làm chủ bản thân">
              <Zap className="w-3.5 h-3.5 text-yellow-400" /> Rèn kỹ năng
            </span>
            <span className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors cursor-help" title="Lịch thiệp, chuẩn mực trên mạng và ngoài đời">
              <Smile className="w-3.5 h-3.5 text-emerald-400" /> Ứng xử văn minh
            </span>
            <span className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors cursor-help" title="Vì bản thân, gia đình và trường lớp xanh">
              <Globe className="w-3.5 h-3.5 text-cyan-400" /> Trách nhiệm
            </span>
          </div>
        </div>
      </div>

      {/* MAIN HEADER WITH NEON TEXT SHINE */}
      <header id="main-app-header" className="relative z-20 bg-slate-950/40 backdrop-blur-xl border-b border-white/10 sticky top-0 shadow-lg px-4 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Brand Logo and Title */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-cyan-400 via-purple-600 to-pink-500 p-2.5 rounded-2xl shadow-lg shadow-purple-900/40 text-white animate-bounce-subtle">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-wider flex flex-wrap items-center gap-2">
                <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(168,85,247,0.5)]">
                  CÔNG DÂN TRẺ THCS LÊ HỒNG PHONG
                </span>
                <span className="text-[10px] bg-purple-500/20 text-purple-200 font-extrabold px-2.5 py-1 rounded-full border border-white/10 uppercase tracking-widest">
                  Lớp 6 - 9
                </span>
              </h1>
              <p className="text-[11px] text-slate-300 font-medium tracking-wide mt-0.5">
                Sân chơi giáo dục số • Kiến tạo chuẩn mực sống thế hệ mới
              </p>
            </div>
          </div>

          {/* Role Selector & Status Badge */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            <div className="bg-slate-950/50 backdrop-blur-md p-1 rounded-2xl flex items-center gap-1 text-xs border border-white/10 w-full sm:w-auto overflow-x-auto justify-start">
              <button
                id="role-btn-student"
                onClick={() => onRoleChange(Role.HOC_SINH)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl font-bold transition-all ${
                  currentRole === Role.HOC_SINH
                    ? "bg-gradient-to-r from-purple-500 via-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Học sinh
              </button>
              <button
                id="role-btn-teacher"
                onClick={() => onRoleChange(Role.GIAO_VIEN)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl font-bold transition-all ${
                  currentRole === Role.GIAO_VIEN
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Giáo viên
              </button>
              <button
                id="role-btn-parent"
                onClick={() => onRoleChange(Role.PHU_HUYNH)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl font-bold transition-all ${
                  currentRole === Role.PHU_HUYNH
                    ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg shadow-pink-500/20"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Phụ huynh
              </button>
              <button
                id="role-btn-admin"
                onClick={() => onRoleChange(Role.ADMIN)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl font-bold transition-all ${
                  currentRole === Role.ADMIN
                    ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/20"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Admin
              </button>
            </div>

            {/* Live XP Points Indicator */}
            <div
              id="student-score-badge"
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-400/40 text-amber-200 px-4 py-2 rounded-2xl text-xs font-black shadow-[0_0_15px_rgba(245,158,11,0.15)] backdrop-blur-md"
            >
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>
                Cấp độ {profile.level} •{" "}
                <span className="text-white font-mono">{profile.xp.toLocaleString()}</span> XP
              </span>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
