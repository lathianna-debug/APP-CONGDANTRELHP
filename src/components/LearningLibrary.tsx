import React, { useState } from "react";
import { Library, Download, FileText, Check, ShieldAlert, Sparkles, AlertCircle, Info, Play, FileDigit } from "lucide-react";
import { LearningMaterial } from "../types";

interface LearningLibraryProps {
  materials: LearningMaterial[];
  showToast: (message: string, type: "success" | "error") => void;
}

export const LearningLibrary: React.FC<LearningLibraryProps> = ({ materials, showToast }) => {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<"library" | "infographic">("library");
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  const getYoutubeId = (url?: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleDownload = (mat: LearningMaterial) => {
    if (downloadingId) return;
    setDownloadingId(mat.id);
    setDownloadProgress(0);

    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setDownloadingId(null);
            if (mat.fileData) {
              const link = document.createElement("a");
              link.href = mat.fileData;
              link.download = mat.fileName || `${mat.title.toLowerCase().replace(/\s+/g, "_")}.pdf`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }
            showToast(`Đã tải xuống thành công tài liệu: "${mat.title}"!`, "success");
          }, 300);
          return 100;
        }
        return prev + 25;
      });
    }, 200);
  };

  const hotspots = [
    {
      id: "hs1",
      title: "Quyền Sống",
      icon: "❤️",
      description: "Trẻ em có quyền được bảo vệ tính mạng, được bảo đảm các điều kiện sống tốt nhất để phát triển thể chất và tinh thần lành mạnh.",
      legalCode: "Luật Trẻ em 2016 • Điều 12"
    },
    {
      id: "hs2",
      title: "Quyền Phát Triển",
      icon: "📚",
      description: "Được học tập, giáo dục toàn diện, phát triển năng khiếu, được vui chơi, giải trí và tiếp cận thông tin phù hợp với lứa tuổi.",
      legalCode: "Luật Trẻ em 2016 • Điều 16 & 17"
    },
    {
      id: "hs3",
      title: "Quyền Bảo Vệ",
      icon: "🛡️",
      description: "Được bảo vệ khỏi mọi hình thức xâm hại, bạo lực học đường, xâm phạm đời tư số, và bóc lột sức lao động trước độ tuổi.",
      legalCode: "Luật Trẻ em 2016 • Điều 21 & 22"
    },
    {
      id: "hs4",
      title: "Quyền Tham Gia",
      icon: "🗣️",
      description: "Được bày tỏ ý kiến, nguyện vọng về các vấn đề liên quan đến trẻ em; được tham gia hoạt động xã hội trường lớp phù hợp.",
      legalCode: "Luật Trẻ em 2016 • Điều 34"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Sub navigation tabs */}
      <div className="bg-slate-950/60 p-1.5 rounded-2xl flex border border-slate-800">
        <button
          onClick={() => setActiveTab("library")}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeTab === "library" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-slate-100"
          }`}
        >
          📂 Kho học liệu đa phương tiện
        </button>
        <button
          onClick={() => setActiveTab("infographic")}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeTab === "infographic" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-slate-100"
          }`}
        >
          🗺️ Sơ đồ tương tác quyền trẻ em
        </button>
      </div>

      {activeTab === "library" ? (
        /* ==================== SCREEN 1: DIGITAL MATERIALS ==================== */
        <div className="space-y-4">
          <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-5 backdrop-blur-md">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
              <Library className="w-5 h-5 text-purple-400" /> Thư viện tài nguyên giáo dục số Lê Hồng Phong
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Học sinh và phụ huynh có thể tự do tải xuống sơ đồ tư duy, truyện tranh và tài liệu kỹ năng để bổ trợ kiến thức đạo đức công dân.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {materials.map((mat) => (
              <div
                key={mat.id}
                className="bg-slate-900/40 rounded-3xl border border-slate-800 overflow-hidden shadow-xl hover:border-purple-500/30 transition-all flex flex-col justify-between"
              >
                {/* Visual header */}
                <div className={`h-24 bg-gradient-to-tr ${mat.color || "from-purple-500 to-indigo-600"} flex flex-col items-center justify-center text-slate-950 text-center p-3 relative`}>
                  <FileText className="w-6 h-6 mb-1 opacity-85" />
                  <span className="font-black text-xs tracking-wider uppercase">{mat.type}</span>
                  <span className="absolute bottom-1 right-2 text-[9px] font-mono opacity-70 font-semibold">{mat.size || "Liên kết"}</span>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <h4 className="font-extrabold text-slate-200 text-xs leading-snug">{mat.title}</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{mat.desc}</p>
                    
                    {/* YouTube Video Frame Embed */}
                    {mat.youtubeUrl && getYoutubeId(mat.youtubeUrl) && (
                      <div className="mt-2.5 overflow-hidden rounded-xl border border-slate-800">
                        <iframe
                          src={`https://www.youtube.com/embed/${getYoutubeId(mat.youtubeUrl)}`}
                          title="YouTube video player"
                          className="w-full aspect-video"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    )}

                    {/* Image Preview */}
                    {mat.fileData && mat.fileData.startsWith("data:image/") && (
                      <div className="w-full h-28 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 mt-2">
                        <img 
                          src={mat.fileData} 
                          alt={mat.title} 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}
                  </div>

                  {downloadingId === mat.id ? (
                    /* Downloading progress bar */
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className="text-cyan-400 font-bold">Đang kết nối...</span>
                        <span className="text-slate-400">{downloadProgress}%</span>
                      </div>
                      <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-850">
                        <div
                          className="bg-cyan-400 h-full transition-all duration-200"
                          style={{ width: `${downloadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  ) : (
                    /* Download button */
                    <button
                      onClick={() => handleDownload(mat)}
                      disabled={downloadingId !== null}
                      className="w-full bg-slate-950 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-900/40 text-slate-200 font-bold py-2 rounded-xl text-[11px] transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-purple-400" /> 
                      {mat.fileData ? "TẢI ĐÍNH KÈM THÀNH CÔNG" : "TẢI FILE MIỄN PHÍ"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* ==================== SCREEN 2: INTERACTIVE INFOGRAPHIC ==================== */
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 space-y-5">
          <div className="text-center max-w-md mx-auto space-y-1.5">
            <h3 className="font-extrabold text-sm text-slate-200">SƠ ĐỒ TƯƠNG TÁC: 4 NHÓM QUYỀN TRẺ EM</h3>
            <p className="text-xs text-slate-400">
              Nhấp vào từng hotspot quyền để khám phá các thông tin pháp lý ý nghĩa trong Luật Trẻ em Việt Nam 2016
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Graphical Hotspots Board */}
            <div className="bg-slate-950/60 p-6 rounded-3xl border border-slate-850 relative min-h-[220px] flex items-center justify-center">
              {/* Central Shield logo */}
              <div className="absolute w-24 h-24 rounded-full bg-gradient-to-tr from-purple-600/20 to-indigo-600/20 border border-purple-500/30 flex items-center justify-center animate-pulse">
                <Sparkles className="w-10 h-10 text-purple-400" />
              </div>

              {/* Hotspot buttons arrayed in a circle/cross */}
              <div className="relative w-full h-40 flex items-center justify-center">
                {/* 1. Life (Top) */}
                <button
                  onClick={() => setActiveHotspot("hs1")}
                  className={`absolute -top-2 px-3 py-1.5 rounded-full border text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    activeHotspot === "hs1" ? "bg-red-500/20 border-red-500 text-red-300 scale-105" : "bg-slate-900 border-slate-800 text-slate-400"
                  }`}
                >
                  ❤️ Quyền Sống
                </button>
                {/* 2. Development (Right) */}
                <button
                  onClick={() => setActiveHotspot("hs2")}
                  className={`absolute right-0 px-3 py-1.5 rounded-full border text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    activeHotspot === "hs2" ? "bg-amber-500/20 border-amber-500 text-amber-300 scale-105" : "bg-slate-900 border-slate-800 text-slate-400"
                  }`}
                >
                  📚 Phát triển
                </button>
                {/* 3. Protection (Left) */}
                <button
                  onClick={() => setActiveHotspot("hs3")}
                  className={`absolute left-0 px-3 py-1.5 rounded-full border text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    activeHotspot === "hs3" ? "bg-cyan-500/20 border-cyan-500 text-cyan-300 scale-105" : "bg-slate-900 border-slate-800 text-slate-400"
                  }`}
                >
                  🛡️ Bảo vệ
                </button>
                {/* 4. Participate (Bottom) */}
                <button
                  onClick={() => setActiveHotspot("hs4")}
                  className={`absolute -bottom-2 px-3 py-1.5 rounded-full border text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    activeHotspot === "hs4" ? "bg-emerald-500/20 border-emerald-500 text-emerald-300 scale-105" : "bg-slate-900 border-slate-800 text-slate-400"
                  }`}
                >
                  🗣️ Tham gia
                </button>
              </div>
            </div>

            {/* Explanatory Overlay Panel */}
            <div className="bg-slate-950/40 p-5 rounded-3xl border border-slate-850 flex flex-col justify-center min-h-[220px]">
              {activeHotspot ? (
                (() => {
                  const hs = hotspots.find((h) => h.id === activeHotspot)!;
                  return (
                    <div className="space-y-3.5 text-xs animate-fade-in">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{hs.icon}</span>
                        <div>
                          <h4 className="font-extrabold text-sm text-slate-100">{hs.title}</h4>
                          <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">{hs.legalCode}</span>
                        </div>
                      </div>
                      <p className="text-slate-300 leading-relaxed font-semibold">{hs.description}</p>
                      <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-850 text-[10px] text-slate-500 flex items-center gap-1.5">
                        <Info className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                        <span>Học sinh Lê Hồng Phong có nghĩa vụ học tốt để hoàn thành và trân trọng quyền lợi của mình.</span>
                      </div>
                    </div>
                  );
                })()
              ) : (
                /* Prompt before selection */
                <div className="text-center text-slate-500 italic space-y-1 py-6">
                  <ShieldAlert className="w-8 h-8 text-slate-600 mx-auto mb-2 animate-pulse" />
                  <p className="text-xs font-bold text-slate-400">CHỌN HOTSPOT TRÊN SƠ ĐỒ</p>
                  <p className="text-[10px] max-w-xs mx-auto">
                    Hãy nhấp vào một trong các cánh bướm quyền để nhận diện chi tiết luật định bảo vệ trẻ em Việt Nam.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
