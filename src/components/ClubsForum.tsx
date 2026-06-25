import React, { useState } from "react";
import { Club, ClubMessage, StudentProfile } from "../types";
import { 
  Users, 
  Send, 
  MessageSquare, 
  Laptop, 
  Scale, 
  Sprout, 
  Milestone, 
  Plus, 
  Star,
  Video,
  Image as ImageIcon,
  FileText,
  Paperclip,
  X
} from "lucide-react";

interface ClubsForumProps {
  clubs: Club[];
  profile: StudentProfile;
  clubMessages: ClubMessage[];
  onJoinClub: (clubName: string) => void;
  onPostMessage: (
    clubName: string, 
    content: string, 
    youtubeUrl?: string, 
    fileData?: string, 
    fileName?: string,
    fileType?: "image" | "document"
  ) => void;
  onReportContribution: (clubName: string, text: string, xp: number) => void;
  isGlobalEditMode?: boolean;
  onAddClub?: (club: Club) => void;
  onUpdateClub?: (name: string, updated: Club) => void;
  onDeleteClub?: (name: string) => void;
}

export const ClubsForum: React.FC<ClubsForumProps> = ({
  clubs,
  profile,
  clubMessages,
  onJoinClub,
  onPostMessage,
  onReportContribution,
  isGlobalEditMode,
  onAddClub,
  onUpdateClub,
  onDeleteClub
}) => {
  const [selectedClubName, setSelectedClubName] = useState(clubs[0]?.name || "");
  const [messageText, setMessageText] = useState("");
  const [contributionText, setContributionText] = useState("");
  
  // Attachments state for chat messages
  const [chatYoutubeUrl, setChatYoutubeUrl] = useState("");
  const [chatFileData, setChatFileData] = useState("");
  const [chatFileName, setChatFileName] = useState("");
  const [chatFileType, setChatFileType] = useState<"image" | "document" | undefined>(undefined);
  const [showAttachMenu, setShowAttachMenu] = useState(false);

  // ==================== CLB EDIT FORM STATE ====================
  const [editingClubName, setEditingClubName] = useState<string | null>(null);
  const [formClubName, setFormClubName] = useState("");
  const [formClubDesc, setFormClubDesc] = useState("");
  const [formClubIcon, setFormClubIcon] = useState<"laptop" | "scale" | "sprout" | "users">("users");
  const [formClubColor, setFormClubColor] = useState("emerald");
  const [formClubGoal, setFormClubGoal] = useState("");
  const [formClubYt, setFormClubYt] = useState("");
  const [formClubFileData, setFormClubFileData] = useState("");
  const [formClubFileName, setFormClubFileName] = useState("");

  const handleEditClubClick = (club: Club, e: React.MouseEvent) => {
    e.stopPropagation(); // Stop selection of club
    setEditingClubName(club.name);
    setFormClubName(club.name);
    setFormClubDesc(club.description);
    setFormClubIcon(club.icon as any);
    setFormClubColor(club.color);
    setFormClubGoal(club.weeklyGoal);
    setFormClubYt(club.youtubeUrl || "");
    setFormClubFileData(club.fileData || "");
    setFormClubFileName(club.fileName || "");

    const el = document.getElementById("club-form-container");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleCancelClubEdit = () => {
    setEditingClubName(null);
    setFormClubName("");
    setFormClubDesc("");
    setFormClubIcon("users");
    setFormClubColor("emerald");
    setFormClubGoal("");
    setFormClubYt("");
    setFormClubFileData("");
    setFormClubFileName("");
  };

  const handleClubFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setFormClubFileData(reader.result);
        setFormClubFileName(file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleClubFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formClubName.trim() || !formClubDesc.trim() || !formClubGoal.trim()) {
      alert("Vui lòng điền đầy đủ Tên, Mô tả và Tiêu chí hoạt động!");
      return;
    }

    const payload: Club = {
      name: formClubName.trim(),
      description: formClubDesc.trim(),
      icon: formClubIcon,
      color: formClubColor,
      membersCount: editingClubName ? (clubs.find(c => c.name === editingClubName)?.membersCount || 10) : 10,
      weeklyGoal: formClubGoal.trim(),
      youtubeUrl: formClubYt.trim() || undefined,
      fileData: formClubFileData || undefined,
      fileName: formClubFileName || undefined
    };

    if (editingClubName) {
      if (onUpdateClub) onUpdateClub(editingClubName, payload);
    } else {
      if (onAddClub) onAddClub(payload);
    }
    handleCancelClubEdit();
  };

  const activeClub = clubs.find((c) => c.name === selectedClubName) || clubs[0];
  const activeMessages = clubMessages.filter((m) => m.clubName === selectedClubName);
  const isJoined = profile.joinedClubs.includes(selectedClubName);

  const getYoutubeId = (url?: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setChatFileData(reader.result);
        setChatFileName(file.name);
        const isImg = file.type.startsWith("image/");
        setChatFileType(isImg ? "image" : "document");
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePostMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() && !chatYoutubeUrl && !chatFileData) return;

    onPostMessage(
      selectedClubName,
      messageText.trim(),
      chatYoutubeUrl.trim() || undefined,
      chatFileData || undefined,
      chatFileName || undefined,
      chatFileType
    );

    // Reset fields
    setMessageText("");
    setChatYoutubeUrl("");
    setChatFileData("");
    setChatFileName("");
    setChatFileType(undefined);
    setShowAttachMenu(false);
  };

  const handleContributionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contributionText.trim()) return;
    onReportContribution(
      selectedClubName,
      `[BÁO CÁO VIỆC TỐT] ${contributionText.trim()}`,
      30
    );
    setContributionText("");
  };

  const getClubIcon = (iconName: string, color: string) => {
    const classes = `w-6 h-6 text-${color}-400`;
    switch (iconName) {
      case "laptop":
        return <Laptop className={classes} />;
      case "scale":
        return <Scale className={classes} />;
      case "sprout":
        return <Sprout className={classes} />;
      default:
        return <Users className={classes} />;
    }
  };

  return (
    <div className="space-y-6" id="clubs-forum-container">
      {/* Introduction */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-5 backdrop-blur-md">
        <h2 className="text-xl font-bold text-emerald-300 flex items-center gap-2">
          <Users className="w-6 h-6 text-emerald-400" /> Câu Lạc Bộ Học Đường LHP
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Tham gia các câu lạc bộ tuyên truyền văn hóa pháp luật, bảo vệ môi trường và phát triển kỹ năng mềm. Đăng tải ý kiến, video youtube rèn luyện hoặc tài liệu thảo luận cùng bạn học cả trường.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Clubs List */}
        <div className="lg:col-span-1 space-y-3">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Danh sách câu lạc bộ</p>
          {clubs.map((club) => {
            const hasJoined = profile.joinedClubs.includes(club.name);
            const isSelected = selectedClubName === club.name;

            return (
              <div
                key={club.name}
                onClick={() => setSelectedClubName(club.name)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? "bg-slate-900/80 border-emerald-500/50 shadow-md"
                    : "bg-slate-900/30 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/50"
                }`}
              >
                <div className="flex gap-3 items-start relative z-10">
                  <div className={`p-2.5 bg-slate-950 border border-slate-800 rounded-xl`}>
                    {getClubIcon(club.icon, club.color)}
                  </div>
                  <div className="space-y-1 text-left flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-slate-200 text-xs truncate flex-1">{club.name}</h3>
                      {isGlobalEditMode && (
                        <div className="flex gap-1 ml-2 flex-shrink-0 relative z-20">
                          <button
                            onClick={(e) => handleEditClubClick(club, e)}
                            className="p-1 bg-slate-950 hover:bg-purple-950 text-purple-400 hover:text-purple-300 rounded border border-slate-800 transition-all cursor-pointer"
                            title="Sửa CLB"
                          >
                            <Edit className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`Bạn có chắc chắn muốn xóa Câu lạc bộ "${club.name}" và toàn bộ tin nhắn liên quan?`)) {
                                if (onDeleteClub) onDeleteClub(club.name);
                              }
                            }}
                            className="p-1 bg-slate-950 hover:bg-rose-950 text-rose-400 hover:text-rose-300 rounded border border-slate-800 transition-all cursor-pointer"
                            title="Xóa CLB"
                          >
                            <Trash className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                      {club.description}
                    </p>
                    <div className="flex justify-between items-center text-[9px] pt-1 border-t border-slate-800 mt-1">
                      <span className="text-slate-400 font-semibold">
                        {club.membersCount + (hasJoined && !clubs.find(c => c.name === club.name)?.membersCount ? 1 : 0)} thành viên
                      </span>
                      {hasJoined ? (
                        <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded text-[8px] border border-emerald-500/20">
                          ĐÃ THAM GIA
                        </span>
                      ) : (
                        <span className="text-slate-500 font-medium">Chưa tham gia</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Quick Edit CLB Form */}
          {isGlobalEditMode && (
            <div id="club-form-container" className="bg-slate-950/60 border border-purple-500/30 rounded-2xl p-4 space-y-4 text-left">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <h4 className="font-bold text-xs text-purple-300 flex items-center gap-1">
                  {editingClubName ? "📝 CẬP NHẬT CÂU LẠC BỘ" : "➕ TẠO CÂU LẠC BỘ MỚI"}
                </h4>
                {editingClubName && (
                  <button type="button" onClick={handleCancelClubEdit} className="text-slate-500 hover:text-white">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <form onSubmit={handleClubFormSubmit} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold block" htmlFor="form-club-name-input">Tên Câu lạc bộ</label>
                  <input
                    type="text"
                    id="form-club-name-input"
                    value={formClubName}
                    onChange={(e) => setFormClubName(e.target.value)}
                    className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 outline-none focus:border-purple-500"
                    placeholder="Ví dụ: CLB Pháp luật xanh..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold block" htmlFor="form-club-desc-input">Mô tả ngắn</label>
                  <textarea
                    id="form-club-desc-input"
                    value={formClubDesc}
                    onChange={(e) => setFormClubDesc(e.target.value)}
                    className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 outline-none focus:border-purple-500 h-16 resize-none"
                    placeholder="Mô tả tôn chỉ hoạt động..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold block" htmlFor="form-club-goal-input">Mục tiêu hoạt động</label>
                  <input
                    type="text"
                    id="form-club-goal-input"
                    value={formClubGoal}
                    onChange={(e) => setFormClubGoal(e.target.value)}
                    className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 outline-none focus:border-purple-500"
                    placeholder="Ví dụ: Tuyên truyền an toàn giao thông tuần này..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold block" htmlFor="form-club-icon-select">Biểu tượng</label>
                    <select
                      id="form-club-icon-select"
                      value={formClubIcon}
                      onChange={(e) => setFormClubIcon(e.target.value as any)}
                      className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 outline-none"
                    >
                      <option value="users">Nhóm (Users)</option>
                      <option value="laptop">Công nghệ (Laptop)</option>
                      <option value="scale">Pháp lý (Scale)</option>
                      <option value="sprout">Đạo đức (Sprout)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold block" htmlFor="form-club-color-select">Màu sắc chủ đạo</label>
                    <select
                      id="form-club-color-select"
                      value={formClubColor}
                      onChange={(e) => setFormClubColor(e.target.value)}
                      className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 outline-none"
                    >
                      <option value="emerald">Emerald (Xanh lục)</option>
                      <option value="cyan">Cyan (Xanh lam)</option>
                      <option value="red">Red (Đỏ gạch)</option>
                      <option value="purple">Purple (Tím)</option>
                      <option value="amber">Amber (Vàng hổ phách)</option>
                    </select>
                  </div>
                </div>

                {/* Media Attachment Fields for CLB banner/intro */}
                <div className="space-y-2 border-t border-slate-800/80 pt-2">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase block" htmlFor="form-club-yt-url">Đường dẫn Youtube giới thiệu (nếu có)</label>
                    <input
                      type="url"
                      id="form-club-yt-url"
                      value={formClubYt}
                      onChange={(e) => setFormClubYt(e.target.value)}
                      placeholder="Dán link youtube rèn luyện..."
                      className="w-full text-[10px] p-2 bg-slate-900 border border-slate-800 rounded outline-none text-white focus:border-purple-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase block">Ảnh đại diện CLB (tải lên thiết bị)</label>
                    <input
                      type="file"
                      id="club-file-upload-form"
                      onChange={handleClubFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <label
                      htmlFor="club-file-upload-form"
                      className="w-full text-center text-[10px] p-2 bg-slate-900 border border-slate-800 rounded outline-none text-slate-400 hover:text-white block cursor-pointer truncate"
                    >
                      {formClubFileName ? `Đã chọn: ${formClubFileName}` : "Tải ảnh từ thiết bị..."}
                    </label>
                    {formClubFileData && (
                      <div className="mt-1 rounded overflow-hidden border border-slate-800 bg-slate-950 h-16">
                        <img src={formClubFileData} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-xl text-[10px] shadow-md transition-all cursor-pointer"
                  >
                    {editingClubName ? "CẬP NHẬT CLB" : "TẠO CÂU LẠC BỘ"}
                  </button>
                  {editingClubName && (
                    <button
                      type="button"
                      onClick={handleCancelClubEdit}
                      className="px-3 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl text-[10px]"
                    >
                      HỦY
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Right Side: Club Workspace (Details, Discussion & Contribution) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl p-5 space-y-4">
            {/* Active Club Stats & Join Button */}
            {activeClub && (
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800/80 pb-4">
                <div>
                  <h3 className="text-base font-black text-white">{activeClub.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    {activeClub.weeklyGoal}
                  </p>
                  
                  {/* Embedded youtube for active CLB */}
                  {activeClub.youtubeUrl && getYoutubeId(activeClub.youtubeUrl) && (
                    <div className="mt-2 text-left max-w-sm rounded-xl overflow-hidden border border-slate-800">
                      <iframe
                        src={`https://www.youtube.com/embed/${getYoutubeId(activeClub.youtubeUrl)}`}
                        title="Club Video"
                        className="w-full aspect-video"
                        allowFullScreen
                      ></iframe>
                    </div>
                  )}

                  {/* Attachment image for active CLB banner */}
                  {activeClub.fileData && (
                    <div className="mt-2 text-left max-w-sm rounded-xl overflow-hidden border border-slate-800 bg-slate-950 h-24">
                      <img src={activeClub.fileData} alt={activeClub.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  )}
                </div>
                <button
                  onClick={() => onJoinClub(activeClub.name)}
                  className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-black text-xs transition-all ${
                    isJoined
                      ? "bg-slate-800/60 border border-slate-700 text-slate-400 cursor-default"
                      : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-950/40 cursor-pointer"
                  }`}
                >
                  {isJoined ? "ĐÃ THAM GIA CLB" : "GIA NHẬP CLB NGAY"}
                </button>
              </div>
            )}

            {isJoined ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
                {/* Discussion Board */}
                <div className="space-y-3 flex flex-col h-[400px] justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" /> Diễn đàn thảo luận CLB
                    </p>
                    <div className="bg-slate-950/60 rounded-2xl border border-slate-800 p-3 h-[280px] overflow-y-auto custom-scrollbar space-y-2.5">
                      {activeMessages.length > 0 ? (
                        activeMessages.map((msg) => {
                          const ytId = getYoutubeId(msg.youtubeUrl);
                          return (
                            <div key={msg.id} className="text-xs space-y-0.5 text-left">
                              <div className="flex justify-between items-center text-[9px] font-semibold text-slate-400">
                                <span className="flex items-center gap-1 text-slate-300">
                                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
                                  {msg.sender}{" "}
                                  <span className="text-[8px] bg-slate-800 text-slate-400 px-1 rounded">
                                    {msg.role}
                                  </span>
                                </span>
                                <span className="text-[8px] font-mono">{msg.timestamp.split(" ")[1] || "12:00"}</span>
                              </div>
                              <div className={`p-2.5 rounded-2xl border leading-relaxed space-y-2 ${
                                msg.content.includes("[BÁO CÁO VIỆC TỐT]")
                                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                                  : "bg-slate-900 border-slate-850 text-slate-200"
                              }`}>
                                <p>{msg.content}</p>

                                {/* Media renders inside message card */}
                                {ytId && (
                                  <div className="rounded-xl overflow-hidden border border-slate-850 mt-1">
                                    <iframe
                                      src={`https://www.youtube.com/embed/${ytId}`}
                                      title="Youtube attachment"
                                      className="w-full aspect-video"
                                      allowFullScreen
                                    ></iframe>
                                  </div>
                                )}

                                {msg.fileData && msg.fileData.startsWith("data:image/") && (
                                  <div className="rounded-xl overflow-hidden border border-slate-850 mt-1 max-h-32 bg-slate-950">
                                    <img src={msg.fileData} alt="attachment" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                                  </div>
                                )}

                                {msg.fileData && !msg.fileData.startsWith("data:image/") && (
                                  <div className="mt-1 flex items-center gap-1.5 p-1.5 bg-slate-950 border border-slate-850 rounded-xl text-[10px]">
                                    <FileText className="w-4 h-4 text-cyan-400" />
                                    <a href={msg.fileData} download={msg.fileName || "tailieu.pdf"} className="text-cyan-400 hover:underline font-bold truncate block">
                                      Tải tài liệu: {msg.fileName || "Tệp đính kèm"}
                                    </a>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="h-full flex items-center justify-center text-slate-600 text-[11px] italic">
                          Chưa có thảo luận nào. Hãy gửi tin nhắn đầu tiên!
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Message Input Form with Attachments Support */}
                  <form onSubmit={handlePostMessageSubmit} className="space-y-2 text-left" id="chat-input-form">
                    
                    {/* Attachment preview / parameters box */}
                    {(chatYoutubeUrl || chatFileData) && (
                      <div className="p-2 bg-slate-950 border border-slate-850 rounded-xl text-[10px] text-slate-300 space-y-1 relative">
                        <button
                          type="button"
                          onClick={() => {
                            setChatYoutubeUrl("");
                            setChatFileData("");
                            setChatFileName("");
                            setChatFileType(undefined);
                          }}
                          className="absolute top-1.5 right-1.5 text-slate-500 hover:text-rose-400 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        {chatYoutubeUrl && (
                          <p className="truncate text-rose-400 font-semibold flex items-center gap-1">
                            <Video className="w-3 h-3" /> Youtube: {chatYoutubeUrl}
                          </p>
                        )}
                        {chatFileData && (
                          <p className="truncate text-cyan-400 font-semibold flex items-center gap-1">
                            {chatFileType === "image" ? <ImageIcon className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                            Tệp đính kèm: {chatFileName}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAttachMenu(!showAttachMenu)}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                          showAttachMenu ? "bg-slate-850 border-cyan-500/55 text-cyan-400" : "bg-slate-950 border-slate-850 text-slate-400 hover:text-white"
                        }`}
                        title="Đính kèm phương tiện"
                      >
                        <Paperclip className="w-4 h-4" />
                      </button>
                      
                      <input
                        type="text"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder="Viết tin nhắn thảo luận cùng CLB..."
                        className="flex-1 text-xs p-2.5 bg-slate-950 border border-slate-850 rounded-xl outline-none text-slate-100 focus:border-purple-500 placeholder-slate-600"
                      />
                      
                      <button
                        type="submit"
                        className="bg-purple-600 hover:bg-purple-700 text-white p-2.5 rounded-xl transition-all shadow-md cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Expandable attach overlay */}
                    {showAttachMenu && (
                      <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl grid grid-cols-2 gap-3 text-xs">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block" htmlFor="msg-youtube-url">Link Video Youtube</label>
                          <input
                            type="url"
                            id="msg-youtube-url"
                            value={chatYoutubeUrl}
                            onChange={(e) => setChatYoutubeUrl(e.target.value)}
                            placeholder="Dán link youtube..."
                            className="w-full text-[10px] p-2 bg-slate-900 border border-slate-800 rounded outline-none text-white focus:border-rose-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Tải ảnh/Tài liệu</label>
                          <input
                            type="file"
                            id="msg-file-upload"
                            onChange={handleFileChange}
                            accept="image/*,application/pdf"
                            className="hidden"
                          />
                          <label
                            htmlFor="msg-file-upload"
                            className="w-full text-center text-[10px] p-2 bg-slate-900 border border-slate-800 rounded outline-none text-slate-400 hover:text-white block cursor-pointer truncate"
                          >
                            {chatFileName ? "Đổi tệp" : "Chọn tệp..."}
                          </label>
                        </div>
                      </div>
                    )}
                  </form>
                </div>

                {/* Report Weekly Contribution Section */}
                <div className="space-y-4 bg-slate-950/40 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between h-[400px]">
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1">
                      <Star className="w-4 h-4 text-emerald-400 animate-pulse" /> BÁO CÁO ĐÓNG GÓP TUẦN CÁ NHÂN
                    </h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      Em vừa làm một hành động thiết thực của CLB hôm nay? Hãy viết lại ngắn gọn để công bố bảng tin và nhận ngay <span className="text-emerald-400 font-bold">+30 XP</span> điểm thưởng rèn luyện.
                    </p>
                  </div>

                  <form onSubmit={handleContributionSubmit} className="space-y-3 flex-1 flex flex-col justify-end">
                    <textarea
                      value={contributionText}
                      onChange={(e) => setContributionText(e.target.value)}
                      placeholder="Mô tả hành động của em (Ví dụ: Em đã gom được 5 vỏ chai nhựa gửi bưu điện trường, hoặc xóa 1 bình luận xúc phạm mạng...)"
                      className="w-full text-xs p-3 bg-slate-950 border border-slate-850 rounded-xl outline-none text-slate-100 focus:border-purple-500 placeholder-slate-600 h-28 resize-none leading-relaxed"
                    />
                    <button
                      type="submit"
                      className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-1"
                    >
                      <Plus className="w-4 h-4" /> BÁO CÁO NHẬN THƯỞNG (+30 XP)
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              /* If not joined */
              <div className="h-64 flex flex-col items-center justify-center text-center space-y-2 text-slate-500 bg-slate-950/40 rounded-2xl border border-slate-850/80 p-6">
                <Users className="w-8 h-8 text-slate-600 animate-pulse" />
                <p className="text-xs font-bold text-slate-400">KHU VỰC DÀNH CHO THÀNH VIÊN</p>
                <p className="text-[10px] text-slate-500 max-w-sm">
                  Hãy nhấn nút "Gia nhập CLB ngay" phía trên để cùng các bạn trao đổi bài viết, thảo luận học tập và đóng góp xây dựng xã hội trường lớp xanh tốt nhé!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
