import React, { useState } from "react";
import { Scenario, StudentProfile } from "../types";
import { Milestone, FolderOpen, AlertCircle, RefreshCw, CheckCircle2, ChevronRight, GraduationCap } from "lucide-react";

interface ScenariosSimulatorProps {
  scenarios: Scenario[];
  profile: StudentProfile;
  onAwardXp: (xp: number) => void;
  showToast: (message: string, type: "success" | "error") => void;
}

export const ScenariosSimulator: React.FC<ScenariosSimulatorProps> = ({
  scenarios,
  profile,
  onAwardXp,
  showToast
}) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedChoiceIdx, setSelectedChoiceIdx] = useState<number | null>(null);
  const [simAnswered, setSimAnswered] = useState(false);
  const [accumulatedScore, setAccumulatedScore] = useState(0);

  const activeScenario = scenarios.find((s) => s.id === selectedScenarioId) || null;
  const currentQuestion = activeScenario?.questions[currentStep] || null;

  const handleStartSim = (id: string) => {
    setSelectedScenarioId(id);
    setCurrentStep(0);
    setSelectedChoiceIdx(null);
    setSimAnswered(false);
    setAccumulatedScore(0);
  };

  const handleChoiceSelect = (choiceIdx: number) => {
    if (simAnswered || !currentQuestion) return;
    setSelectedChoiceIdx(choiceIdx);
    setSimAnswered(true);

    const choice = currentQuestion.choices[choiceIdx];
    setAccumulatedScore((prev) => prev + choice.xpChange);

    if (choice.isBest) {
      onAwardXp(choice.xpChange);
      showToast(`Xuất sắc! Lựa chọn chính xác, nhận +${choice.xpChange} XP đạo đức!`, "success");
    } else {
      if (choice.xpChange > 0) {
        onAwardXp(choice.xpChange);
        showToast(`Ghi nhận rèn luyện, cộng +${choice.xpChange} XP.`, "success");
      } else {
        showToast("Lựa chọn chưa tối ưu, hãy đọc kỹ lời giải thích màu đỏ phía dưới.", "error");
      }
    }
  };

  const handleNextStep = () => {
    if (!activeScenario) return;
    if (currentStep < activeScenario.questions.length - 1) {
      setCurrentStep((prev) => prev + 1);
      setSelectedChoiceIdx(null);
      setSimAnswered(false);
    } else {
      // Finished simulation!
      showToast(`Chúc mừng em đã hoàn thành tốt kịch bản: "${activeScenario.title}"!`, "success");
      setSelectedScenarioId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Introduction Banner */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-5 backdrop-blur-md">
        <h2 className="text-xl font-bold text-blue-300 flex items-center gap-2">
          <FolderOpen className="w-6 h-6 text-blue-400" /> Kho Tình Huống Mô Phỏng Đạo Đức & Pháp Lý
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Dưới đây là các kịch bản thực tế thường gặp trong đời sống học sinh và môi trường mạng. Hãy đóng vai và chọn các phương án xử lý thông minh để tích luỹ điểm rèn luyện!
        </p>
      </div>

      {!activeScenario ? (
        /* 1. SCENARIO CATALOGUE LIST */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scenarios.map((sc) => {
            const isCompleted = profile.completedQuests.includes(sc.id);

            return (
              <div
                key={sc.id}
                className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-5 rounded-3xl space-y-4 hover:border-blue-500/50 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span
                      className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase border ${
                        sc.severity === "Cực kỳ nguy hiểm"
                          ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                          : sc.severity === "Nghiêm trọng"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          : "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                      }`}
                    >
                      Mức độ: {sc.severity}
                    </span>
                    <span className="text-slate-400 font-mono">{sc.ageGroup}</span>
                  </div>
                  <h3 className="font-extrabold text-slate-200 text-sm leading-snug">{sc.title}</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-3">
                    {sc.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-blue-300 font-bold flex items-center gap-1">
                    <Milestone className="w-3.5 h-3.5" /> {sc.category}
                  </span>
                  <button
                    onClick={() => handleStartSim(sc.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-black px-4 py-2 rounded-xl transition-all shadow-md shadow-blue-950 flex items-center gap-1 cursor-pointer"
                  >
                    BẮT ĐẦU MÔ PHỎNG <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* 2. ACTIVE STORY SIMULATION */
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 space-y-5 shadow-2xl">
          <div className="flex justify-between items-start border-b border-slate-800 pb-3 flex-wrap gap-2 text-xs">
            <div>
              <span className="text-blue-400 font-black tracking-wider uppercase text-[10px]">
                Đóng vai giải quyết kịch bản học đường
              </span>
              <h3 className="text-base font-black text-white mt-1">{activeScenario.title}</h3>
            </div>
            <button
              onClick={() => setSelectedScenarioId(null)}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-bold cursor-pointer"
            >
              THOÁT MÔ PHỎNG
            </button>
          </div>

          {/* Story setting display */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-850/80 text-xs text-slate-300 leading-relaxed italic relative">
            <span className="absolute -top-2.5 left-4 bg-slate-900 border border-slate-800 text-slate-500 font-bold px-2 py-0.5 rounded text-[9px] uppercase">
              Bối cảnh vụ việc
            </span>
            <p className="pt-1">{activeScenario.description}</p>
          </div>

          {currentQuestion && (
            <div className="space-y-4 text-xs">
              {/* Question text */}
              <div className="bg-blue-950/20 border border-blue-500/20 p-4 rounded-2xl flex gap-3">
                <GraduationCap className="w-6 h-6 text-blue-400 flex-shrink-0 animate-bounce-subtle" />
                <div className="space-y-1">
                  <p className="font-extrabold text-blue-300 uppercase text-[9px] tracking-wider">Hành động của bạn</p>
                  <p className="font-bold text-slate-100 leading-relaxed sm:text-sm">
                    {currentQuestion.questionText}
                  </p>
                </div>
              </div>

              {/* Multiple Choice Options */}
              <div className="space-y-2.5">
                {currentQuestion.choices.map((choice, index) => {
                  let choiceClass = "w-full p-4 border text-left rounded-2xl font-semibold transition-all leading-relaxed flex gap-3 items-center ";
                  if (simAnswered) {
                    if (choice.isBest) {
                      choiceClass += "bg-emerald-500/10 border-emerald-500 text-emerald-300";
                    } else if (index === selectedChoiceIdx) {
                      choiceClass += "bg-rose-500/10 border-rose-500 text-rose-300";
                    } else {
                      choiceClass += "bg-slate-950/30 border-slate-950 opacity-45";
                    }
                  } else {
                    choiceClass += "bg-slate-950/60 border-slate-800 text-slate-300 hover:border-blue-500/50 hover:bg-slate-950";
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleChoiceSelect(index)}
                      disabled={simAnswered}
                      className={choiceClass}
                    >
                      <span className="w-5 h-5 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-[10px] text-blue-400 flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="flex-1 text-[11px] sm:text-xs">{choice.text}</span>
                    </button>
                  );
                })}
              </div>

              {/* Feedback and Continue button */}
              {simAnswered && selectedChoiceIdx !== null && (
                <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex gap-2 text-xs">
                    <AlertCircle className={`w-5 h-5 flex-shrink-0 ${currentQuestion.choices[selectedChoiceIdx].isBest ? "text-emerald-400" : "text-rose-400"}`} />
                    <div className="space-y-1">
                      <p className="font-black text-slate-200">
                        {currentQuestion.choices[selectedChoiceIdx].isBest ? "Phân tích chuẩn đạo đức:" : "Giải nghĩa rủi ro:"}
                      </p>
                      <p className="text-slate-400 leading-relaxed font-semibold">
                        {currentQuestion.choices[selectedChoiceIdx].feedback}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center border-t border-slate-800/80 pt-3">
                    <span className="font-mono text-[10px] text-slate-500">
                      Điểm rèn luyện điều chỉnh: <span className="font-bold text-emerald-400">+{currentQuestion.choices[selectedChoiceIdx].xpChange} XP</span>
                    </span>
                    <button
                      onClick={handleNextStep}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-black px-4 py-2 rounded-xl text-xs shadow-md cursor-pointer flex items-center gap-1"
                    >
                      TIẾP TỤC HÀNH TRÌNH <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
