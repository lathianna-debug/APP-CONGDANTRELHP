import React, { useState } from "react";
import { Club, ClubMessage, StudentProfile } from "../types";
import { Users, Send, MessageSquare, Laptop, Scale, Sprout, Milestone, Plus, Star } from "lucide-react";

interface ClubsForumProps {
  clubs: Club[];
  profile: StudentProfile;
  clubMessages: ClubMessage[];
  onJoinClub: (clubName: string) => void;
  onPostMessage: (clubName: string, content: string) => void;
  onReportContribution: (clubName: string, text: string, xp: number) => void;
}

export const ClubsForum: React.FC<ClubsForumProps> = ({
  clubs,
  profile,
  clubMessages,
  onJoinClub,
  onPostMessage,
  onReportContribution
}) => {
  const [selectedClubName, setSelectedClubName] = useState(clubs[0].name);
  const [messageText, setMessageText] = useState("");
  const [contributionText, setContributionText] = useState("");

  const activeClub = clubs.find((c) => c.name === selectedClubName) || clubs[0];
  const activeMessages = clubMessages.filter((m) => m.clubName === selectedClubName);
  const isJoined = profile.joinedClubs.includes(selectedClubName);

  const handlePostMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    onPostMessage(selectedClubName, messageText.trim());
    setMessageText("");
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
    <div className="space-y-6">
      {/* Introduction */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-5 backdrop-blur-md">
        <h2 className="text-xl font-bold text-emerald-300 flex items-center gap-2">
          <Users className="w-6 h-6 text-emerald-400" /> Câu Lạc Bộ Học Đường LHP
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Tham gia các câu lạc bộ tuyên truyền văn hóa pháp luật, bảo vệ môi trường và phát triển kỹ năng mềm. Tham gia thảo luận và báo cáo đóng góp để kiến tạo ngôi trường Lê Hồng Phong tươi xanh.
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
                    <h3 className="font-bold text-slate-200 text-xs truncate">{club.name}</h3>
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
        </div>

        {/* Right Side: Club Workspace (Details, Discussion & Contribution) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl p-5 space-y-4">
            {/* Active Club Stats & Join Button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800/80 pb-4">
              <div>
                <h3 className="text-base font-black text-white">{activeClub.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                  {activeClub.weeklyGoal}
                </p>
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

            {isJoined ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
                {/* Discussion Board */}
                <div className="space-y-3 flex flex-col h-[340px] justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" /> Diễn đàn thảo luận CLB
                    </p>
                    <div className="bg-slate-950/60 rounded-2xl border border-slate-800 p-3 h-[240px] overflow-y-auto custom-scrollbar space-y-2.5">
                      {activeMessages.length > 0 ? (
                        activeMessages.map((msg) => (
                          <div key={msg.id} className="text-xs space-y-0.5">
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
                            <div className={`p-2.5 rounded-2xl border leading-relaxed ${
                              msg.content.includes("[BÁO CÁO VIỆC TỐT]")
                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                                : "bg-slate-900 border-slate-850 text-slate-200"
                            }`}>
                              {msg.content}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="h-full flex items-center justify-center text-slate-600 text-[11px] italic">
                          Chưa có thảo luận nào. Hãy gửi tin nhắn đầu tiên!
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Message Input Form */}
                  <form onSubmit={handlePostMessageSubmit} className="flex gap-2">
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
                  </form>
                </div>

                {/* Report Weekly Contribution Section */}
                <div className="space-y-4 bg-slate-950/40 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between h-[340px]">
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
