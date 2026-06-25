import React, { useState } from "react";
import { GoodDeed, Quest, StudentProfile } from "../types";
import { Notebook, Check, X, Send, Award, Heart, ShieldAlert, Sparkles, Plus, AlertCircle } from "lucide-react";

interface TeacherParentPortalsProps {
  viewMode: "teacher" | "parent";
  profile: StudentProfile;
  onAwardXpToStudent: (studentName: string, xp: number) => void;
  goodDeeds: GoodDeed[];
  onApproveGoodDeed: (deedId: string, status: "Đã duyệt" | "Đã từ chối") => void;
  quests: Quest[];
  onAddQuestByTeacher: (quest: Omit<Quest, "id" | "completed">) => void;
  onSendEncouragement: (message: string) => void;
  encouragementMessages: { text: string; sender: string; claimed: boolean }[];
  showToast: (message: string, type: "success" | "error") => void;
}

export const TeacherParentPortals: React.FC<TeacherParentPortalsProps> = ({
  viewMode,
  profile,
  onAwardXpToStudent,
  goodDeeds,
  onApproveGoodDeed,
  quests,
  onAddQuestByTeacher,
  onSendEncouragement,
  encouragementMessages,
  showToast
}) => {
  // Teacher Quest Form states
  const [questTitle, setQuestTitle] = useState("");
  const [questCategory, setQuestCategory] = useState<"Đạo đức" | "Pháp luật" | "Kỹ năng" | "Văn minh">("Đạo đức");
  const [questXp, setQuestXp] = useState(60);
  const [questDesc, setQuestDesc] = useState("");

  // Parent encouragement form state
  const [parentMessage, setParentMessage] = useState("");

  const handleCreateQuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questTitle.trim()) {
      showToast("Vui lòng điền tên nhiệm vụ rèn luyện mới!", "error");
      return;
    }

    onAddQuestByTeacher({
      title: questTitle.trim(),
      category: questCategory,
      xp: Number(questXp),
      description: questDesc.trim() || undefined
    });

    setQuestTitle("");
    setQuestDesc("");
    setQuestXp(60);
    showToast(`Đã xuất bản nhiệm vụ mới: "${questTitle}" thành công!`, "success");
  };

  const handleApproveDeed = (deed: GoodDeed, status: "Đã duyệt" | "Đã từ chối") => {
    onApproveGoodDeed(deed.id, status);
    if (status === "Đã duyệt") {
      onAwardXpToStudent(deed.studentName, deed.xpAwarded);
      showToast(`Đã duyệt việc tốt cho ${deed.studentName}. Thưởng +${deed.xpAwarded} XP rèn luyện!`, "success");
    } else {
      showToast(`Đã từ chối việc tốt của ${deed.studentName}.`, "error");
    }
  };

  const handleSendParentMsgSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentMessage.trim()) return;
    onSendEncouragement(parentMessage.trim());
    setParentMessage("");
    showToast("Gửi lời động viên đến bảng tin học sinh thành công! (+Hạt giống yêu thương)", "success");
  };

  return (
    <div className="space-y-6">
      {/* ==================== SCREEN 1: TEACHER PORTAL ==================== */}
      {viewMode === "teacher" && (
        <div className="space-y-6">
          {/* Welcome and Introduction */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-5 backdrop-blur-md">
            <h2 className="text-xl font-bold text-emerald-300 flex items-center gap-2">
              <Notebook className="w-6 h-6 text-emerald-400" /> Cổng Nghiệp Vụ Giáo Viên THCS Lê Hồng Phong
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Thầy cô có thể ban hành các nhiệm vụ rèn luyện tuần mới cho cả lớp và trực tiếp xem xét, phê duyệt Nhật ký việc tốt để trao thưởng điểm tích luỹ rèn luyện (XP) cho học sinh.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Create Quest Column */}
            <div className="bg-slate-900/40 p-5 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="font-bold text-slate-200 text-xs uppercase tracking-wider border-b border-slate-800 pb-2">
                Ban hành nhiệm vụ rèn luyện mới
              </h3>

              <form onSubmit={handleCreateQuest} className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tên nhiệm vụ</label>
                  <input
                    type="text"
                    value={questTitle}
                    onChange={(e) => setQuestTitle(e.target.value)}
                    placeholder="Ví dụ: Tham gia dọn vệ sinh bồn hoa học đường tuần mới"
                    className="w-full text-xs p-3 bg-slate-950 border border-slate-850 rounded-xl outline-none text-slate-100 focus:border-purple-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phân loại giá trị</label>
                    <select
                      value={questCategory}
                      onChange={(e) => setQuestCategory(e.target.value as any)}
                      className="w-full p-2.5 bg-slate-950 border border-slate-850 rounded-lg outline-none text-slate-200"
                    >
                      <option value="Đạo đức">Đạo đức</option>
                      <option value="Pháp luật">Pháp luật</option>
                      <option value="Kỹ năng">Kỹ năng</option>
                      <option value="Văn minh">Văn minh</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phần thưởng (XP)</label>
                    <input
                      type="number"
                      value={questXp}
                      onChange={(e) => setQuestXp(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-950 border border-slate-850 rounded-lg outline-none text-slate-200"
                      min={10}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mô tả hướng dẫn rèn luyện</label>
                  <textarea
                    value={questDesc}
                    onChange={(e) => setQuestDesc(e.target.value)}
                    placeholder="Nhập hướng dẫn cụ thể cho học sinh..."
                    className="w-full text-xs p-3 bg-slate-950 border border-slate-850 rounded-xl outline-none text-slate-100 focus:border-purple-500 h-20 resize-none leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs py-3 rounded-xl transition-all shadow-lg"
                >
                  BAN HÀNH NHIỆM VỤ LHP
                </button>
              </form>
            </div>

            {/* Approve Good Deeds Column */}
            <div className="bg-slate-900/40 p-5 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="font-bold text-slate-200 text-xs uppercase tracking-wider border-b border-slate-800 pb-2">
                Duyệt nhật ký việc tốt học sinh
              </h3>

              <div className="space-y-3 max-h-[340px] overflow-y-auto custom-scrollbar pr-1">
                {goodDeeds.filter((d) => d.status === "Chờ duyệt").length > 0 ? (
                  goodDeeds
                    .filter((d) => d.status === "Chờ duyệt")
                    .map((deed) => (
                      <div
                        key={deed.id}
                        className="p-3.5 bg-slate-950/60 border border-slate-850 rounded-2xl space-y-2.5 text-xs text-left"
                      >
                        <div className="flex justify-between items-center text-[10px] font-semibold text-slate-400 border-b border-slate-900 pb-1.5">
                          <span>
                            Học sinh: <span className="font-bold text-white">{deed.studentName}</span> (Lớp {deed.studentClass})
                          </span>
                          <span className="text-purple-400 font-bold bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20">
                            {deed.category}
                          </span>
                        </div>
                        <p className="text-slate-300 leading-relaxed italic">"{deed.description}"</p>
                        <div className="flex justify-between items-center pt-1">
                          <span className="text-[10px] text-amber-400 font-bold">Thưởng: +{deed.xpAwarded} XP</span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApproveDeed(deed, "Đã từ chối")}
                              className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/20 text-rose-400 rounded-lg font-bold text-[10px] cursor-pointer"
                            >
                              TỪ CHỐI
                            </button>
                            <button
                              onClick={() => handleApproveDeed(deed, "Đã duyệt")}
                              className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-lg font-black text-[10px] cursor-pointer"
                            >
                              PHÊ DUYỆT
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="h-48 flex flex-col items-center justify-center text-slate-500 italic text-[11px] space-y-1">
                    <Check className="w-8 h-8 text-slate-600" />
                    <span>Hiện chưa có việc tốt nào đang xếp hàng chờ duyệt.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== SCREEN 2: PARENT PORTAL ==================== */}
      {viewMode === "parent" && (
        <div className="space-y-6">
          {/* Welcome Header */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-5 backdrop-blur-md">
            <h2 className="text-xl font-bold text-orange-300 flex items-center gap-2">
              <Heart className="w-6 h-6 text-orange-400 animate-pulse" /> Sổ Học Bạ Đồng Hành Phụ Huynh Lê Hồng Phong
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Phụ huynh có thể kết nối xem thông số rèn luyện đạo đức thực tế của học sinh học tại trường và gửi những lời động viên ngọt ngào nhất tới bảng tin của con.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Child Profile Report */}
            <div className="lg:col-span-1 bg-slate-900/40 p-5 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="font-bold text-slate-200 text-xs uppercase tracking-wider border-b border-slate-800/80 pb-2">
                Học sinh: Trần Minh Anh (Lớp 7A5)
              </h3>

              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between items-center p-3 bg-slate-950/60 rounded-xl border border-slate-850">
                  <span className="text-slate-400">Điểm số rèn luyện tích lũy</span>
                  <span className="font-bold font-mono text-cyan-400">{profile.xp.toLocaleString()} XP</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-950/60 rounded-xl border border-slate-850">
                  <span className="text-slate-400">Cấp độ rèn luyện nhân cách</span>
                  <span className="font-extrabold text-purple-400">Cấp {profile.level}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-950/60 rounded-xl border border-slate-850">
                  <span className="text-slate-400">Tổng số việc làm tốt đã ghi</span>
                  <span className="font-bold text-emerald-400">{goodDeeds.filter(d => d.studentName === "Trần Minh Anh" || d.studentName === profile.name).length} Việc tốt</span>
                </div>
              </div>

              {/* Remarks Box */}
              <div className="bg-slate-950/60 border border-slate-850 p-4 rounded-2xl text-xs space-y-2 leading-relaxed">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <AlertCircle className="w-4 h-4 text-cyan-400" /> Nhận xét từ giáo viên chủ nhiệm
                </span>
                <p className="text-slate-300 font-semibold italic">
                  "Em Minh Anh luôn hoàn thành xuất sắc các thử thách ứng xử mạng văn minh và tích cực tương tác, chia sẻ bài tập cùng bạn bè. Cây rèn luyện nhân cách của em phát triển rất tốt!"
                </p>
              </div>
            </div>

            {/* Word of encouragement form */}
            <div className="lg:col-span-2 bg-slate-900/40 p-5 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-4 min-h-[300px]">
              <div className="space-y-2">
                <h3 className="font-bold text-slate-200 text-xs uppercase tracking-wider flex items-center gap-1">
                  <Heart className="w-4 h-4 text-pink-400 animate-pulse" /> GỬI LỜI ĐỘNG VIÊN ĐẾN CON YÊU
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Những câu chữ ấm áp đầy động lực từ cha mẹ chính là nguồn năng lượng tuyệt diệu tiếp sức cho con vươn cao. Nhắn gửi ngay để tạo ra <span className="text-pink-400 font-bold">Hạt mầm yêu thương</span> trên bảng tin trang chủ của con, thưởng động lực <span className="text-emerald-400 font-bold">+15 XP</span> khi con nhấp chọn!
                </p>
              </div>

              <form onSubmit={handleSendParentMsgSubmit} className="space-y-3 flex-1 flex flex-col justify-end">
                <textarea
                  value={parentMessage}
                  onChange={(e) => setParentMessage(e.target.value)}
                  placeholder="Ví dụ: Bố mẹ rất tự hào về con yêu. Con hãy tiếp tục rèn kỹ năng thật tốt và luôn mỉm cười nhé! Yêu con..."
                  className="w-full text-xs p-3 bg-slate-950 border border-slate-850 rounded-xl outline-none text-slate-100 focus:border-pink-500 placeholder-slate-600 h-28 resize-none leading-relaxed"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-black text-xs py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-1.5"
                >
                  <Send className="w-4 h-4" /> PHÁT HÀNH LỜI ĐỘNG VIÊN
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
