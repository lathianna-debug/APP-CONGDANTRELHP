import React, { useState } from "react";
import { StudentProfile, GoodDeed } from "../types";
import { Sprout, BookOpen, Plus, Heart, Calendar, Clock, Star, TreePine } from "lucide-react";

interface MoralTreeProps {
  profile: StudentProfile;
  goodDeeds: GoodDeed[];
  onAddGoodDeed: (category: "Đạo đức" | "Pháp luật" | "Kỹ năng" | "Văn minh", desc: string) => void;
  onWaterTree: () => void;
  lastWatered: string | null;
}

export const MoralTree: React.FC<MoralTreeProps> = ({
  profile,
  goodDeeds,
  onAddGoodDeed,
  onWaterTree,
  lastWatered
}) => {
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<"Đạo đức" | "Pháp luật" | "Kỹ năng" | "Văn minh">("Đạo đức");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    onAddGoodDeed(category, description);
    setDescription("");
  };

  // Determine tree stage based on XP
  // Base XP starts at 2350
  const getTreeStage = () => {
    if (profile.xp >= 3200) {
      return {
        title: "Cây quả vũ trụ Hoàng Kim 🌟",
        description: "Cây đạo đức của bạn đã trĩu quả chín rộ, tỏa hào quang rạng rỡ khắp trường học LHP!",
        color: "from-amber-400 via-pink-500 to-purple-600",
        icon: "🍍",
        scale: 1.35,
        leaves: "fill-pink-500",
        hasFruits: true,
        hasFlowers: true,
      };
    } else if (profile.xp >= 2800) {
      return {
        title: "Cây đại thụ nở hoa Thần Kỳ 🌸",
        description: "Những đóa hoa neon lung linh đã nở rộ trên bạt ngàn tán lá xanh mướt.",
        color: "from-cyan-400 via-emerald-400 to-indigo-500",
        icon: "🌸",
        scale: 1.2,
        leaves: "fill-cyan-400",
        hasFruits: false,
        hasFlowers: true,
      };
    } else if (profile.xp >= 2500) {
      return {
        title: "Cây phát triển rực rỡ 🌱",
        description: "Tán lá sum suê đang vươn cao khỏe mạnh nhờ những việc tốt mỗi ngày.",
        color: "from-emerald-400 to-teal-500",
        icon: "🍃",
        scale: 1.05,
        leaves: "fill-emerald-400",
        hasFruits: false,
        hasFlowers: false,
      };
    } else {
      return {
        title: "Mầm non đạo đức mới nhú 🌱",
        description: "Hạt giống bé nhỏ đang bắt đầu hấp thụ dưỡng chất từ những bài học kỹ năng đầu tiên.",
        color: "from-green-500 to-emerald-600",
        icon: "🌱",
        scale: 0.9,
        leaves: "fill-green-500",
        hasFruits: false,
        hasFlowers: false,
      };
    }
  };

  const stage = getTreeStage();

  return (
    <div className="space-y-6">
      {/* Introduction Card */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-5 backdrop-blur-md">
        <h2 className="text-xl font-bold text-cyan-300 flex items-center gap-2">
          <TreePine className="w-6 h-6 text-cyan-400 animate-pulse" /> Cây Năng Lượng Đạo Đức LHP
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Hành trình rèn luyện nhân cách được số hóa sinh động. Cây vũ trụ của em sẽ phát triển mạnh mẽ, nở hoa rực rỡ tương ứng với số lượng việc tốt và sứ mệnh hoàn thành.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dynamic Tree Visualizer */}
        <div className="bg-slate-900/40 backdrop-blur-xl p-6 rounded-3xl border border-slate-800 flex flex-col items-center justify-center space-y-5 text-center relative overflow-hidden group">
          <div className="absolute top-3 left-3 bg-slate-950/80 border border-slate-800/80 px-3 py-1 rounded-full text-[10px] text-slate-400 flex items-center gap-1">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
            Trạng thái cây: <span className="font-bold text-emerald-400">Khỏe mạnh</span>
          </div>

          <h3 className="font-extrabold text-xs text-slate-400 tracking-wider uppercase">Cây Đạo Đức Vũ Trụ</h3>

          {/* SVG Glowing Tree Graph */}
          <div className="relative w-48 h-64 flex flex-col items-center justify-end">
            <svg
              viewBox="0 0 200 240"
              className="w-full h-full transition-transform duration-700"
              style={{ transform: `scale(${stage.scale})` }}
            >
              {/* Glow filter */}
              <defs>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <linearGradient id="trunkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#78350f" />
                  <stop offset="100%" stopColor="#451a03" />
                </linearGradient>
              </defs>

              {/* Background ambient ring */}
              <circle
                cx="100"
                cy="110"
                r="45"
                fill="none"
                stroke="url(#trunkGrad)"
                strokeWidth="1"
                strokeDasharray="4 4"
                className="opacity-30 animate-spin"
                style={{ animationDuration: "25s" }}
              />

              {/* Trunk/Branches */}
              <path
                d="M100 200 L100 130 C100 110 80 100 70 90 M100 145 C100 120 120 110 130 95 M100 170 C102 150 115 140 122 132 M100 110 L100 75"
                stroke="url(#trunkGrad)"
                strokeWidth="7"
                strokeLinecap="round"
                fill="none"
              />

              {/* Foliage Circles with glows */}
              <circle cx="100" cy="70" r="28" className={stage.leaves} fillOpacity="0.85" filter="url(#glow)" />
              <circle cx="70" cy="90" r="20" className={stage.leaves} fillOpacity="0.8" filter="url(#glow)" />
              <circle cx="130" cy="95" r="22" className={stage.leaves} fillOpacity="0.8" filter="url(#glow)" />
              <circle cx="122" cy="132" r="14" className={stage.leaves} fillOpacity="0.75" />

              {/* Sparkle/Glow dots inside foliage */}
              <circle cx="100" cy="70" r="1.5" fill="#ffffff" />
              <circle cx="90" cy="65" r="1" fill="#ffffff" />
              <circle cx="110" cy="75" r="1" fill="#ffffff" />
              <circle cx="70" cy="90" r="1" fill="#ffffff" />
              <circle cx="130" cy="95" r="1" fill="#ffffff" />

              {/* Dynamic Flowers (Neon pink glow circles) */}
              {stage.hasFlowers && (
                <>
                  <circle cx="90" cy="60" r="4" fill="#ec4899" filter="url(#glow)" className="animate-pulse" />
                  <circle cx="115" cy="65" r="3.5" fill="#ec4899" filter="url(#glow)" />
                  <circle cx="65" cy="85" r="4.5" fill="#f43f5e" filter="url(#glow)" className="animate-bounce" style={{ animationDuration: "3s" }} />
                  <circle cx="135" cy="90" r="4" fill="#a855f7" filter="url(#glow)" />
                  <circle cx="125" cy="125" r="3" fill="#f43f5e" />
                </>
              )}

              {/* Dynamic Fruits (Glowing amber stars or gold spheres) */}
              {stage.hasFruits && (
                <>
                  <circle cx="100" cy="78" r="5" fill="#fbbf24" filter="url(#glow)" className="animate-pulse" />
                  <circle cx="75" cy="95" r="4.5" fill="#fbbf24" filter="url(#glow)" />
                  <circle cx="125" cy="102" r="4.5" fill="#f59e0b" filter="url(#glow)" />
                </>
              )}

              {/* Ground Soil */}
              <ellipse cx="100" cy="205" rx="55" ry="10" fill="#0f172a" stroke="#334155" strokeWidth="2" />
              <text x="100" y="209" textAnchor="middle" fill="#22d3ee" fontSize="8" fontWeight="bold" letterSpacing="1">
                ĐẤT HỌC LÀNH MẠNH
              </text>
            </svg>

            {/* Floating leaf simulation */}
            <div className="absolute inset-0 pointer-events-none">
              <span className="absolute text-emerald-400 text-xs animate-bounce opacity-30 top-1/4 left-1/3">🍃</span>
              <span className="absolute text-pink-400 text-xs animate-pulse opacity-40 top-1/2 right-1/4">🌸</span>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-slate-400">Bậc rèn luyện hiện tại:</p>
            <h4 className={`text-base font-black bg-gradient-to-r ${stage.color} bg-clip-text text-transparent`}>
              {stage.title}
            </h4>
            <p className="text-[11px] text-slate-300 leading-relaxed max-w-sm">
              {stage.description}
            </p>
          </div>

          {/* Water the tree button */}
          <button
            onClick={onWaterTree}
            className="w-full bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 hover:border-cyan-500 text-cyan-300 font-extrabold text-xs py-2.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Star className="w-4 h-4 text-cyan-400 animate-spin" />
            Tưới nước & Chăm sóc cây (+30 XP ngày)
          </button>
          {lastWatered && (
            <p className="text-[10px] text-slate-500 font-mono">
              Lần tưới gần nhất: {lastWatered}
            </p>
          )}
        </div>

        {/* Good Deed Diary Logger */}
        <div className="bg-slate-900/40 backdrop-blur-xl p-6 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <h3 className="font-bold text-slate-200 text-xs uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-pink-400" /> NHẬT KÝ VIỆC TỐT LÊ HỒNG PHONG
            </h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Hãy viết lại những việc làm tử tế, biết ơn hoặc giúp ích cho cộng đồng ngày hôm nay. Ghi chép ngay để nhận <span className="text-emerald-400 font-bold">+40 XP</span>. Thầy cô phê duyệt duyệt sẽ nhận thêm <span className="text-pink-400 font-bold">+50 XP</span>!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phân loại việc làm tốt</label>
              <div className="grid grid-cols-4 gap-2">
                {(["Đạo đức", "Pháp luật", "Kỹ năng", "Văn minh"] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                      category === cat
                        ? "bg-purple-600/30 text-purple-300 border-purple-500"
                        : "bg-slate-950/60 text-slate-400 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Chi tiết hành động thiện chí</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-xs p-3 bg-slate-950/80 rounded-2xl border border-slate-800 text-slate-100 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none h-24 resize-none placeholder-slate-600 leading-relaxed"
                placeholder="Ví dụ: Em đã giúp bạn Linh giảng bài Toán hình khó hiểu, nhặt rác giúp cô lao công ở sân trường khối 7..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-black text-xs py-2.5 rounded-xl transition-all shadow-lg shadow-pink-500/20 flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> GHI CHÉP VIỆC TỐT (+40 XP)
            </button>
          </form>

          {/* Historical Logs with Scroll */}
          <div className="space-y-2.5">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-1.5">
              Nhật ký cá nhân vừa ghi chép
            </p>
            <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-1">
              {goodDeeds
                .filter((d) => d.studentName === profile.name || d.studentName === "Trần Minh Anh")
                .map((deed) => (
                  <div key={deed.id} className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="font-bold text-cyan-400 flex items-center gap-1">
                        <Star className="w-3 h-3" /> {deed.category}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${
                            deed.status === "Đã duyệt"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : deed.status === "Đã từ chối"
                              ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                              : "bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse"
                          }`}
                        >
                          {deed.status}
                        </span>
                        <span className="text-emerald-400 font-bold">+{deed.xpAwarded} XP</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-1.5 leading-relaxed">{deed.description}</p>
                    <div className="flex items-center gap-3 text-[9px] text-slate-500 mt-1 font-mono">
                      <span className="flex items-center gap-0.5">
                        <Calendar className="w-2.5 h-2.5" /> {deed.timestamp.split(" ")[0]}
                      </span>
                      <span className="flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5" /> {deed.timestamp.split(" ")[1] || "09:00"}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
