import React, { useState, useEffect } from "react";
import { QuizQuestion, StudentProfile } from "../types";
import { Bell, ArrowRight, RefreshCw, Sparkles, Scale, AlertCircle, Shuffle, CheckCircle, Award } from "lucide-react";

interface QuizArenaProps {
  quizzes: QuizQuestion[];
  profile: StudentProfile;
  onAwardXp: (xp: number, badgeIdToUnlock?: string) => void;
  showToast: (message: string, type: "success" | "error") => void;
}

export const QuizArena: React.FC<QuizArenaProps> = ({ quizzes, profile, onAwardXp, showToast }) => {
  const [activeSubGame, setActiveSubGame] = useState<"quiz" | "wheel" | "court" | "match">("quiz");

  // ==================== 1. GOLDEN BELL QUIZ STATE ====================
  const [quizIdx, setQuizIdx] = useState(0);
  const [selectedAns, setSelectedAns] = useState<number | null>(null);
  const [quizIsAnswered, setQuizIsAnswered] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQuiz = quizzes[quizIdx] || quizzes[0];

  const handleSelectAnswer = (ansIdx: number) => {
    if (quizIsAnswered) return;
    setSelectedAns(ansIdx);
    setQuizIsAnswered(true);

    const isCorrect = ansIdx === currentQuiz.answer;
    if (isCorrect) {
      setCorrectAnswersCount((prev) => prev + 1);
      const isLastQuiz = quizIdx === quizzes.length - 1;
      const willBeAllCorrect = correctAnswersCount + 1 === quizzes.length;
      
      onAwardXp(currentQuiz.xp, isLastQuiz && willBeAllCorrect ? "b4" : undefined);
      showToast(`Hoàn hảo! Đáp án chính xác. Bạn được thưởng +${currentQuiz.xp} XP!`, "success");
    } else {
      showToast("Đáp án chưa chính xác, hãy đọc kỹ lời giải màu xanh lá cây nhé!", "error");
    }
  };

  const handleNextQuiz = () => {
    if (quizIdx < quizzes.length - 1) {
      setQuizIdx((prev) => prev + 1);
      setSelectedAns(null);
      setQuizIsAnswered(false);
    } else {
      setQuizFinished(true);
    }
  };

  const handleResetQuiz = () => {
    setQuizIdx(0);
    setSelectedAns(null);
    setQuizIsAnswered(false);
    setCorrectAnswersCount(0);
    setQuizFinished(false);
  };

  // ==================== 2. SITUATION WHEEL STATE ====================
  const [spinning, setSpinning] = useState(false);
  const [wheelResult, setWheelResult] = useState<string | null>(null);
  const [wheelQuestOpen, setWheelQuestOpen] = useState(false);
  const [wheelAns, setWheelAns] = useState<number | null>(null);
  const [wheelIsAnswered, setWheelIsAnswered] = useState(false);

  const wheelSlices = [
    { title: "Bạo lực mạng", icon: "💻", scenario: "Một bạn cùng lớp bị lập page chế giễu ngoại hình.", q: "Em nên làm gì trước tiên?", opts: ["Nhắn tin xúc phạm lại admin page", "Báo cáo trang xấu với GVCN và chụp lại màn hình", "Tham gia bình luận trêu chọc cho vui"], ans: 1, xp: 80 },
    { title: "An toàn giao thông", icon: "🚲", scenario: "Các bạn rủ rủ đi xe đạp điện dàn hàng ngang và bốc đầu.", q: "Ứng xử của em là gì?", opts: ["Từ chối ngay và khuyên ngăn các bạn", "Tham gia đi cùng nhưng đi ở mép đường", "Quay phim để đăng Facebook"], ans: 0, xp: 90 },
    { title: "Bản quyền số", icon: "🎵", scenario: "Em muốn sử dụng một bài hát nổi tiếng để làm video nộp bài tập trường.", q: "Phương án chuẩn mực là?", opts: ["Tải lậu không cần hỏi", "Sử dụng nguồn nhạc miễn phí có giấy phép hoặc xin phép ghi công tác giả", "Ghi bừa tên mình là tác giả bài hát"], ans: 1, xp: 80 },
    { title: "Văn hóa học đường", icon: "🏫", scenario: "Gặp thầy cô giáo bộ môn khác trong nhà xe trường học.", q: "Hành vi đúng đạo đức là?", opts: ["Cúi đầu chào hỏi lịch sự", "Giả vờ cúi xuống xỏ giày không nhìn thấy", "Bỏ chạy thật nhanh"], ans: 0, xp: 60 }
  ];

  const [activeWheelSlice, setActiveWheelSlice] = useState(wheelSlices[0]);

  const spinWheel = () => {
    if (spinning) return;
    setSpinning(true);
    setWheelIsAnswered(false);
    setWheelAns(null);
    setWheelQuestOpen(false);

    // Simulated spinning animation delay
    setTimeout(() => {
      const randomIdx = Math.floor(Math.random() * wheelSlices.length);
      const chosen = wheelSlices[randomIdx];
      setActiveWheelSlice(chosen);
      setWheelResult(chosen.title);
      setSpinning(false);
      setWheelQuestOpen(true);
    }, 1200);
  };

  const handleSelectWheelAns = (optIdx: number) => {
    if (wheelIsAnswered) return;
    setWheelAns(optIdx);
    setWheelIsAnswered(true);

    if (optIdx === activeWheelSlice.ans) {
      onAwardXp(activeWheelSlice.xp);
      showToast(`Chính xác! Bạn được cộng +${activeWheelSlice.xp} XP đạo đức mạng!`, "success");
    } else {
      showToast("Lựa chọn chưa tối ưu, hãy thử lại nhé!", "error");
    }
  };

  // ==================== 3. VIRTUAL MOCK COURT STATE ====================
  const [courtStep, setCourtStep] = useState<"intro" | "testimonies" | "verdict" | "result">("intro");
  const [courtSelection, setCourtSelection] = useState<number | null>(null);

  const courtCase = {
    title: "Vụ án: Đe dọa tống tiền và phát tán bí mật đời tư qua mạng xã hội",
    indictment: "Bị cáo Hoàng V. (15 tuổi, lớp 9) phát hiện bạn học ngồi cùng bàn có nhật ký điện tử chứa nhiều tâm sự nhạy cảm. V. đã hack mật khẩu, sao chép dữ liệu và đe dọa yêu cầu nạn nhân phải nộp 2 triệu đồng tiền tiêu vặt, nếu không sẽ phát tán toàn bộ bí mật lên fanpage trường.",
    testimonies: [
      { role: "Công tố viên (Viện Kiểm sát)", speech: "Hành vi của bị cáo V. đã cấu thành tội cưỡng đoạt tài sản và xâm phạm nghiêm trọng bí mật đời tư theo Luật Trẻ em và Bộ luật Hình sự. Tuy nhiên, do bị cáo là người chưa thành niên, cần áp dụng các hình phạt giáo dục và cải tạo tích cực." },
      { role: "Luật sư biện hộ", speech: "Bị cáo V. nhất thời nông nổi, chưa hiểu hết hậu quả pháp lý nghiêm trọng của Luật An ninh mạng. Gia đình bị cáo đã bồi thường danh dự, bị cáo tỏ rõ sự ăn năn hối cải và có học lực tốt tại trường Lê Hồng Phong." }
    ],
    choices: [
      { text: "Áp dụng biện pháp giáo dục tại xã phường, phạt cải tạo không giam giữ, cấm sử dụng mạng xã hội độc hại và bắt buộc tham gia lớp học rèn kỹ năng sống.", feedback: "Bản án vô cùng nhân văn và mang tính giáo dục sâu sắc! Phù hợp hoàn toàn với tinh thần Luật Trẻ em và Bộ luật Hình sự dành cho người dưới 16 tuổi.", score: 100 },
      { text: "Bỏ qua hoàn toàn vụ án vì bị cáo còn quá nhỏ, chỉ bắt viết bản tự kiểm điểm cam kết hứa không làm lại.", feedback: "Quá lỏng lẻo! Việc không có hình phạt răn đe có thể khiến bị cáo và học sinh khác coi thường pháp luật và quyền riêng tư mạng.", score: -50 },
      { text: "Đuổi học vĩnh viễn bị cáo, gửi thẳng vào trại giam hình sự 5 năm.", feedback: "Quá nặng nề! Người chưa thành niên (dưới 16 tuổi) cần ưu tiên các biện pháp giáo dục, hòa nhập cộng đồng thay vì cách ly giam giữ nếu tính chất không đặc biệt nghiêm trọng.", score: -40 }
    ]
  };

  const handleCourtVerdict = (choiceIdx: number) => {
    setCourtSelection(choiceIdx);
    setCourtStep("result");
    const choice = courtCase.choices[choiceIdx];
    if (choice.score > 0) {
      onAwardXp(120);
      showToast("Bạn đã tuyên một bản án xuất sắc! Thưởng +120 XP rèn luyện.", "success");
    } else {
      showToast("Phán quyết chưa công bằng, hãy đọc phân tích pháp lý để rút kinh nghiệm.", "error");
    }
  };

  // ==================== 4. LAW MATCHER STATE ====================
  const [matchSelectedLeft, setMatchSelectedLeft] = useState<string | null>(null);
  const [matchSelectedRight, setMatchSelectedRight] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]); // holds matched pairs e.g. "L1-R1"

  const matchLeft = [
    { id: "L1", text: "Xúc phạm nhân phẩm bạn học trên group Zalo" },
    { id: "L2", text: "Bỏ học đi làm công nhân khi mới 13 tuổi" },
    { id: "L3", text: "Tự ý xem tin nhắn Messenger của người khác" },
    { id: "L4", text: "Đi xe gắn máy phân khối lớn đi học" }
  ];

  const matchRight = [
    { id: "R1", text: "Vi phạm Luật An ninh mạng & Luật Trẻ em", matchesWith: "L1" },
    { id: "R2", text: "Vi phạm Luật Giáo dục & Độ tuổi lao động", matchesWith: "L2" },
    { id: "R3", text: "Xâm hại quyền bảo mật thông tin cá nhân", matchesWith: "L3" },
    { id: "R4", text: "Vi phạm Luật Giao thông đường bộ", matchesWith: "L4" }
  ];

  const handleMatchClickLeft = (id: string) => {
    if (matchedIds.some(m => m.startsWith(id))) return;
    setMatchSelectedLeft(id === matchSelectedLeft ? null : id);
  };

  const handleMatchClickRight = (id: string, matchTargetId: string) => {
    if (matchedIds.some(m => m.endsWith(id))) return;
    if (!matchSelectedLeft) {
      showToast("Vui lòng chọn một tình huống ở cột bên trái trước!", "error");
      return;
    }

    if (matchSelectedLeft === matchTargetId) {
      // Correct Match!
      const newPair = `${matchSelectedLeft}-${id}`;
      const newMatched = [...matchedIds, newPair];
      setMatchedIds(newMatched);
      setMatchSelectedLeft(null);
      showToast("Tuyệt vời! Kết nối chính xác.", "success");

      if (newMatched.length === matchLeft.length) {
        onAwardXp(150);
        showToast("Xuất sắc! Bạn đã vượt qua thử thách Ghép luật thực tế, thưởng +150 XP!", "success");
      }
    } else {
      showToast("Kết nối sai luật rồi, hãy tư duy lại nhé!", "error");
      setMatchSelectedLeft(null);
    }
  };

  const resetLawMatcher = () => {
    setMatchedIds([]);
    setMatchSelectedLeft(null);
    setMatchSelectedRight(null);
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation for Mini-games */}
      <div className="bg-slate-950/60 p-1.5 rounded-2xl flex flex-wrap gap-1.5 border border-slate-800">
        <button
          onClick={() => setActiveSubGame("quiz")}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeSubGame === "quiz" ? "bg-purple-600 text-white shadow-lg" : "text-slate-400 hover:text-slate-100"
          }`}
        >
          🔔 Rung chuông vàng
        </button>
        <button
          onClick={() => setActiveSubGame("wheel")}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeSubGame === "wheel" ? "bg-pink-600 text-white shadow-lg" : "text-slate-400 hover:text-slate-100"
          }`}
        >
          🎡 Vòng quay tình huống
        </button>
        <button
          onClick={() => {
            setActiveSubGame("court");
            setCourtStep("intro");
            setCourtSelection(null);
          }}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeSubGame === "court" ? "bg-emerald-600 text-white shadow-lg" : "text-slate-400 hover:text-slate-100"
          }`}
        >
          ⚖️ Phiên tòa giả định LHP
        </button>
        <button
          onClick={() => {
            setActiveSubGame("match")
            resetLawMatcher();
          }}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeSubGame === "match" ? "bg-cyan-600 text-white shadow-lg" : "text-slate-400 hover:text-slate-100"
          }`}
        >
          🧩 Ghép luật thực tế
        </button>
      </div>

      {/* ==================== GAME 1: RUNG CHUÔNG VÀNG ==================== */}
      {activeSubGame === "quiz" && (
        <div className="bg-slate-900/40 backdrop-blur-xl rounded-3xl p-6 border border-slate-800 shadow-2xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <span className="bg-amber-500/20 text-amber-400 p-2 rounded-xl">
                <Bell className="w-4 h-4 animate-bounce" />
              </span>
              <div>
                <span className="font-extrabold text-sm text-slate-100 block">Đấu trường Rung chuông vàng</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Trả lời đúng toàn bộ câu hỏi để vinh danh bảng vàng</span>
              </div>
            </div>
            {!quizFinished && (
              <span className="text-xs font-black text-cyan-400 bg-cyan-950/40 px-3 py-1.5 rounded-xl border border-cyan-500/20">
                Câu {quizIdx + 1}/{quizzes.length}
              </span>
            )}
          </div>

          {!quizFinished ? (
            <div className="space-y-4">
              {/* Question */}
              <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800 shadow-inner">
                <p className="font-bold text-slate-100 text-xs sm:text-sm leading-relaxed">
                  {currentQuiz.question}
                </p>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {currentQuiz.options.map((opt, index) => {
                  let optionClass = "p-4 border text-slate-300 text-xs text-left font-semibold rounded-2xl transition-all ";
                  if (quizIsAnswered) {
                    if (index === currentQuiz.answer) {
                      // Correct option
                      optionClass += "bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-lg shadow-emerald-500/10";
                    } else if (index === selectedAns) {
                      // Selected wrong option
                      optionClass += "bg-rose-500/20 border-rose-500 text-rose-300 shadow-lg shadow-rose-500/10";
                    } else {
                      optionClass += "bg-slate-950/30 border-slate-900 opacity-40";
                    }
                  } else {
                    optionClass += "bg-slate-950/60 border-slate-800 hover:border-purple-500/80 hover:bg-slate-950 transition-colors";
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleSelectAnswer(index)}
                      disabled={quizIsAnswered}
                      className={optionClass}
                    >
                      <div className="flex gap-2">
                        <span className="font-bold text-purple-400">{String.fromCharCode(65 + index)}.</span>
                        <span className="leading-relaxed">{opt}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Navigation */}
              {quizIsAnswered && (
                <div className="flex justify-between items-center bg-slate-950/50 p-4 rounded-2xl border border-slate-800/60">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-purple-400" />
                    <span>
                      {selectedAns === currentQuiz.answer
                        ? "Xuất sắc! Lời giải chính xác."
                        : `Chưa đúng! Đáp án đúng là ${String.fromCharCode(65 + currentQuiz.answer)}.`}
                    </span>
                  </div>
                  <button
                    onClick={handleNextQuiz}
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-black px-5 py-2.5 rounded-xl text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    {quizIdx === quizzes.length - 1 ? "HOÀN THÀNH" : "CÂU TIẾP THEO"}{" "}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Result Panel */
            <div className="text-center py-8 space-y-5">
              <div className="inline-flex p-5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 animate-bounce">
                <Award className="w-12 h-12" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-black text-white">CHÚC MỪNG EM ĐÃ HOÀN THÀNH ĐẤU TRƯỜNG</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Em đã xuất sắc vượt qua các câu hỏi đạo đức & pháp luật khó của trường THCS Lê Hồng Phong!
                </p>
                <div className="text-xl font-extrabold text-cyan-400 mt-2">
                  Kết quả: {correctAnswersCount} / {quizzes.length} Câu đúng
                </div>
              </div>

              {correctAnswersCount === quizzes.length && (
                <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 p-4 rounded-2xl max-w-sm mx-auto text-xs text-amber-300 font-bold flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  Đã mở khóa thành tích: "Nhà thông thái luật pháp" (+Huy chương vàng)
                </div>
              )}

              <button
                onClick={handleResetQuiz}
                className="bg-slate-800 hover:bg-slate-700 text-slate-100 font-extrabold text-xs px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2 mx-auto cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" /> CHƠI LẠI VÒNG QUIZ
              </button>
            </div>
          )}
        </div>
      )}

      {/* ==================== GAME 2: VÒNG QUAY TÌNH HUỐNG ==================== */}
      {activeSubGame === "wheel" && (
        <div className="bg-slate-900/40 backdrop-blur-xl rounded-3xl p-6 border border-slate-800 shadow-2xl space-y-6">
          <div className="text-center space-y-1">
            <h3 className="font-extrabold text-sm text-slate-200">VÒNG QUAY TÌNH HUỐNG THỰC TẾ</h3>
            <p className="text-xs text-slate-400">Hãy nhấn quay để thử thách khả năng xử lý tình huống bất kỳ</p>
          </div>

          <div className="flex flex-col md:flex-row justify-center items-center gap-8 py-4">
            {/* SVG Wheel Spinner */}
            <div className="relative w-48 h-48 flex items-center justify-center">
              {/* Spinning Arrow Indicator */}
              <div className="absolute top-0 z-10 text-cyan-400 text-lg animate-bounce">▼</div>
              <div
                className={`w-full h-full rounded-full border-4 border-slate-700 relative overflow-hidden flex items-center justify-center transition-transform ${
                  spinning ? "animate-spin" : ""
                }`}
                style={{ animationDuration: "1s" }}
              >
                {/* Visual wheel center */}
                <div className="absolute w-8 h-8 rounded-full bg-slate-900 border-2 border-slate-600 z-10 flex items-center justify-center text-xs">
                  🎯
                </div>
                {/* 4 Colored Slices (SVG styled) */}
                <svg viewBox="0 0 100 100" className="w-full h-full transform rotate-45">
                  <path d="M50 50 L100 50 A50 50 0 0 1 50 100 Z" fill="#4f46e5" fillOpacity="0.4" />
                  <path d="M50 50 L50 100 A50 50 0 0 1 0 50 Z" fill="#ec4899" fillOpacity="0.4" />
                  <path d="M50 50 L0 50 A50 50 0 0 1 50 0 Z" fill="#10b981" fillOpacity="0.4" />
                  <path d="M50 50 L50 0 A50 50 0 0 1 100 50 Z" fill="#f59e0b" fillOpacity="0.4" />
                </svg>
              </div>
            </div>

            {/* Actions Panel */}
            <div className="space-y-4 max-w-sm flex-1">
              <button
                onClick={spinWheel}
                disabled={spinning}
                className="w-full bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white font-black text-sm py-3 rounded-2xl transition-all shadow-lg shadow-purple-900/40 flex items-center justify-center gap-2"
              >
                <Shuffle className={`w-5 h-5 ${spinning ? "animate-spin" : ""}`} />
                {spinning ? "ĐANG QUAY VÒNG..." : "QUAY NGAY BÂY GIỜ"}
              </button>

              {wheelQuestOpen && (
                <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-3 animate-fade-in text-xs">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="font-extrabold text-cyan-400">Tình huống: {activeWheelSlice.title}</span>
                    <span className="text-[10px] text-amber-400 font-bold">+{activeWheelSlice.xp} XP</span>
                  </div>
                  <p className="text-slate-300 font-medium leading-relaxed italic">
                    "{activeWheelSlice.scenario}"
                  </p>
                  <div className="space-y-2 pt-1.5">
                    <p className="font-bold text-white">{activeWheelSlice.q}</p>
                    {activeWheelSlice.opts.map((opt, index) => {
                      let optClass = "w-full p-2.5 border text-left text-xs rounded-xl font-medium transition-all ";
                      if (wheelIsAnswered) {
                        if (index === activeWheelSlice.ans) {
                          optClass += "bg-emerald-500/10 border-emerald-500 text-emerald-300";
                        } else if (index === wheelAns) {
                          optClass += "bg-rose-500/10 border-rose-500 text-rose-300";
                        } else {
                          optClass += "bg-slate-900 border-slate-950 opacity-45";
                        }
                      } else {
                        optClass += "bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300";
                      }
                      return (
                        <button
                          key={index}
                          onClick={() => handleSelectWheelAns(index)}
                          disabled={wheelIsAnswered}
                          className={optClass}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================== GAME 3: PHIÊN TÒA GIẢ ĐỊNH LHP ==================== */}
      {activeSubGame === "court" && (
        <div className="bg-slate-900/40 backdrop-blur-xl rounded-3xl p-6 border border-slate-800 shadow-2xl space-y-5">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-2">
              <Scale className="w-5 h-5 text-emerald-400" /> Phiên Tòa Giả Định THCS Lê Hồng Phong
            </h3>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-500/30">
              Vai trò: Thẩm Phán Học Sinh
            </span>
          </div>

          {courtStep === "intro" && (
            <div className="space-y-4">
              <div className="space-y-1 bg-slate-950/60 p-5 rounded-2xl border border-slate-800 text-xs">
                <span className="bg-amber-500/20 text-amber-400 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                  Cáo Trạng Giả Định
                </span>
                <h4 className="font-bold text-white mt-2 text-sm">{courtCase.title}</h4>
                <p className="text-slate-300 leading-relaxed mt-2.5">{courtCase.indictment}</p>
              </div>
              <button
                onClick={() => setCourtStep("testimonies")}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5"
              >
                NGHE CÁC BÊN BIỆN HỘ & ĐỐI CHẤT <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {courtStep === "testimonies" && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courtCase.testimonies.map((test, index) => (
                  <div key={index} className="bg-slate-950/40 p-4 rounded-2xl border border-slate-800 space-y-2">
                    <span className="text-[10px] font-black text-cyan-400 block">{test.role}</span>
                    <p className="text-slate-300 leading-relaxed italic">"{test.speech}"</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setCourtStep("verdict")}
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-black py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5"
              >
                TIẾN HÀNH TUYÊN ÁN PHÁN QUYẾT <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {courtStep === "verdict" && (
            <div className="space-y-4 text-xs">
              <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-800">
                <p className="font-bold text-slate-200">Em hãy cân nhắc phán quyết tối ưu và mang tính giáo dục thiết thực nhất:</p>
              </div>
              <div className="space-y-3">
                {courtCase.choices.map((choice, index) => (
                  <button
                    key={index}
                    onClick={() => handleCourtVerdict(index)}
                    className="w-full p-4 bg-slate-950/80 border border-slate-800 hover:border-emerald-500/60 rounded-2xl text-left text-xs text-slate-300 font-semibold transition-all hover:bg-slate-950 leading-relaxed"
                  >
                    Phán quyết {index + 1}: {choice.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {courtStep === "result" && courtSelection !== null && (
            <div className="space-y-4 text-xs">
              <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800 space-y-3">
                <span className="text-[9px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded font-black uppercase tracking-wider">
                  Phân tích pháp lý từ Viện Đạo Đức LHP
                </span>
                <p className="text-slate-300 leading-relaxed font-semibold">
                  "{courtCase.choices[courtSelection].feedback}"
                </p>
                <div className="text-sm font-black text-emerald-400 mt-2">
                  Phán quyết được xếp hạng: {courtCase.choices[courtSelection].score > 0 ? "ƯU VIỆT VÀ NHÂN VĂN (+120 XP)" : "CHƯA TỐI ƯU"}
                </div>
              </div>
              <button
                onClick={() => setCourtStep("intro")}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-2.5 rounded-xl transition-all"
              >
                QUAY LẠI PHIÊN TÒA ĐẦU TIÊN
              </button>
            </div>
          )}
        </div>
      )}

      {/* ==================== GAME 4: GHÉP LUẬT THỰC TẾ ==================== */}
      {activeSubGame === "match" && (
        <div className="bg-slate-900/40 backdrop-blur-xl rounded-3xl p-6 border border-slate-800 shadow-2xl space-y-5">
          <div className="text-center space-y-1">
            <h3 className="font-extrabold text-sm text-slate-200">TRÒ CHƠI: GHÉP LUẬT THỰC TẾ</h3>
            <p className="text-xs text-slate-400">Chọn một ô tình huống ở cột TRÁI và nhấn ô điều luật phù hợp ở cột PHẢI</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Left Column (Scenarios) */}
            <div className="space-y-3 text-xs">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block border-b border-slate-800 pb-1.5">Tình huống thực tế</span>
              {matchLeft.map((left) => {
                const isMatched = matchedIds.some(m => m.startsWith(left.id));
                const isSelected = matchSelectedLeft === left.id;
                
                let cardClass = "w-full p-4 border text-left rounded-2xl font-bold transition-all ";
                if (isMatched) {
                  cardClass += "bg-emerald-500/10 border-emerald-500/50 text-emerald-400 cursor-not-allowed";
                } else if (isSelected) {
                  cardClass += "bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/10";
                } else {
                  cardClass += "bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700";
                }

                return (
                  <button
                    key={left.id}
                    onClick={() => handleMatchClickLeft(left.id)}
                    disabled={isMatched}
                    className={cardClass}
                  >
                    <div className="flex items-center gap-2">
                      {isMatched && <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                      <span className="leading-relaxed">{left.text}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Column (Regulations) */}
            <div className="space-y-3 text-xs">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block border-b border-slate-800 pb-1.5">Bộ luật tương ứng</span>
              {matchRight.map((right) => {
                const isMatched = matchedIds.some(m => m.endsWith(right.id));
                
                let cardClass = "w-full p-4 border text-left rounded-2xl font-bold transition-all ";
                if (isMatched) {
                  cardClass += "bg-emerald-500/10 border-emerald-500/50 text-emerald-400 cursor-not-allowed";
                } else {
                  cardClass += "bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700";
                }

                return (
                  <button
                    key={right.id}
                    onClick={() => handleMatchClickRight(right.id, right.matchesWith)}
                    disabled={isMatched}
                    className={cardClass}
                  >
                    <div className="flex items-center gap-2">
                      {isMatched && <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                      <span className="leading-relaxed">{right.text}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-between items-center bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-xs">
            <span className="font-semibold text-slate-400">
              Đã ghép đúng: {matchedIds.length} / {matchLeft.length} Cặp
            </span>
            <button
              onClick={resetLawMatcher}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> LÀM MỚI GAME
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
