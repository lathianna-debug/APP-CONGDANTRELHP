import React, { useState } from "react";
import { QuizQuestion, StudentProfile, Quest, Club, LearningMaterial, GoodDeed } from "../types";
import { 
  Lock, 
  LogOut, 
  Sliders, 
  PlayCircle, 
  Plus, 
  Trash, 
  Edit, 
  RefreshCw, 
  Users, 
  Database, 
  Cpu, 
  HardDrive, 
  Milestone, 
  GraduationCap, 
  Link, 
  Video, 
  Image, 
  FileUp, 
  ClipboardList, 
  Laptop, 
  Scale, 
  Sprout, 
  FileText
} from "lucide-react";

// Inline FileUploader Component
interface FileUploaderProps {
  onFileLoaded: (base64: string, name: string) => void;
  fileName?: string;
  accept?: string;
  id: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileLoaded, fileName, accept = "image/*,application/pdf", id }) => {
  const [dragActive, setDragActive] = useState(false);
  
  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onFileLoaded(reader.result, file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
      onDragLeave={() => setDragActive(false)}
      onDrop={(e) => { e.preventDefault(); setDragActive(false); if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]); }}
      className={`border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition-colors ${dragActive ? "border-cyan-400 bg-cyan-500/5" : "border-slate-800 hover:border-slate-700 bg-slate-950"}`}
      id={`${id}-uploader-container`}
    >
      <input
        type="file"
        id={id}
        accept={accept}
        onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
        className="hidden"
      />
      <label htmlFor={id} className="cursor-pointer text-xs text-slate-400 block space-y-1">
        <span className="font-bold text-cyan-400 block">Kéo & thả tài liệu hoặc nhấp để tải</span>
        <span className="text-[10px] text-slate-500 block">Hỗ trợ ảnh JPG/PNG, file PDF/DOC...</span>
        {fileName && <span className="font-mono text-[10px] text-emerald-400 block mt-1 truncate">Đã chọn: {fileName}</span>}
      </label>
    </div>
  );
};

interface AdminPanelProps {
  quizzes: QuizQuestion[];
  onAddQuiz: (quiz: Omit<QuizQuestion, "id">) => void;
  onDeleteQuiz: (id: string) => void;
  onUpdateQuiz: (id: string, updated: Omit<QuizQuestion, "id">) => void;
  
  quests: Quest[];
  onAddQuest: (quest: Omit<Quest, "id" | "completed">) => void;
  onDeleteQuest: (id: string) => void;
  onUpdateQuest: (id: string, updated: Omit<Quest, "id">) => void;

  clubs: Club[];
  onAddClub: (club: Club) => void;
  onDeleteClub: (name: string) => void;
  onUpdateClub: (name: string, updated: Club) => void;

  materials: LearningMaterial[];
  onAddMaterial: (material: Omit<LearningMaterial, "id">) => void;
  onDeleteMaterial: (id: string) => void;
  onUpdateMaterial: (id: string, updated: Omit<LearningMaterial, "id">) => void;

  goodDeeds: GoodDeed[];
  onAddGoodDeed: (deed: Omit<GoodDeed, "id" | "timestamp">) => void;
  onDeleteGoodDeed: (id: string) => void;
  onUpdateGoodDeed: (id: string, updated: Partial<GoodDeed>) => void;

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
  quests,
  onAddQuest,
  onDeleteQuest,
  onUpdateQuest,
  clubs,
  onAddClub,
  onDeleteClub,
  onUpdateClub,
  materials,
  onAddMaterial,
  onDeleteMaterial,
  onUpdateMaterial,
  goodDeeds,
  onAddGoodDeed,
  onDeleteGoodDeed,
  onUpdateGoodDeed,
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

  // Administrative Main Section Tabs
  const [activeTab, setActiveTab] = useState<"quizzes" | "quests" | "clubs" | "materials" | "deeds" | "students">("quizzes");

  // Quiz Form states
  const [quizEditingId, setQuizEditingId] = useState<string | null>(null);
  const [quizQuestion, setQuizQuestion] = useState("");
  const [quizOptA, setQuizOptA] = useState("");
  const [quizOptB, setQuizOptB] = useState("");
  const [quizOptC, setQuizOptC] = useState("");
  const [quizOptD, setQuizOptD] = useState("");
  const [quizAnswerIdx, setQuizAnswerIdx] = useState(0);
  const [quizXpReward, setQuizXpReward] = useState(100);

  // Quest Form states
  const [questEditingId, setQuestEditingId] = useState<string | null>(null);
  const [questTitle, setQuestTitle] = useState("");
  const [questCategory, setQuestCategory] = useState<"Đạo đức" | "Pháp luật" | "Kỹ năng" | "Văn minh">("Đạo đức");
  const [questXp, setQuestXp] = useState(70);
  const [questDesc, setQuestDesc] = useState("");
  const [questYoutube, setQuestYoutube] = useState("");
  const [questFile, setQuestFile] = useState("");
  const [questFileName, setQuestFileName] = useState("");

  // Club Form states
  const [clubEditingName, setClubEditingName] = useState<string | null>(null);
  const [clubName, setClubName] = useState("");
  const [clubIcon, setClubIcon] = useState("laptop");
  const [clubColor, setClubColor] = useState("indigo");
  const [clubDesc, setClubDesc] = useState("");
  const [clubGoal, setClubGoal] = useState("");
  const [clubYoutube, setClubYoutube] = useState("");
  const [clubFile, setClubFile] = useState("");
  const [clubFileName, setClubFileName] = useState("");

  // Learning Material Form states
  const [matEditingId, setMatEditingId] = useState<string | null>(null);
  const [matTitle, setMatTitle] = useState("");
  const [matType, setMatType] = useState("PDF Sách");
  const [matSize, setMatSize] = useState("1.5 MB");
  const [matDesc, setMatDesc] = useState("");
  const [matColor, setMatColor] = useState("from-purple-500 to-indigo-600");
  const [matYoutube, setMatYoutube] = useState("");
  const [matFile, setMatFile] = useState("");
  const [matFileName, setMatFileName] = useState("");

  // Good Deed Form states
  const [deedEditingId, setDeedEditingId] = useState<string | null>(null);
  const [deedStudentName, setDeedStudentName] = useState("");
  const [deedStudentClass, setDeedStudentClass] = useState("");
  const [deedCategory, setDeedCategory] = useState<"Đạo đức" | "Pháp luật" | "Kỹ năng" | "Văn minh">("Đạo đức");
  const [deedDesc, setDeedDesc] = useState("");
  const [deedStatus, setDeedStatus] = useState<"Chờ duyệt" | "Đã duyệt" | "Đã từ chối">("Đã duyệt");
  const [deedXp, setDeedXp] = useState(50);
  const [deedYoutube, setDeedYoutube] = useState("");
  const [deedFile, setDeedFile] = useState("");
  const [deedFileName, setDeedFileName] = useState("");

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

  // 1. Quizzes handlers
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

    if (quizEditingId) {
      onUpdateQuiz(quizEditingId, payload);
      setQuizEditingId(null);
      showToast("Đã cập nhật câu hỏi trắc nghiệm thành công!", "success");
    } else {
      onAddQuiz(payload);
      showToast("Đã xuất bản thêm câu hỏi trắc nghiệm mới!", "success");
    }

    setQuizQuestion("");
    setQuizOptA("");
    setQuizOptB("");
    setQuizOptC("");
    setQuizOptD("");
    setQuizAnswerIdx(0);
    setQuizXpReward(100);
  };

  // 2. Quests handlers
  const handleAddOrUpdateQuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questTitle.trim()) {
      showToast("Vui lòng nhập tên nhiệm vụ rèn luyện!", "error");
      return;
    }

    const payload = {
      title: questTitle.trim(),
      category: questCategory,
      xp: Number(questXp),
      isCustom: true,
      description: questDesc.trim() || undefined,
      youtubeUrl: questYoutube.trim() || undefined,
      fileData: questFile || undefined,
      fileName: questFileName || undefined
    };

    if (questEditingId) {
      onUpdateQuest(questEditingId, { ...payload, completed: false });
      setQuestEditingId(null);
      showToast("Đã sửa đổi thông tin nhiệm vụ rèn luyện thành công!", "success");
    } else {
      onAddQuest(payload);
      showToast("Đã ban hành nhiệm vụ rèn luyện mới thành công!", "success");
    }

    setQuestTitle("");
    setQuestCategory("Đạo đức");
    setQuestXp(70);
    setQuestDesc("");
    setQuestYoutube("");
    setQuestFile("");
    setQuestFileName("");
  };

  // 3. Clubs handlers
  const handleAddOrUpdateClub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clubName.trim()) {
      showToast("Vui lòng điền tên câu lạc bộ!", "error");
      return;
    }

    const payload: Club = {
      name: clubName.trim(),
      icon: clubIcon,
      color: clubColor,
      description: clubDesc.trim(),
      membersCount: 1,
      weeklyGoal: clubGoal.trim() || "Cùng nhau chia sẻ chuẩn mực tốt",
      youtubeUrl: clubYoutube.trim() || undefined,
      fileData: clubFile || undefined
    };

    if (clubEditingName) {
      onUpdateClub(clubEditingName, payload);
      setClubEditingName(null);
      showToast(`Đã cập nhật CLB "${clubName}" thành công!`, "success");
    } else {
      onAddClub(payload);
      showToast(`Đã thành lập mới CLB "${clubName}" thành công!`, "success");
    }

    setClubName("");
    setClubIcon("laptop");
    setClubColor("indigo");
    setClubDesc("");
    setClubGoal("");
    setClubYoutube("");
    setClubFile("");
    setClubFileName("");
  };

  // 4. Materials handlers
  const handleAddOrUpdateMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matTitle.trim()) {
      showToast("Vui lòng nhập tên học liệu giáo dục số!", "error");
      return;
    }

    const payload = {
      title: matTitle.trim(),
      type: matType,
      size: matFile ? "Tải đính kèm" : matSize,
      desc: matDesc.trim(),
      color: matColor,
      youtubeUrl: matYoutube.trim() || undefined,
      fileData: matFile || undefined,
      fileName: matFileName || undefined
    };

    if (matEditingId) {
      onUpdateMaterial(matEditingId, payload);
      setMatEditingId(null);
      showToast("Cập nhật học liệu giáo dục số thành công!", "success");
    } else {
      onAddMaterial(payload);
      showToast("Đã đăng tải học liệu giáo dục số mới thành công!", "success");
    }

    setMatTitle("");
    setMatType("PDF Sách");
    setMatSize("1.5 MB");
    setMatDesc("");
    setMatColor("from-purple-500 to-indigo-600");
    setMatYoutube("");
    setMatFile("");
    setMatFileName("");
  };

  // 5. Good Deeds handlers
  const handleAddOrUpdateDeed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deedStudentName.trim() || !deedDesc.trim()) {
      showToast("Vui lòng nhập tên học sinh và nội dung việc tốt!", "error");
      return;
    }

    const payload = {
      studentName: deedStudentName.trim(),
      studentClass: deedStudentClass.trim() || "Khối 8",
      category: deedCategory,
      description: deedDesc.trim(),
      status: deedStatus,
      xpAwarded: Number(deedXp),
      youtubeUrl: deedYoutube.trim() || undefined,
      fileData: deedFile || undefined,
      fileName: deedFileName || undefined
    };

    if (deedEditingId) {
      onUpdateGoodDeed(deedEditingId, payload);
      setDeedEditingId(null);
      showToast("Đã cập nhật biên bản việc tốt học sinh thành công!", "success");
    } else {
      onAddGoodDeed(payload);
      showToast("Đã bổ sung việc tốt rèn luyện vào nhật ký hệ thống!", "success");
    }

    setDeedStudentName("");
    setDeedStudentClass("");
    setDeedDesc("");
    setDeedCategory("Đạo đức");
    setDeedStatus("Đã duyệt");
    setDeedXp(50);
    setDeedYoutube("");
    setDeedFile("");
    setDeedFileName("");
  };

  const handleAdjustXpSubmit = (name: string) => {
    onAdjustStudentXp(name, newStudentXp);
    setSelectedStudentName(null);
    showToast(`Đã trực tiếp can thiệp điều chỉnh XP của học sinh: ${name}!`, "success");
  };

  return (
    <div className="space-y-6" id="admin-panel-main">
      {/* ==================== 1. ADMIN LOGIN FORM ==================== */}
      {!adminLoggedIn ? (
        <div className="max-w-md mx-auto bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-2xl space-y-6" id="admin-login-box">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-black text-white uppercase tracking-wider">Trạm Quản Trị Hệ Thống LHP</h2>
            <p className="text-[11px] text-slate-400 max-w-xs mx-auto leading-relaxed">
              Khu vực dành riêng cho quản trị viên tối cao của THCS Lê Hồng Phong để sửa đổi học liệu, đề thi và giám sát tài nguyên.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4" id="admin-login-form">
            <div className="space-y-1 text-xs">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider" htmlFor="admin-username-input">Tài khoản quản trị</label>
              <input
                type="text"
                id="admin-username-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full text-xs p-3 bg-slate-950 border border-slate-850 rounded-xl outline-none text-slate-100 focus:border-cyan-500"
                required
              />
            </div>

            <div className="space-y-1 text-xs">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider" htmlFor="admin-password-input">Mật mã bảo mật</label>
              <input
                type="password"
                id="admin-password-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs p-3 bg-slate-950 border border-slate-850 rounded-xl outline-none text-slate-100 focus:border-cyan-500"
                required
              />
            </div>

            {loginError && (
              <p className="text-rose-400 font-bold text-[10px] text-center" id="admin-login-err">{loginError}</p>
            )}

            <button
              type="submit"
              id="admin-login-btn"
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-black text-xs py-3 rounded-xl transition-all shadow-lg shadow-cyan-500/20"
            >
              KẾT NỐI HỆ THỐNG
            </button>
          </form>
        </div>
      ) : (
        /* ==================== 2. ADMIN COCKPIT ==================== */
        <div className="space-y-6" id="admin-cockpit">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center bg-slate-900/40 p-4 border border-slate-800 rounded-3xl backdrop-blur-md gap-4">
            <div>
              <h2 className="text-base font-black text-cyan-300 flex items-center gap-1.5">
                <Sliders className="w-5 h-5" /> Cockpit Quản Trị Viên LHP Active
              </h2>
              <p className="text-[10px] text-slate-400 mt-0.5">Trạng thái kết nối: Admin Tối Cao • Live Sockets</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer self-start md:self-auto"
            >
              <LogOut className="w-4 h-4" /> ĐĂNG XUẤT COCKPIT
            </button>
          </div>

          {/* Tab buttons */}
          <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
            {[
              { id: "quizzes", label: "Sân chơi GDCD (Quizzes)", icon: PlayCircle },
              { id: "quests", label: "Nhiệm vụ rèn luyện (Quests)", icon: Milestone },
              { id: "clubs", label: "Câu lạc bộ (Clubs)", icon: Users },
              { id: "materials", label: "Kho học liệu số (Files)", icon: FileText },
              { id: "deeds", label: "Nhật ký việc tốt (Deeds)", icon: ClipboardList },
              { id: "students", label: "Danh sách học sinh", icon: GraduationCap },
            ].map((tab) => {
              const IconComp = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/10 scale-105"
                      : "bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-850"
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left side: Form Editor */}
            <div className="lg:col-span-1 bg-slate-900/40 border border-slate-800 p-5 rounded-3xl space-y-4">
              
              {/* QUIZZES FORM */}
              {activeTab === "quizzes" && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2">
                    <PlayCircle className="w-4 h-4 text-cyan-400" />
                    {quizEditingId ? "Sửa câu hỏi trắc nghiệm" : "Tạo mới câu hỏi trắc nghiệm"}
                  </h3>
                  <form onSubmit={handleAddOrUpdateQuiz} className="space-y-3.5 text-xs">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider" htmlFor="quiz-question-textarea">Đề bài câu hỏi</label>
                      <textarea
                        id="quiz-question-textarea"
                        value={quizQuestion}
                        onChange={(e) => setQuizQuestion(e.target.value)}
                        placeholder="Nhập câu hỏi chuẩn mực đạo đức, an toàn mạng..."
                        className="w-full text-xs p-2.5 bg-slate-950 border border-slate-850 rounded-xl outline-none text-slate-100 focus:border-cyan-500 h-16 resize-none"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider" htmlFor="quiz-opt-a-input">Các phương án lựa chọn</label>
                      <input
                        type="text"
                        id="quiz-opt-a-input"
                        value={quizOptA}
                        onChange={(e) => setQuizOptA(e.target.value)}
                        placeholder="Phương án A"
                        className="w-full text-xs p-2 bg-slate-950 border border-slate-850 rounded-lg outline-none text-slate-100"
                        required
                      />
                      <input
                        type="text"
                        id="quiz-opt-b-input"
                        value={quizOptB}
                        onChange={(e) => setQuizOptB(e.target.value)}
                        placeholder="Phương án B"
                        className="w-full text-xs p-2 bg-slate-950 border border-slate-850 rounded-lg outline-none text-slate-100"
                        required
                      />
                      <input
                        type="text"
                        id="quiz-opt-c-input"
                        value={quizOptC}
                        onChange={(e) => setQuizOptC(e.target.value)}
                        placeholder="Phương án C (Tùy chọn)"
                        className="w-full text-xs p-2 bg-slate-950 border border-slate-850 rounded-lg outline-none text-slate-100"
                      />
                      <input
                        type="text"
                        id="quiz-opt-d-input"
                        value={quizOptD}
                        onChange={(e) => setQuizOptD(e.target.value)}
                        placeholder="Phương án D (Tùy chọn)"
                        className="w-full text-xs p-2 bg-slate-950 border border-slate-850 rounded-lg outline-none text-slate-100"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider" htmlFor="quiz-correct-ans-select">Đáp án đúng</label>
                        <select
                          id="quiz-correct-ans-select"
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
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider" htmlFor="quiz-xp-input">Thưởng (XP)</label>
                        <input
                          type="number"
                          id="quiz-xp-input"
                          value={quizXpReward}
                          onChange={(e) => setQuizXpReward(Number(e.target.value))}
                          className="w-full p-2 bg-slate-950 border border-slate-850 rounded-lg outline-none text-slate-200"
                          min={10}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2 border-t border-slate-850">
                      {quizEditingId && (
                        <button
                          type="button"
                          onClick={() => {
                            setQuizEditingId(null);
                            setQuizQuestion("");
                            setQuizOptA("");
                            setQuizOptB("");
                            setQuizOptC("");
                            setQuizOptD("");
                            setQuizAnswerIdx(0);
                            setQuizXpReward(100);
                          }}
                          className="flex-1 py-2 bg-slate-800 text-slate-300 rounded-lg font-bold"
                        >
                          HỦY SỬA
                        </button>
                      )}
                      <button type="submit" className="flex-grow py-2 bg-cyan-500 hover:bg-cyan-600 text-slate-950 rounded-lg font-black">
                        {quizEditingId ? "CẬP NHẬT ĐỀ THI" : "XUẤT BẢN CÂU HỎI"}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* QUESTS FORM */}
              {activeTab === "quests" && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2">
                    <Milestone className="w-4 h-4 text-emerald-400" />
                    {questEditingId ? "Sửa nhiệm vụ rèn luyện" : "Ban hành nhiệm vụ rèn luyện mới"}
                  </h3>
                  <form onSubmit={handleAddOrUpdateQuest} className="space-y-3 text-xs">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider" htmlFor="quest-title-input">Tên nhiệm vụ</label>
                      <input
                        type="text"
                        id="quest-title-input"
                        value={questTitle}
                        onChange={(e) => setQuestTitle(e.target.value)}
                        placeholder="VD: Không lan truyền tin đồn thất thiệt trên mạng"
                        className="w-full text-xs p-2.5 bg-slate-950 border border-slate-850 rounded-xl outline-none text-slate-100 focus:border-emerald-500"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider" htmlFor="quest-category-select">Phân loại</label>
                        <select
                          id="quest-category-select"
                          value={questCategory}
                          onChange={(e) => setQuestCategory(e.target.value as any)}
                          className="w-full p-2 bg-slate-950 border border-slate-850 rounded-lg outline-none text-slate-200"
                        >
                          <option value="Đạo đức">Đạo đức</option>
                          <option value="Pháp luật">Pháp luật</option>
                          <option value="Kỹ năng">Kỹ năng</option>
                          <option value="Văn minh">Văn minh</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider" htmlFor="quest-xp-reward-input">Điểm thưởng (XP)</label>
                        <input
                          type="number"
                          id="quest-xp-reward-input"
                          value={questXp}
                          onChange={(e) => setQuestXp(Number(e.target.value))}
                          className="w-full p-2 bg-slate-950 border border-slate-850 rounded-lg outline-none text-slate-200"
                          min={10}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider" htmlFor="quest-desc-textarea">Mô tả hướng dẫn</label>
                      <textarea
                        id="quest-desc-textarea"
                        value={questDesc}
                        onChange={(e) => setQuestDesc(e.target.value)}
                        placeholder="Ghi rõ yêu cầu rèn luyện cho học sinh..."
                        className="w-full text-xs p-2.5 bg-slate-950 border border-slate-850 rounded-xl outline-none text-slate-100 h-14 resize-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1" htmlFor="quest-youtube-input">
                        <Video className="w-3.5 h-3.5 text-rose-500" /> Liên kết video hướng dẫn (Youtube)
                      </label>
                      <input
                        type="url"
                        id="quest-youtube-input"
                        value={questYoutube}
                        onChange={(e) => setQuestYoutube(e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="w-full text-xs p-2 bg-slate-950 border border-slate-850 rounded-lg outline-none text-slate-200 focus:border-rose-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <FileUp className="w-3.5 h-3.5 text-cyan-400" /> Tải lên tài liệu đính kèm (Ảnh/PDF)
                      </label>
                      <FileUploader
                        id="quest-file-uploader"
                        fileName={questFileName}
                        onFileLoaded={(base64, name) => {
                          setQuestFile(base64);
                          setQuestFileName(name);
                          showToast(`Đã ghi nhận tài liệu đính kèm: ${name}`, "success");
                        }}
                      />
                      {questFile && (
                        <button
                          type="button"
                          onClick={() => { setQuestFile(""); setQuestFileName(""); }}
                          className="text-[9px] text-rose-400 font-bold hover:underline"
                        >
                          Xóa tệp đính kèm
                        </button>
                      )}
                    </div>
                    <div className="flex gap-2 pt-2 border-t border-slate-850">
                      {questEditingId && (
                        <button
                          type="button"
                          onClick={() => {
                            setQuestEditingId(null);
                            setQuestTitle("");
                            setQuestCategory("Đạo đức");
                            setQuestXp(70);
                            setQuestDesc("");
                            setQuestYoutube("");
                            setQuestFile("");
                            setQuestFileName("");
                          }}
                          className="flex-1 py-2 bg-slate-800 text-slate-300 rounded-lg font-bold"
                        >
                          HỦY SỬA
                        </button>
                      )}
                      <button type="submit" className="flex-grow py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-lg font-black">
                        {questEditingId ? "LƯU THAY ĐỔI" : "BAN HÀNH NHIỆM VỤ"}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* CLUBS FORM */}
              {activeTab === "clubs" && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2">
                    <Users className="w-4 h-4 text-purple-400" />
                    {clubEditingName ? `Sửa đổi câu lạc bộ` : "Thành lập câu lạc bộ mới"}
                  </h3>
                  <form onSubmit={handleAddOrUpdateClub} className="space-y-3 text-xs">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider" htmlFor="club-name-input">Tên Câu lạc bộ</label>
                      <input
                        type="text"
                        id="club-name-input"
                        value={clubName}
                        onChange={(e) => setClubName(e.target.value)}
                        placeholder="VD: CLB Bạn đọc sách đạo đức LHP"
                        className="w-full text-xs p-2.5 bg-slate-950 border border-slate-850 rounded-xl outline-none text-slate-100 focus:border-purple-500"
                        required
                        disabled={!!clubEditingName}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider" htmlFor="club-icon-select">Biểu tượng</label>
                        <select
                          id="club-icon-select"
                          value={clubIcon}
                          onChange={(e) => setClubIcon(e.target.value)}
                          className="w-full p-2 bg-slate-950 border border-slate-850 rounded-lg outline-none text-slate-200"
                        >
                          <option value="laptop">💻 Công nghệ / Số</option>
                          <option value="scale">⚖️ Luật pháp / Pháp lý</option>
                          <option value="sprout">🌱 Môi trường / Sống xanh</option>
                          <option value="users-round">👥 Kỹ năng / Giao tiếp</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider" htmlFor="club-color-select">Màu sắc chủ đạo</label>
                        <select
                          id="club-color-select"
                          value={clubColor}
                          onChange={(e) => setClubColor(e.target.value)}
                          className="w-full p-2 bg-slate-950 border border-slate-850 rounded-lg outline-none text-slate-200"
                        >
                          <option value="indigo">Chàm huyền ảo</option>
                          <option value="pink">Hồng rực rỡ</option>
                          <option value="emerald">Lục bảo bảo vệ</option>
                          <option value="amber">Hổ phách ấm áp</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider" htmlFor="club-desc-textarea">Tóm tắt hoạt động</label>
                      <textarea
                        id="club-desc-textarea"
                        value={clubDesc}
                        onChange={(e) => setClubDesc(e.target.value)}
                        placeholder="Mô tả tôn chỉ hoạt động..."
                        className="w-full text-xs p-2.5 bg-slate-950 border border-slate-850 rounded-xl outline-none text-slate-100 h-14 resize-none"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider" htmlFor="club-goal-input">Mục tiêu tuần này</label>
                      <input
                        type="text"
                        id="club-goal-input"
                        value={clubGoal}
                        onChange={(e) => setClubGoal(e.target.value)}
                        placeholder="Chiến dịch tuần..."
                        className="w-full text-xs p-2 bg-slate-950 border border-slate-850 rounded-lg outline-none text-slate-200"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1" htmlFor="club-youtube-input">
                        <Video className="w-3.5 h-3.5 text-rose-500" /> Link Youtube giới thiệu CLB
                      </label>
                      <input
                        type="url"
                        id="club-youtube-input"
                        value={clubYoutube}
                        onChange={(e) => setClubYoutube(e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="w-full text-xs p-2 bg-slate-950 border border-slate-850 rounded-lg outline-none text-slate-200"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <Image className="w-3.5 h-3.5 text-cyan-400" /> Tải ảnh bìa CLB
                      </label>
                      <FileUploader
                        id="club-file-uploader"
                        fileName={clubFileName}
                        onFileLoaded={(base64, name) => {
                          setClubFile(base64);
                          setClubFileName(name);
                          showToast(`Đã nhận ảnh bìa CLB: ${name}`, "success");
                        }}
                      />
                    </div>
                    <div className="flex gap-2 pt-2 border-t border-slate-850">
                      {clubEditingName && (
                        <button
                          type="button"
                          onClick={() => {
                            setClubEditingName(null);
                            setClubName("");
                            setClubIcon("laptop");
                            setClubColor("indigo");
                            setClubDesc("");
                            setClubGoal("");
                            setClubYoutube("");
                            setClubFile("");
                            setClubFileName("");
                          }}
                          className="flex-1 py-2 bg-slate-800 text-slate-300 rounded-lg font-bold"
                        >
                          HỦY SỬA
                        </button>
                      )}
                      <button type="submit" className="flex-grow py-2 bg-purple-500 hover:bg-purple-600 text-slate-950 rounded-lg font-black">
                        {clubEditingName ? "LƯU THÔNG TIN" : "THÀNH LẬP CLB"}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* MATERIALS FORM */}
              {activeTab === "materials" && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2">
                    <FileText className="w-4 h-4 text-yellow-400" />
                    {matEditingId ? "Sửa đổi học liệu giáo dục số" : "Đăng tải học liệu giáo dục số mới"}
                  </h3>
                  <form onSubmit={handleAddOrUpdateMaterial} className="space-y-3 text-xs">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider" htmlFor="mat-title-input">Tên Học liệu</label>
                      <input
                        type="text"
                        id="mat-title-input"
                        value={matTitle}
                        onChange={(e) => setMatTitle(e.target.value)}
                        placeholder="VD: Cẩm nang phòng chống bắt nạt số THCS"
                        className="w-full text-xs p-2.5 bg-slate-950 border border-slate-850 rounded-xl outline-none text-slate-100 focus:border-yellow-500"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider" htmlFor="mat-type-select">Loại định dạng</label>
                        <select
                          id="mat-type-select"
                          value={matType}
                          onChange={(e) => setMatType(e.target.value)}
                          className="w-full p-2 bg-slate-950 border border-slate-850 rounded-lg outline-none text-slate-200"
                        >
                          <option value="PDF Sổ tay">PDF Sổ tay</option>
                          <option value="PNG Sơ đồ">PNG Sơ đồ</option>
                          <option value="DOC Tài liệu">DOC Tài liệu</option>
                          <option value="MP4 Video">MP4 Video</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider" htmlFor="mat-size-input">Dung lượng ước tính</label>
                        <input
                          type="text"
                          id="mat-size-input"
                          value={matSize}
                          onChange={(e) => setMatSize(e.target.value)}
                          placeholder="VD: 2.4 MB"
                          className="w-full p-2 bg-slate-950 border border-slate-850 rounded-lg outline-none text-slate-200"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider" htmlFor="mat-desc-textarea">Tóm tắt nội dung học tập</label>
                      <textarea
                        id="mat-desc-textarea"
                        value={matDesc}
                        onChange={(e) => setMatDesc(e.target.value)}
                        placeholder="Nội dung chính giúp học sinh tiếp thu..."
                        className="w-full text-xs p-2.5 bg-slate-950 border border-slate-850 rounded-xl outline-none text-slate-100 h-14 resize-none"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider" htmlFor="mat-color-select">Giao diện (Gradient Color)</label>
                      <select
                        id="mat-color-select"
                        value={matColor}
                        onChange={(e) => setMatColor(e.target.value)}
                        className="w-full p-2 bg-slate-950 border border-slate-850 rounded-lg outline-none text-slate-200"
                      >
                        <option value="from-yellow-400 to-amber-500">Hổ phách tươi tắn</option>
                        <option value="from-cyan-400 to-indigo-500">Màu số công nghệ</option>
                        <option value="from-emerald-400 to-teal-500">Lá cây rực rỡ</option>
                        <option value="from-purple-500 to-pink-500">Màu hồng tinh tú</option>
                        <option value="from-rose-500 to-orange-500">Mặt trời ấm áp</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1" htmlFor="mat-youtube-input">
                        <Video className="w-3.5 h-3.5 text-rose-500" /> Tích hợp video Youtube (Nếu có)
                      </label>
                      <input
                        type="url"
                        id="mat-youtube-input"
                        value={matYoutube}
                        onChange={(e) => setMatYoutube(e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="w-full text-xs p-2 bg-slate-950 border border-slate-850 rounded-lg outline-none text-slate-200"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <FileUp className="w-3.5 h-3.5 text-cyan-400" /> Đính kèm file thực tế để tải về
                      </label>
                      <FileUploader
                        id="mat-file-uploader"
                        fileName={matFileName}
                        onFileLoaded={(base64, name) => {
                          setMatFile(base64);
                          setMatFileName(name);
                          showToast(`Đã nhận file tài liệu: ${name}`, "success");
                        }}
                      />
                    </div>
                    <div className="flex gap-2 pt-2 border-t border-slate-850">
                      {matEditingId && (
                        <button
                          type="button"
                          onClick={() => {
                            setMatEditingId(null);
                            setMatTitle("");
                            setMatType("PDF Sách");
                            setMatSize("1.5 MB");
                            setMatDesc("");
                            setMatColor("from-purple-500 to-indigo-600");
                            setMatYoutube("");
                            setMatFile("");
                            setMatFileName("");
                          }}
                          className="flex-1 py-2 bg-slate-800 text-slate-300 rounded-lg font-bold"
                        >
                          HỦY SỬA
                        </button>
                      )}
                      <button type="submit" className="flex-grow py-2 bg-yellow-500 hover:bg-yellow-600 text-slate-950 rounded-lg font-black">
                        {matEditingId ? "CẬP NHẬT HỌC LIỆU" : "XUẤT BẢN HỌC LIỆU"}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* GOOD DEEDS FORM */}
              {activeTab === "deeds" && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2">
                    <ClipboardList className="w-4 h-4 text-amber-400" />
                    {deedEditingId ? "Cập nhật Nhật ký việc tốt" : "Bổ sung Nhật ký việc tốt"}
                  </h3>
                  <form onSubmit={handleAddOrUpdateDeed} className="space-y-3 text-xs">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider" htmlFor="deed-student-name-input">Tên học sinh</label>
                        <input
                          type="text"
                          id="deed-student-name-input"
                          value={deedStudentName}
                          onChange={(e) => setDeedStudentName(e.target.value)}
                          placeholder="Nguyễn Văn A"
                          className="w-full text-xs p-2 bg-slate-950 border border-slate-850 rounded-lg outline-none text-slate-100"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider" htmlFor="deed-student-class-input">Lớp</label>
                        <input
                          type="text"
                          id="deed-student-class-input"
                          value={deedStudentClass}
                          onChange={(e) => setDeedStudentClass(e.target.value)}
                          placeholder="8A2"
                          className="w-full text-xs p-2 bg-slate-950 border border-slate-850 rounded-lg outline-none text-slate-100"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider" htmlFor="deed-category-select">Phân loại</label>
                        <select
                          id="deed-category-select"
                          value={deedCategory}
                          onChange={(e) => setDeedCategory(e.target.value as any)}
                          className="w-full p-2 bg-slate-950 border border-slate-850 rounded-lg outline-none text-slate-200"
                        >
                          <option value="Đạo đức">Đạo đức</option>
                          <option value="Pháp luật">Pháp luật</option>
                          <option value="Kỹ năng">Kỹ năng</option>
                          <option value="Văn minh">Văn minh</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider" htmlFor="deed-xp-input">Tích lũy (XP)</label>
                        <input
                          type="number"
                          id="deed-xp-input"
                          value={deedXp}
                          onChange={(e) => setDeedXp(Number(e.target.value))}
                          className="w-full p-2 bg-slate-950 border border-slate-850 rounded-lg outline-none text-slate-200"
                          min={10}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider" htmlFor="deed-desc-textarea">Nội dung việc làm tốt</label>
                      <textarea
                        id="deed-desc-textarea"
                        value={deedDesc}
                        onChange={(e) => setDeedDesc(e.target.value)}
                        placeholder="VD: Chủ động tưới cây, nhặt rác dọn vệ sinh lớp..."
                        className="w-full text-xs p-2.5 bg-slate-950 border border-slate-850 rounded-xl outline-none text-slate-100 h-14 resize-none"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider" htmlFor="deed-status-select">Trạng thái phê duyệt</label>
                      <select
                        id="deed-status-select"
                        value={deedStatus}
                        onChange={(e) => setDeedStatus(e.target.value as any)}
                        className="w-full p-2 bg-slate-950 border border-slate-850 rounded-lg outline-none text-slate-200"
                      >
                        <option value="Chờ duyệt">Chờ duyệt</option>
                        <option value="Đã duyệt">Đã duyệt</option>
                        <option value="Đã từ chối">Đã từ chối</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1" htmlFor="deed-youtube-input">
                        <Video className="w-3.5 h-3.5 text-rose-500" /> Link Youtube minh chứng (Nếu có)
                      </label>
                      <input
                        type="url"
                        id="deed-youtube-input"
                        value={deedYoutube}
                        onChange={(e) => setDeedYoutube(e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="w-full text-xs p-2 bg-slate-950 border border-slate-850 rounded-lg outline-none text-slate-200"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <Image className="w-3.5 h-3.5 text-cyan-400" /> Đính kèm hình ảnh minh chứng (Base64)
                      </label>
                      <FileUploader
                        id="deed-file-uploader"
                        fileName={deedFileName}
                        onFileLoaded={(base64, name) => {
                          setDeedFile(base64);
                          setDeedFileName(name);
                          showToast(`Đã nhận ảnh việc tốt: ${name}`, "success");
                        }}
                      />
                    </div>
                    <div className="flex gap-2 pt-2 border-t border-slate-850">
                      {deedEditingId && (
                        <button
                          type="button"
                          onClick={() => {
                            setDeedEditingId(null);
                            setDeedStudentName("");
                            setDeedStudentClass("");
                            setDeedDesc("");
                            setDeedCategory("Đạo đức");
                            setDeedStatus("Đã duyệt");
                            setDeedXp(50);
                            setDeedYoutube("");
                            setDeedFile("");
                            setDeedFileName("");
                          }}
                          className="flex-1 py-2 bg-slate-800 text-slate-300 rounded-lg font-bold"
                        >
                          HỦY SỬA
                        </button>
                      )}
                      <button type="submit" className="flex-grow py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg font-black">
                        {deedEditingId ? "CẬP NHẬT VIỆC TỐT" : "BỔ SUNG VIỆC TỐT"}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* STUDENTS / SYSTEM LOGGER */}
              {activeTab === "students" && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2">
                    <GraduationCap className="w-4 h-4 text-cyan-400" /> Điều chỉnh điểm rèn luyện
                  </h3>
                  <p className="text-[10px] text-slate-400 leading-normal">
                    Chọn học sinh ở bảng danh sách bên phải rồi tiến hành điều chỉnh mức điểm rèn luyện (XP) mong muốn.
                  </p>
                  <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-850 text-center text-slate-500 text-xs italic">
                    Nhấp nút "ĐIỀU CHỈNH" ở danh sách học sinh bên cạnh để kích hoạt trình thiết lập XP nhanh.
                  </div>
                </div>
              )}

            </div>

            {/* Right side: Directories list */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Directory of Active Quizzes */}
              {activeTab === "quizzes" && (
                <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-3xl space-y-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2 flex justify-between items-center">
                    <span>Hệ thống câu hỏi trắc nghiệm hiện tại ({quizzes.length})</span>
                    <span className="text-slate-500">Học sinh sẽ lập tức nhìn thấy thay đổi</span>
                  </p>
                  <div className="space-y-2.5 max-h-[480px] overflow-y-auto custom-scrollbar pr-1">
                    {quizzes.map((q) => (
                      <div key={q.id} className="p-3 bg-slate-950/60 rounded-xl border border-slate-850 flex justify-between items-start gap-4 text-xs hover:border-slate-750 transition-colors">
                        <div className="space-y-1 flex-1 min-w-0">
                          <p className="font-bold text-white leading-normal">{q.question}</p>
                          <div className="flex flex-wrap gap-2 text-[9px] text-slate-500 font-semibold font-mono">
                            <span className="text-cyan-400 bg-cyan-500/5 px-1 rounded">XP: {q.xp}</span>
                            <span className="text-emerald-400 bg-emerald-500/5 px-1 rounded">Đáp án đúng: {String.fromCharCode(65 + q.answer)}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-1.5 mt-1.5 text-[10px] text-slate-400 bg-slate-950/40 p-1.5 rounded">
                            {q.options.map((opt, i) => (
                              <span key={i} className={i === q.answer ? "text-emerald-400 font-bold" : ""}>
                                {String.fromCharCode(65 + i)}. {opt}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-1.5 flex-shrink-0">
                          <button
                            onClick={() => {
                              setQuizEditingId(q.id);
                              setQuizQuestion(q.question);
                              setQuizOptA(q.options[0] || "");
                              setQuizOptB(q.options[1] || "");
                              setQuizOptC(q.options[2] || "");
                              setQuizOptD(q.options[3] || "");
                              setQuizAnswerIdx(q.answer);
                              setQuizXpReward(q.xp);
                              showToast("Đã tải dữ liệu câu hỏi trắc nghiệm lên form sửa!", "success");
                            }}
                            className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white rounded-lg cursor-pointer"
                            title="Sửa câu hỏi"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => { onDeleteQuiz(q.id); showToast("Đã xóa câu hỏi trắc nghiệm!", "success"); }}
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
              )}

              {/* Directory of Active Quests */}
              {activeTab === "quests" && (
                <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-3xl space-y-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2 flex justify-between items-center">
                    <span>Nhiệm vụ rèn luyện hiện tại ({quests.length})</span>
                    <span className="text-slate-500">Giáo viên & Học sinh rèn luyện trực tiếp</span>
                  </p>
                  <div className="space-y-2.5 max-h-[480px] overflow-y-auto custom-scrollbar pr-1">
                    {quests.map((q) => (
                      <div key={q.id} className="p-3 bg-slate-950/60 rounded-xl border border-slate-850 flex justify-between items-start gap-4 text-xs hover:border-slate-750 transition-colors">
                        <div className="space-y-1 flex-1 min-w-0">
                          <p className="font-bold text-white leading-normal">{q.title}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{q.description || "Chưa có mô tả chi tiết."}</p>
                          <div className="flex flex-wrap gap-2 text-[9px] font-mono mt-1">
                            <span className="text-purple-400 bg-purple-500/5 px-1.5 py-0.5 rounded border border-purple-500/20">Giá trị: {q.category}</span>
                            <span className="text-amber-400 bg-amber-500/5 px-1.5 py-0.5 rounded border border-amber-500/20">XP: +{q.xp}</span>
                            {q.youtubeUrl && <span className="text-rose-400 bg-rose-500/5 px-1.5 py-0.5 rounded border border-rose-500/20 flex items-center gap-0.5"><Video className="w-2.5 h-2.5" /> Có Video</span>}
                            {q.fileData && <span className="text-cyan-400 bg-cyan-500/5 px-1.5 py-0.5 rounded border border-cyan-500/20 flex items-center gap-0.5"><FileText className="w-2.5 h-2.5" /> Có Tệp đính kèm</span>}
                          </div>
                        </div>
                        <div className="flex gap-1.5 flex-shrink-0">
                          <button
                            onClick={() => {
                              setQuestEditingId(q.id);
                              setQuestTitle(q.title);
                              setQuestCategory(q.category);
                              setQuestXp(q.xp);
                              setQuestDesc(q.description || "");
                              setQuestYoutube(q.youtubeUrl || "");
                              setQuestFile(q.fileData || "");
                              setQuestFileName(q.fileName || "");
                              showToast("Đã tải dữ liệu nhiệm vụ lên form sửa!", "success");
                            }}
                            className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white rounded-lg cursor-pointer"
                            title="Sửa nhiệm vụ"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => { onDeleteQuest(q.id); showToast("Đã xóa nhiệm vụ rèn luyện!", "success"); }}
                            className="p-1.5 bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/20 text-rose-400 rounded-lg cursor-pointer"
                            title="Xóa nhiệm vụ"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Directory of Active Clubs */}
              {activeTab === "clubs" && (
                <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-3xl space-y-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2 flex justify-between items-center">
                    <span>Danh sách hội nhóm Câu lạc bộ hiện hành ({clubs.length})</span>
                    <span className="text-slate-500">Giao lưu rèn luyện</span>
                  </p>
                  <div className="space-y-2.5 max-h-[480px] overflow-y-auto custom-scrollbar pr-1">
                    {clubs.map((c) => (
                      <div key={c.name} className="p-3 bg-slate-950/60 rounded-xl border border-slate-850 flex justify-between items-start gap-4 text-xs hover:border-slate-750 transition-colors">
                        <div className="space-y-1 flex-1 min-w-0">
                          <p className="font-extrabold text-white text-sm">{c.name}</p>
                          <p className="text-[11px] text-slate-400 leading-relaxed italic mt-0.5">"{c.description}"</p>
                          <p className="text-[10px] text-slate-400"><span className="text-purple-400 font-bold">Mục tiêu tuần:</span> {c.weeklyGoal}</p>
                          <div className="flex flex-wrap gap-2 text-[9px] font-mono mt-1">
                            <span className="text-indigo-400 bg-indigo-500/5 px-1.5 py-0.5 rounded border border-indigo-500/20">Màu: {c.color}</span>
                            <span className="text-cyan-400 bg-cyan-500/5 px-1.5 py-0.5 rounded border border-cyan-500/20">Thành viên: {c.membersCount}</span>
                            {c.youtubeUrl && <span className="text-rose-400 bg-rose-500/5 px-1.5 py-0.5 rounded border border-rose-500/20 flex items-center gap-0.5"><Video className="w-2.5 h-2.5" /> Youtube giới thiệu</span>}
                            {c.fileData && <span className="text-emerald-400 bg-emerald-500/5 px-1.5 py-0.5 rounded border border-emerald-500/20 flex items-center gap-0.5"><Image className="w-2.5 h-2.5" /> Có Banner</span>}
                          </div>
                        </div>
                        <div className="flex gap-1.5 flex-shrink-0">
                          <button
                            onClick={() => {
                              setClubEditingName(c.name);
                              setClubName(c.name);
                              setClubIcon(c.icon);
                              setClubColor(c.color);
                              setClubDesc(c.description);
                              setClubGoal(c.weeklyGoal);
                              setClubYoutube(c.youtubeUrl || "");
                              setClubFile(c.fileData || "");
                              setClubFileName(c.fileData ? "Ảnh bìa hiện tại" : "");
                              showToast("Đã nạp dữ liệu CLB lên form chỉnh sửa!", "success");
                            }}
                            className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white rounded-lg cursor-pointer"
                            title="Sửa Câu lạc bộ"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => { onDeleteClub(c.name); showToast("Đã giải thể CLB!", "success"); }}
                            className="p-1.5 bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/20 text-rose-400 rounded-lg cursor-pointer"
                            title="Giải thể CLB"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Directory of Learning Materials */}
              {activeTab === "materials" && (
                <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-3xl space-y-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2 flex justify-between items-center">
                    <span>Kho tài nguyên giáo dục số hiện dụng ({materials.length})</span>
                    <span className="text-slate-500">Giáo trình & Sơ đồ hỗ trợ</span>
                  </p>
                  <div className="space-y-2.5 max-h-[480px] overflow-y-auto custom-scrollbar pr-1">
                    {materials.map((m) => (
                      <div key={m.id} className="p-3 bg-slate-950/60 rounded-xl border border-slate-850 flex justify-between items-start gap-4 text-xs hover:border-slate-750 transition-colors">
                        <div className="space-y-1 flex-1 min-w-0">
                          <p className="font-extrabold text-white text-sm">{m.title}</p>
                          <p className="text-[11px] text-slate-400 leading-normal mt-0.5">{m.desc}</p>
                          <div className="flex flex-wrap gap-2 text-[9px] font-mono mt-1">
                            <span className="text-yellow-400 bg-yellow-500/5 px-1.5 py-0.5 rounded border border-yellow-500/20">Loại: {m.type}</span>
                            <span className="text-cyan-400 bg-cyan-500/5 px-1.5 py-0.5 rounded border border-cyan-500/20">Size: {m.size}</span>
                            {m.youtubeUrl && <span className="text-rose-400 bg-rose-500/5 px-1.5 py-0.5 rounded border border-rose-500/20 flex items-center gap-0.5"><Video className="w-2.5 h-2.5" /> Có Video</span>}
                            {m.fileData && <span className="text-emerald-400 bg-emerald-500/5 px-1.5 py-0.5 rounded border border-emerald-500/20 flex items-center gap-0.5"><FileText className="w-2.5 h-2.5" /> Có Tài liệu tải</span>}
                          </div>
                        </div>
                        <div className="flex gap-1.5 flex-shrink-0">
                          <button
                            onClick={() => {
                              setMatEditingId(m.id);
                              setMatTitle(m.title);
                              setMatType(m.type);
                              setMatSize(m.size);
                              setMatDesc(m.desc);
                              setMatColor(m.color);
                              setMatYoutube(m.youtubeUrl || "");
                              setMatFile(m.fileData || "");
                              setMatFileName(m.fileName || "");
                              showToast("Đã nạp học liệu lên form!", "success");
                            }}
                            className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white rounded-lg cursor-pointer"
                            title="Sửa học liệu"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => { onDeleteMaterial(m.id); showToast("Đã xóa học liệu giáo dục!", "success"); }}
                            className="p-1.5 bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/20 text-rose-400 rounded-lg cursor-pointer"
                            title="Xóa học liệu"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Directory of Good Deeds */}
              {activeTab === "deeds" && (
                <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-3xl space-y-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2 flex justify-between items-center">
                    <span>Nhật ký việc tốt rèn luyện học sinh ({goodDeeds.length})</span>
                    <span className="text-slate-500">Duyệt & Giám sát nhân cách</span>
                  </p>
                  <div className="space-y-2.5 max-h-[480px] overflow-y-auto custom-scrollbar pr-1">
                    {goodDeeds.map((d) => (
                      <div key={d.id} className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-850 flex justify-between items-start gap-4 text-xs hover:border-slate-750 transition-colors">
                        <div className="space-y-1 flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-extrabold text-white text-sm">{d.studentName}</p>
                            <span className="text-[10px] text-slate-500">Lớp {d.studentClass}</span>
                          </div>
                          <p className="text-[11px] text-slate-300 leading-relaxed italic mt-0.5">"{d.description}"</p>
                          <div className="flex flex-wrap gap-2 text-[9px] font-mono mt-1">
                            <span className="text-purple-400 bg-purple-500/5 px-1.5 py-0.5 rounded border border-purple-500/20">Nhóm: {d.category}</span>
                            <span className={`px-1.5 py-0.5 rounded border ${
                              d.status === "Đã duyệt" ? "text-emerald-400 bg-emerald-500/5 border-emerald-500/20" :
                              d.status === "Chờ duyệt" ? "text-amber-400 bg-amber-500/5 border-amber-500/20" :
                              "text-rose-400 bg-rose-500/5 border-rose-500/20"
                            }`}>
                              Trạng thái: {d.status}
                            </span>
                            <span className="text-cyan-400 bg-cyan-500/5 px-1.5 py-0.5 rounded border border-cyan-500/20">XP: +{d.xpAwarded}</span>
                            {d.youtubeUrl && <span className="text-rose-400 bg-rose-500/5 px-1.5 py-0.5 rounded border border-rose-500/20 flex items-center gap-0.5"><Video className="w-2.5 h-2.5" /> Có Minh chứng Video</span>}
                            {d.fileData && <span className="text-emerald-400 bg-emerald-500/5 px-1.5 py-0.5 rounded border border-emerald-500/20 flex items-center gap-0.5"><Image className="w-2.5 h-2.5" /> Có Ảnh đính kèm</span>}
                          </div>
                        </div>
                        <div className="flex gap-1.5 flex-shrink-0">
                          <button
                            onClick={() => {
                              setDeedEditingId(d.id);
                              setDeedStudentName(d.studentName);
                              setDeedStudentClass(d.studentClass);
                              setDeedDesc(d.description);
                              setDeedCategory(d.category);
                              setDeedStatus(d.status);
                              setDeedXp(d.xpAwarded);
                              setDeedYoutube(d.youtubeUrl || "");
                              setDeedFile(d.fileData || "");
                              setDeedFileName(d.fileData ? "Ảnh minh chứng hiện tại" : "");
                              showToast("Đã nạp nhật ký việc tốt lên form!", "success");
                            }}
                            className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white rounded-lg cursor-pointer"
                            title="Sửa nhật ký việc tốt"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => { onDeleteGoodDeed(d.id); showToast("Đã xóa nhật ký việc tốt!", "success"); }}
                            className="p-1.5 bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/20 text-rose-400 rounded-lg cursor-pointer"
                            title="Xóa việc tốt"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Directory of Students with XP Adjustment Forms */}
              {activeTab === "students" && (
                <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-3xl space-y-4">
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-2">Danh bạ điều chỉnh điểm rèn luyện nhanh</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">Nhấn "ĐIỀU CHỈNH" để can thiệp thiết lập trực tiếp XP rèn luyện của học sinh</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar">
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

                    {selectedStudentName ? (
                      <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl text-xs flex flex-col justify-between h-48">
                        <div>
                          <h4 className="font-bold text-white">Can thiệp điểm: {selectedStudentName}</h4>
                          <p className="text-[10px] text-slate-500 mt-1">Nhập số điểm XP rèn luyện mong muốn trực tiếp thiết lập</p>
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
                              THIẾT LẬP
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Live system feeds */
                      <div className="bg-slate-950/40 border border-slate-850 p-4 rounded-2xl text-xs flex flex-col justify-between h-48">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                          <RefreshCw className="w-3 h-3 text-cyan-400 animate-spin" /> Live logs giám sát hệ thống
                        </h4>
                        <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-850 h-32 overflow-y-auto custom-scrollbar font-mono text-[9px] text-cyan-500 leading-normal space-y-1">
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
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
};
