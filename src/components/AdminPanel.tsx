import React, { useState } from "react";
import { QuizQuestion, StudentProfile } from "../types";
import { Lock, LogOut, Sliders, PlayCircle, Plus, Trash, Edit, RefreshCw, Users, Database, Cpu, HardDrive } from "lucide-react";

interface AdminPanelProps {
  quizzes: QuizQuestion[];
  onAddQuiz: (quiz: Omit<QuizQuestion, "id">) => void;
  onDeleteQuiz: (id: string) => void;
  onUpdateQuiz: (id: string, updated: Omit<QuizQuestion, "id">) => void;
  students: StudentProfile[];
  onAdjustStudentXp: (name: string, newXp: number) => void;
  adminLoggedIn: boolean;
  onAdminLogin: (success: boolean) => void;
  showToast: (message: string, type: "success" | "error") => void;
  systemLogs: string[];
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  quizzes,
  onAddQuiz,
  onDeleteQuiz,
  onUpdateQuiz,
  students,
  onAdjustStudentXp,
  adminLoggedIn,
  onAdminLogin,
  showToast,
  systemLogs
}) => {
  // Login states
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);

  // Quiz Editor states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [quizQuestion, setQuizQuestion] = useState("");
  const [quizOptA, setQuizOptA] = useState("");
  const [quizOptB, setQuizOptB] = useState("");
  const [quizOptC, setQuizOptC] = useState("");
  const [quizOptD, setQuizOptD] = useState("");
  const [quizAnswerIdx, setQuizAnswerIdx] = useState(0);
  const [quizXpReward, setQuizXpReward] = useState(100);

  // Student editor state
  const [selectedStudentName, setSelectedStudentName] = useState<string | null>(null);
  const [newStudentXp, setNewStudentXp] = useState(0);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "admin") {
      onAdminLogin(true);
      setLoginError(null);
      showToast("Đăng nhập quyền Quản trị tối cao thành công!", "success");
    } else {
      setLoginError("Tài khoản hoặc mật khẩu không chính xác. Thử lại!");
      showToast("Đăng nhập thất bại. Tài khoản/mật khẩu sai!", "error");
    }
  };

  const handleLogout = () => {
    onAdminLogin(false);
    setUsername("");
    setPassword("");
    showToast("Đã đăng xuất khỏi trạm quản trị hệ thống.", "success");
  };

  const handleAddOrUpdateQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizQuestion.trim() || !quizOptA.trim() || !quizOptB.trim()) {
      showToast("Vui lòng điền đủ câu hỏi và ít nhất 2 phương án đầu tiên!", "error");
      return;
    }

    const payload = {
      question: quizQuestion.trim(),
      options: [quizOptA.trim(), quizOptB.trim(), quizOptC.trim() || "N/A", quizOptD.trim() || "N/A"],
      answer: quizAnswerIdx,
      xp: Number(quizXpReward)
    };

    if (editingId) {
      onUpdateQuiz(editingId, payload);
      setEditingId(null);
      showToast("Đã cập nhật câu hỏi trắc nghiệm thành công!", "success");
    } else {
      onAddQuiz(payload);
      showToast("Đã xuất bản thêm câu hỏi trắc nghiệm mới lên máy chủ!", "success");
    }

    // Reset Form
    setQuizQuestion("");
    setQuizOptA("");
    setQuizOptB("");
    setQuizOptC("");
    setQuizOptD("");
    setQuizAnswerIdx(0);
    setQuizXpReward(100);
  };

  const handleStartEditQuiz = (q: QuizQuestion) => {
    setEditingId(q.id);
    setQuizQuestion(q.question);
    setQuizOptA(q.options[0] || "");
    setQuizOptB(q.options[1] || "");
    setQuizOptC(q.options[2] || "");
    setQuizOptD(q.options[3] || "");
    setQuizAnswerIdx(q.answer);
    setQuizXpReward(q.xp);
  };

  const handleAdjustXpSubmit = (name: string) => {
    onAdjustStudentXp(name, newStudentXp);
    setSelectedStudentName(null);
    showToast(`Đã trực tiếp can thiệp điều chỉnh XP của học sinh: ${name}!`, "success");
  };

  return (
    <div className="space-y-6">
      {/* ==================== 1. ADMIN LOGIN FORM ==================== */}
      {!adminLoggedIn ? (
        <div className="max-w-md mx-auto bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-black text-white uppercase tracking-wider">Trạm Quản Trị Hệ Thống LHP</h2>
            <p className="text-[11px] text-slate-400 max-w-xs mx-auto leading-relaxed">
              Khu vực dành riêng cho quản trị viên tối cao của THCS Lê Hồng Phong để sửa đổi học liệu, đề thi và giám sát tài nguyên.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1 text-xs">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tài khoản quản trị</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full text-xs p-3 bg-slate-950 border border-slate-850 rounded-xl outline-none text-slate-100 focus:border-cyan-500"
                required
              />
            </div>

            <div className="space-y-1 text-xs">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mật mã bảo mật</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs p-3 bg-slate-950 border border-slate-850 rounded-xl outline-none text-slate-100 focus:border-cyan-500"
                required
              />
            </div>

            {loginError && (
              <p className="text-rose-400 font-bold text-[10px] text-center">{loginError}</p>
            )}

            <button
              type="submit"
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-black text-xs py-3 rounded-xl transition-all shadow-lg shadow-cyan-500/20"
            >
              KẾT NỐI HỆ THỐNG
            </button>
          </form>
        </div>
      ) : (
        /* ==================== 2. ADMIN COCKPIT ==================== */
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-slate-900/40 p-4 border border-slate-800 rounded-3xl backdrop-blur-md">
            <div>
              <h2 className="text-base font-black text-cyan-300 flex items-center gap-1.5">
                <Sliders className="w-5 h-5" /> Cockpit Quản Trị Viên LHP Active
              </h2>
              <p className="text-[10px] text-slate-400 mt-0.5">Trạng thái kết nối: Admin Tối Cao • Live Sockets</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-4 h-4" /> ĐĂNG XUẤT COCKPIT
            </button>
          </div>

          {/* System resource logs / Metrics panel */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-900/30 rounded-2xl border border-slate-800/80 flex gap-3 items-center">
              <Users className="w-8 h-8 text-purple-400" />
              <div className="text-xs">
                <span className="text-slate-500 font-bold uppercase text-[9px] block">Người dùng hoạt động</span>
                <span className="font-extrabold text-white text-sm block mt-0.5">950 Học sinh</span>
              </div>
            </div>
            <div className="p-4 bg-slate-900/30 rounded-2xl border border-slate-800/80 flex gap-3 items-center">
              <Database className="w-8 h-8 text-cyan-400" />
              <div className="text-xs">
                <span className="text-slate-500 font-bold uppercase text-[9px] block">Trạng thái Cơ sở dữ liệu</span>
                <span className="font-extrabold text-emerald-400 text-sm block mt-0.5">Đã đồng bộ Live</span>
              </div>
            </div>
            <div className="p-4 bg-slate-900/30 rounded-2xl border border-slate-800/80 flex gap-3 items-center">
              <Cpu className="w-8 h-8 text-yellow-400 animate-pulse" />
              <div className="text-xs">
                <span className="text-slate-500 font-bold uppercase text-[9px] block">Mức tải Máy chủ ảo</span>
                <span className="font-extrabold text-white text-sm block mt-0.5">1.4% CPU</span>
              </div>
            </div>
            <div className="p-4 bg-slate-900/30 rounded-2xl border border-slate-800/80 flex gap-3 items-center">
              <HardDrive className="w-8 h-8 text-pink-400" />
              <div className="text-xs">
                <span className="text-slate-500 font-bold uppercase text-[9px] block">Dung lượng rèn luyện</span>
                <span className="font-extrabold text-white text-sm block mt-0.5">14.2 MB / 512 MB</span>
              </div>
            </div>
          </div>

          {/* Core Interactive Modules: Question Editor & Student Adjuster */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left side: Quiz Editor Form */}
            <div className="lg:col-span-1 bg-slate-900/40 border border-slate-800 p-5 rounded-3xl space-y-4">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2">
                <PlayCircle className="w-4 h-4 text-cyan-400" />
                {editingId ? "Cập nhật câu hỏi trắc nghiệm" : "Tạo mới câu hỏi trắc nghiệm"}
              </h3>

              <form onSubmit={handleAddOrUpdateQuiz} className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Đề bài câu hỏi</label>
                  <textarea
                    value={quizQuestion}
                    onChange={(e) => setQuizQuestion(e.target.value)}
                    placeholder="Nhập câu hỏi đạo đức, luật pháp..."
                    className="w-full text-xs p-2.5 bg-slate-950 border border-slate-850 rounded-xl outline-none text-slate-100 focus:border-cyan-500 h-16 resize-none"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Các phương án lựa chọn</label>
                  <input
                    type="text"
                    value={quizOptA}
                    onChange={(e) => setQuizOptA(e.target.value)}
                    placeholder="Phương án A"
                    className="w-full text-xs p-2 bg-slate-950 border border-slate-850 rounded-lg outline-none text-slate-100"
                    required
                  />
                  <input
                    type="text"
                    value={quizOptB}
                    onChange={(e) => setQuizOptB(e.target.value)}
                    placeholder="Phương án B"
                    className="w-full text-xs p-2 bg-slate-950 border border-slate-850 rounded-lg outline-none text-slate-100"
                    required
                  />
                  <input
                    type="text"
                    value={quizOptC}
                    onChange={(e) => setQuizOptC(e.target.value)}
                    placeholder="Phương án C (Tùy chọn)"
                    className="w-full text-xs p-2 bg-slate-950 border border-slate-850 rounded-lg outline-none text-slate-100"
                  />
                  <input
                    type="text"
                    value={quizOptD}
                    onChange={(e) => setQuizOptD(e.target.value)}
                    placeholder="Phương án D (Tùy chọn)"
                    className="w-full text-xs p-2 bg-slate-950 border border-slate-850 rounded-lg outline-none text-slate-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Đáp án đúng</label>
                    <select
                      value={quizAnswerIdx}
                      onChange={(e) => setQuizAnswerIdx(Number(e.target.value))}
                      className="w-full p-2 bg-slate-950 border border-slate-850 rounded-lg outline-none text-slate-200"
                    >
                      <option value={0}>Đáp án A</option>
                      <option value={1}>Đáp án B</option>
                      <option value={2}>Đáp án C</option>
                      <option value={3}>Đáp án D</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phần thưởng XP</label>
                    <input
                      type="number"
                      value={quizXpReward}
                      onChange={(e) => setQuizXpReward(Number(e.target.value))}
                      className="w-full p-2 bg-slate-950 border border-slate-850 rounded-lg outline-none text-slate-200"
                      min={10}
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-slate-850">
                  {editingId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        setQuizQuestion("");
                        setQuizOptA("");
                        setQuizOptB("");
                        setQuizOptC("");
                        setQuizOptD("");
                      }}
                      className="flex-1 py-2 bg-slate-800 text-slate-300 rounded-lg font-bold"
                    >
                      HỦY SỬA
                    </button>
                  )}
                  <button
                    type="submit"
                    className="flex-grow py-2 bg-cyan-500 hover:bg-cyan-600 text-slate-950 rounded-lg font-black"
                  >
                    {editingId ? "CẬP NHẬT ĐỀ THI" : "XUẤT BẢN CÂU HỎI"}
                  </button>
                </div>
              </form>
            </div>

            {/* Center/Right columns: Active Questions Directory and Students adjustments */}
            <div className="lg:col-span-2 space-y-6">
              {/* Table of active questions */}
              <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-3xl space-y-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2 flex justify-between items-center">
                  <span>Hệ thống câu hỏi trắc nghiệm hiện tại ({quizzes.length})</span>
                  <span className="text-slate-500">Người dùng sẽ lập tức nhìn thấy các cập nhật</span>
                </p>

                <div className="space-y-2.5 max-h-56 overflow-y-auto custom-scrollbar pr-1">
                  {quizzes.map((q) => (
                    <div key={q.id} className="p-3 bg-slate-950/60 rounded-xl border border-slate-850 flex justify-between items-start gap-4 text-xs hover:border-slate-750 transition-colors">
                      <div className="space-y-1 flex-1 min-w-0">
                        <p className="font-bold text-white leading-normal truncate">{q.question}</p>
                        <div className="flex gap-2 text-[9px] text-slate-500 font-semibold font-mono">
                          <span>XP: <span className="text-cyan-400 font-bold">{q.xp}</span></span>
                          <span>Đáp án đúng: <span className="text-emerald-400 font-bold">{String.fromCharCode(65 + q.answer)}</span></span>
                        </div>
                      </div>
                      <div className="flex gap-1.5 flex-shrink-0">
                        <button
                          onClick={() => handleStartEditQuiz(q)}
                          className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white rounded-lg cursor-pointer"
                          title="Chỉnh sửa câu hỏi"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteQuiz(q.id)}
                          className="p-1.5 bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/20 text-rose-400 rounded-lg cursor-pointer"
                          title="Xóa câu hỏi"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Adjust student directory */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Students management board */}
                <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-3xl space-y-3">
                  <h4 className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Danh bạ điều chỉnh điểm rèn luyện</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                    {students.map((st) => (
                      <div key={st.name} className="flex justify-between items-center p-2.5 bg-slate-950/60 border border-slate-850 rounded-xl text-xs">
                        <div>
                          <p className="font-bold text-white">{st.name}</p>
                          <p className="text-[10px] text-slate-500">Lớp {st.className} • Cấp {st.level}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-cyan-400">{st.xp.toLocaleString()} XP</span>
                          <button
                            onClick={() => {
                              setSelectedStudentName(st.name);
                              setNewStudentXp(st.xp);
                            }}
                            className="px-2 py-1 bg-slate-900 border border-slate-800 rounded font-bold text-[10px] text-slate-300 hover:bg-slate-800 cursor-pointer"
                          >
                            ĐIỀU CHỈNH
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Adjust XP overlay form */}
                {selectedStudentName ? (
                  <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-3xl space-y-3 text-xs flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-white">Can thiệp cơ sở dữ liệu: {selectedStudentName}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">Nhập số điểm XP rèn luyện mong muốn trực tiếp thiết lập</p>
                    </div>
                    <div className="space-y-2">
                      <input
                        type="number"
                        value={newStudentXp}
                        onChange={(e) => setNewStudentXp(Number(e.target.value))}
                        className="w-full p-2 bg-slate-950 border border-slate-850 rounded-lg outline-none text-slate-100 font-mono font-bold text-center"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedStudentName(null)}
                          className="flex-1 py-1.5 bg-slate-800 text-slate-300 rounded font-bold"
                        >
                          HỦY BỎ
                        </button>
                        <button
                          onClick={() => handleAdjustXpSubmit(selectedStudentName)}
                          className="flex-1 py-1.5 bg-cyan-500 text-slate-950 rounded font-black"
                        >
                          THIẾT LẬP XP
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Live terminal feeds */
                  <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-3xl space-y-2 text-xs flex flex-col justify-between">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <RefreshCw className="w-3 h-3 text-cyan-400 animate-spin" /> Live logs giám sát hệ thống
                    </h4>
                    <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-850 h-28 overflow-y-auto custom-scrollbar font-mono text-[9px] text-cyan-500 leading-normal space-y-1">
                      {systemLogs.map((log, index) => (
                        <div key={index} className="truncate">
                          {log}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
