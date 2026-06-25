import { useState, useEffect, useRef } from "react";
import { Role, StudentProfile, GoodDeed, Quest, Club, ClubMessage, QuizQuestion } from "./types";
import { Header } from "./components/Header";
import { LoginScreen } from "./components/LoginScreen";
import { supabase } from "./supabaseClient";
import { MoralTree } from "./components/MoralTree";
import { QuizArena } from "./components/QuizArena";
import { ClubsForum } from "./components/ClubsForum";
import { ScenariosSimulator } from "./components/ScenariosSimulator";
import { LearningLibrary } from "./components/LearningLibrary";
import { AdminPanel } from "./components/AdminPanel";
import { TeacherParentPortals } from "./components/TeacherParentPortals";

// Import initial dataset constants
import {
  initialBadges,
  initialClubs,
  initialGoodDeeds,
  initialQuests,
  initialQuizzes,
  initialScenarios
} from "./data";

// Import lucide icons
import {
  Home,
  Gamepad2,
  UsersRound,
  FolderGit2,
  Library,
  SwatchBook,
  Milestone,
  Trophy,
  Bot,
  NotebookTabs,
  Baby,
  ShieldCheck,
  Award,
  Sparkles,
  Heart,
  Send,
  X,
  Plus,
  Trash,
  CheckCircle,
  AlertCircle
} from "lucide-react";

export default function App() {
  // ==================== STATE MANAGEMENT ====================
  // Toast notifications state
  const [toasts, setToasts] = useState<{ id: string; message: string; type: "success" | "error" }[]>([]);

  // Function to show toast
  const showToast = (message: string, type: "success" | "error" = "success") => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  // Authentication states
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);

  const [studentProfileId, setStudentProfileId] = useState<string>(() => {
    return localStorage.getItem("lhp_student_profile_id") || "default_student";
  });

  const handleLoginSuccess = (session: {
    name: string;
    role: Role;
    className?: string;
    profile?: StudentProfile;
  }) => {
    setIsLoggedIn(true);
    localStorage.setItem("lhp_logged_in", "true");
    
    const user = { name: session.name, role: session.role, className: session.className };
    localStorage.setItem("lhp_logged_user", JSON.stringify(user));

    setCurrentRole(session.role);
    localStorage.setItem("lhp_current_role", session.role);

    if (session.role === Role.HOC_SINH) {
      let pid = "default_student";
      if (session.profile) {
        if (session.name !== "Trần Minh Anh" || session.className !== "7A5") {
          pid = `student_${session.name.toLowerCase().replace(/\s+/g, '_')}_${session.className?.toLowerCase()}`;
        }
        setProfile(session.profile);
        localStorage.setItem("lhp_student_profile", JSON.stringify(session.profile));
      }
      setStudentProfileId(pid);
      localStorage.setItem("lhp_student_profile_id", pid);
      setActiveModule(1); // default student home
    } else if (session.role === Role.GIAO_VIEN) {
      setActiveModule(10);
    } else if (session.role === Role.PHU_HUYNH) {
      setActiveModule(11);
    } else if (session.role === Role.ADMIN) {
      setActiveModule(12);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("lhp_logged_in");
    localStorage.removeItem("lhp_logged_user");
    localStorage.removeItem("lhp_current_role");
    localStorage.removeItem("lhp_student_profile_id");
    localStorage.removeItem("lhp_student_profile");
    setStudentProfileId("default_student");
    setProfile({
      name: "Trần Minh Anh",
      className: "7A5",
      xp: 2350,
      level: 12,
      completedQuests: ["q_daily_1"],
      joinedClubs: ["CLB Đại sứ xanh học đường"],
      unlockedBadges: ["b1", "b2"],
      goodDeedsCount: 15
    });
    showToast("Đã đăng xuất khỏi hệ thống.", "success");
  };

  // Active role and view state
  const [currentRole, setCurrentRole] = useState<Role>(() => {
    const saved = localStorage.getItem("lhp_current_role");
    return (saved as Role) || Role.HOC_SINH;
  });

  const [activeModule, setActiveModule] = useState<number>(() => {
    const saved = localStorage.getItem("lhp_active_module");
    return saved ? Number(saved) : 1;
  });

  // Student Profile state
  const [profile, setProfile] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem("lhp_student_profile");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      name: "Trần Minh Anh",
      className: "7A5",
      xp: 2350,
      level: 12,
      completedQuests: ["q_daily_1"],
      joinedClubs: ["CLB Đại sứ xanh học đường"],
      unlockedBadges: ["b1", "b2"],
      goodDeedsCount: 15
    };
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editClass, setEditClass] = useState(profile.className);

  const handleSaveProfile = () => {
    if (!editName.trim()) {
      showToast("Vui lòng nhập tên hợp lệ!", "error");
      return;
    }
    const updatedProfile = {
      ...profile,
      name: editName.trim(),
      className: editClass.trim() || "Tự do"
    };
    setProfile(updatedProfile);
    localStorage.setItem("lhp_student_profile", JSON.stringify(updatedProfile));
    
    let pid = "default_student";
    if (updatedProfile.name !== "Trần Minh Anh" || updatedProfile.className !== "7A5") {
      pid = `student_${updatedProfile.name.toLowerCase().replace(/\s+/g, '_')}_${updatedProfile.className.toLowerCase()}`;
    }
    setStudentProfileId(pid);
    localStorage.setItem("lhp_student_profile_id", pid);

    setIsEditingProfile(false);
    showToast("Đã cập nhật danh tính tham gia!", "success");
    addSystemLog(`Học sinh cập nhật danh tính thành: ${updatedProfile.name} - Lớp ${updatedProfile.className}`);
  };

  // Database lists with LocalStorage persistence
  const [goodDeeds, setGoodDeeds] = useState<GoodDeed[]>(() => {
    const saved = localStorage.getItem("lhp_good_deeds");
    return saved ? JSON.parse(saved) : initialGoodDeeds;
  });

  const [quests, setQuests] = useState<Quest[]>(() => {
    const saved = localStorage.getItem("lhp_quests");
    return saved ? JSON.parse(saved) : initialQuests;
  });

  const [quizzes, setQuizzes] = useState<QuizQuestion[]>(() => {
    const saved = localStorage.getItem("lhp_quizzes");
    return saved ? JSON.parse(saved) : initialQuizzes;
  });

  const [clubs, setClubs] = useState<Club[]>(() => {
    const saved = localStorage.getItem("lhp_clubs");
    return saved ? JSON.parse(saved) : initialClubs;
  });

  const [clubMessages, setClubMessages] = useState<ClubMessage[]>(() => {
    const saved = localStorage.getItem("lhp_club_messages");
    if (saved) return JSON.parse(saved);
    
    // Default messages
    return [
      {
        id: "m1",
        clubName: "CLB Đại sứ xanh học đường",
        sender: "Cô Phương Thảo",
        role: "Giáo viên",
        content: "Chào mừng các đại sứ xanh lớp 7A5! Tuần này chúng mình phấn đấu thu gom đủ 20kg giấy vụn nhé!",
        timestamp: "2026-06-24 10:15"
      },
      {
        id: "m2",
        clubName: "CLB Đại sứ xanh học đường",
        sender: "Hoàng Kiên",
        role: "Lớp 9B2",
        content: "Em đã tập hợp được 3kg báo cũ rồi ạ. Chiều nay em nộp ở kho Đoàn Đội nhé cô.",
        timestamp: "2026-06-24 11:20"
      }
    ];
  });

  // Parent encouragement messages
  const [encouragements, setEncouragements] = useState<{ text: string; sender: string; claimed: boolean }[]>(() => {
    const saved = localStorage.getItem("lhp_encouragements");
    return saved ? JSON.parse(saved) : [
      { text: "Bố mẹ luôn tự hào về con yêu. Hãy rèn luyện kỹ năng thật chăm ngoan nhé!", sender: "Phụ huynh", claimed: false }
    ];
  });

  // Admin lock log state
  const [adminLoggedIn, setAdminLoggedIn] = useState(() => {
    return localStorage.getItem("lhp_admin_logged") === "true";
  });

  // Interactive watering tree tracking
  const [lastWatered, setLastWatered] = useState<string | null>(() => {
    return localStorage.getItem("lhp_last_watered");
  });

  // System actions console logs for Admin audit screen
  const [systemLogs, setSystemLogs] = useState<string[]>([]);

  // ==================== AUTO-SYNCHRONIZATION & STORAGE ====================
  const [supabaseActive, setSupabaseActive] = useState(false);

  // Initialize and load from Supabase if active
  useEffect(() => {
    async function loadSupabaseData() {
      try {
        console.log("Initializing Supabase connection...");
        
        // 1. Sync student profile
        const currentStudentId = localStorage.getItem("lhp_student_profile_id") || "default_student";
        const { data: profileData, error: profileErr } = await supabase
          .from("student_profiles")
          .select("*")
          .eq("id", currentStudentId)
          .maybeSingle();

        if (profileErr) {
          console.warn("Supabase profile error (might not have run schema.sql yet):", profileErr.message);
        } else if (profileData) {
          console.log("Supabase connected! Syncing profile:", profileData);
          setSupabaseActive(true);
          setProfile({
            name: profileData.name,
            className: profileData.className,
            xp: profileData.xp,
            level: profileData.level,
            completedQuests: Array.isArray(profileData.completedQuests) 
              ? profileData.completedQuests 
              : JSON.parse(profileData.completedQuests as string || "[]"),
            joinedClubs: Array.isArray(profileData.joinedClubs) 
              ? profileData.joinedClubs 
              : JSON.parse(profileData.joinedClubs as string || "[]"),
            unlockedBadges: Array.isArray(profileData.unlockedBadges) 
              ? profileData.unlockedBadges 
              : JSON.parse(profileData.unlockedBadges as string || "[]"),
            goodDeedsCount: profileData.goodDeedsCount
          });
        }

        // 2. Sync good deeds
        const { data: deedsData, error: deedsErr } = await supabase
          .from("good_deeds")
          .select("*")
          .order("timestamp", { ascending: false });

        if (!deedsErr && deedsData && deedsData.length > 0) {
          setGoodDeeds(deedsData.map(d => ({
            id: d.id,
            studentName: d.studentName,
            studentClass: d.studentClass,
            category: d.category as any,
            description: d.description,
            timestamp: d.timestamp,
            status: d.status as any,
            xpAwarded: d.xpAwarded
          })));
        }

        // 3. Sync quests
        const { data: questsData, error: questsErr } = await supabase
          .from("quests")
          .select("*")
          .order("id", { ascending: true });

        if (!questsErr && questsData && questsData.length > 0) {
          setQuests(questsData.map(q => ({
            id: q.id,
            title: q.title,
            category: q.category as any,
            xp: q.xp,
            completed: q.completed,
            isCustom: q.isCustom,
            description: q.description || undefined
          })));
        }

        // 4. Sync quizzes
        const { data: quizzesData, error: quizzesErr } = await supabase
          .from("quizzes")
          .select("*")
          .order("id", { ascending: true });

        if (!quizzesErr && quizzesData && quizzesData.length > 0) {
          setQuizzes(quizzesData.map(q => ({
            id: q.id,
            question: q.question,
            options: Array.isArray(q.options) 
              ? q.options 
              : JSON.parse(q.options as string || "[]"),
            answer: q.answer,
            xp: q.xp
          })));
        }

        // 5. Sync club messages
        const { data: msgsData, error: msgsErr } = await supabase
          .from("club_messages")
          .select("*")
          .order("timestamp", { ascending: true });

        if (!msgsErr && msgsData && msgsData.length > 0) {
          setClubMessages(msgsData.map(m => ({
            id: m.id,
            clubName: m.clubName,
            sender: m.sender,
            role: m.role,
            content: m.content,
            timestamp: m.timestamp
          })));
        }

        // 6. Sync encouragements
        const { data: encsData, error: encsErr } = await supabase
          .from("encouragements")
          .select("*")
          .order("id", { ascending: true });

        if (!encsErr && encsData && encsData.length > 0) {
          setEncouragements(encsData.map(e => ({
            id: e.id,
            text: e.text,
            sender: e.sender,
            claimed: e.claimed
          })));
        }
      } catch (err) {
        console.error("General Supabase synchronization error:", err);
      }
    }

    loadSupabaseData();
  }, []);

  // Sync profile state back to Supabase automatically when updated
  useEffect(() => {
    if (!supabaseActive) return;
    async function syncProfile() {
      try {
        await supabase
          .from("student_profiles")
          .upsert({
            id: studentProfileId,
            name: profile.name,
            className: profile.className,
            xp: profile.xp,
            level: profile.level,
            completedQuests: profile.completedQuests,
            joinedClubs: profile.joinedClubs,
            unlockedBadges: profile.unlockedBadges,
            goodDeedsCount: profile.goodDeedsCount
          });
      } catch (err) {
        console.error("Error syncing student profile to Supabase:", err);
      }
    }
    syncProfile();
  }, [profile, supabaseActive, studentProfileId]);

  useEffect(() => {
    localStorage.setItem("lhp_current_role", currentRole);
    localStorage.setItem("lhp_active_module", activeModule.toString());
    localStorage.setItem("lhp_student_profile_id", studentProfileId);
    localStorage.setItem("lhp_student_profile", JSON.stringify(profile));
    localStorage.setItem("lhp_good_deeds", JSON.stringify(goodDeeds));
    localStorage.setItem("lhp_quests", JSON.stringify(quests));
    localStorage.setItem("lhp_quizzes", JSON.stringify(quizzes));
    localStorage.setItem("lhp_clubs", JSON.stringify(clubs));
    localStorage.setItem("lhp_club_messages", JSON.stringify(clubMessages));
    localStorage.setItem("lhp_encouragements", JSON.stringify(encouragements));
    localStorage.setItem("lhp_admin_logged", adminLoggedIn ? "true" : "false");
    if (lastWatered) localStorage.setItem("lhp_last_watered", lastWatered);
  }, [currentRole, activeModule, studentProfileId, profile, goodDeeds, quizzes, quests, clubs, clubMessages, encouragements, adminLoggedIn, lastWatered]);

  const addSystemLog = (message: string) => {
    const time = new Date().toLocaleTimeString();
    setSystemLogs((prev) => [`[${time}] ${message}`, ...prev.slice(0, 39)]);
  };

  // ==================== REWARD ENGINE ====================
  const awardXp = (xpAwarded: number, badgeIdToUnlock?: string) => {
    setProfile((prev) => {
      const nextXp = prev.xp + xpAwarded;
      // Formula: level increases by 1 for every 400 XP gained beyond base
      const nextLevel = 12 + Math.floor((nextXp - 2350) / 400);

      const updatedBadges = [...prev.unlockedBadges];
      if (badgeIdToUnlock && !updatedBadges.includes(badgeIdToUnlock)) {
        updatedBadges.push(badgeIdToUnlock);
        setTimeout(() => {
          showToast(`🏆 HUY CHƯƠNG MỚI ĐÃ ĐƯỢC GIẢI MÃ: "${initialBadges.find(b => b.id === badgeIdToUnlock)?.title}"!`, "success");
        }, 1000);
      }

      addSystemLog(`Trần Minh Anh nhận +${xpAwarded} XP. XP mới: ${nextXp}. Cấp: ${nextLevel}`);
      return {
        ...prev,
        xp: nextXp,
        level: nextLevel > prev.level ? nextLevel : prev.level,
        unlockedBadges: updatedBadges
      };
    });
  };

  const handleQuestCheckbox = async (questId: string, xpGained: number) => {
    setQuests((prev) =>
      prev.map((q) => (q.id === questId ? { ...q, completed: true } : q))
    );
    setProfile((prev) => ({
      ...prev,
      completedQuests: [...prev.completedQuests, questId]
    }));
    awardXp(xpGained);
    showToast(`Nhiệm vụ hoàn thành! Nhận +${xpGained} XP rèn luyện.`, "success");
    addSystemLog(`Hoàn thành sứ mệnh: ${quests.find(q => q.id === questId)?.title}`);

    try {
      await supabase.from("quests").update({ completed: true }).eq("id", questId);
    } catch (err) {
      console.error("Error updating quest in Supabase:", err);
    }
  };

  const handleWaterTree = () => {
    const today = new Date().toLocaleDateString("vi-VN");
    if (lastWatered === today) {
      showToast("Hôm nay con đã tưới nước cho cây rồi. Đợi ngày mai tưới tiếp nhé!", "error");
      return;
    }
    setLastWatered(today);
    awardXp(30, "b2");
    showToast("Nước mát tưới mát mầm non! Cây rèn luyện của bạn nhận thêm +30 XP rèn luyện ngày.", "success");
    addSystemLog("Học sinh Trần Minh Anh tưới cây rèn luyện hằng ngày.");
  };

  const handlePostDeed = async (
    category: "Đạo đức" | "Pháp luật" | "Kỹ năng" | "Văn minh", 
    desc: string,
    youtubeUrl?: string,
    fileData?: string,
    fileName?: string
  ) => {
    const newDeed: GoodDeed = {
      id: "gd_" + Date.now().toString(),
      studentName: profile.name,
      studentClass: profile.className,
      category,
      description: desc,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
      status: "Chờ duyệt",
      xpAwarded: 40,
      youtubeUrl,
      fileData,
      fileName
    };
    setGoodDeeds((prev) => [newDeed, ...prev]);
    awardXp(40); // 40 XP instantly for writing deed
    showToast("Lưu chép thành công! Thưởng tức thời +40 XP. Chờ thầy cô Lê Hồng Phong duyệt nhận tiếp +50 XP!", "success");
    addSystemLog(`Tự chép việc tốt nhóm [${category}] chờ phê duyệt.`);

    try {
      await supabase.from("good_deeds").insert({
        id: newDeed.id,
        studentName: newDeed.studentName,
        studentClass: newDeed.studentClass,
        category: newDeed.category,
        description: newDeed.description,
        timestamp: newDeed.timestamp,
        status: newDeed.status,
        xpAwarded: newDeed.xpAwarded,
        youtubeUrl: newDeed.youtubeUrl || null,
        fileData: newDeed.fileData || null,
        fileName: newDeed.fileName || null
      });
    } catch (err) {
      console.error("Error saving good deed to Supabase:", err);
    }
  };

  const handleClaimParentEncouragement = async (index: number) => {
    setEncouragements((prev) =>
      prev.map((msg, idx) => (idx === index ? { ...msg, claimed: true } : msg))
    );
    awardXp(15);
    showToast("Em nhận được thêm +15 XP động lực rèn luyện của cha mẹ gửi tặng!", "success");
    addSystemLog("Nhấp nhận năng lượng tình thương phụ huynh.");

    try {
      const target = encouragements[index];
      if (target) {
        if ((target as any).id) {
          await supabase.from("encouragements").update({ claimed: true }).eq("id", (target as any).id);
        } else {
          await supabase.from("encouragements").update({ claimed: true }).eq("text", target.text).eq("sender", target.sender);
        }
      }
    } catch (err) {
      console.error("Error claiming encouragement in Supabase:", err);
    }
  };

  // ==================== AI CHATBOT (GEMINI INTEGRATION) ====================
  const [aiMessages, setAiMessages] = useState<{ role: "user" | "assistant"; content: string; time: string }[]>([
    {
      role: "assistant",
      content: "Xin chào bạn học sinh THCS Lê Hồng Phong! Mình là Trợ lý AI Công Dân Số, sẵn sàng tư vấn giúp bạn giải quyết mâu thuẫn học đường, thắc mắc đạo đức, kỹ năng ứng xử hay pháp lý bất cứ lúc nào. Đặt câu hỏi cho mình ngay bên dưới nhé! 😊",
      time: "Vừa xong"
    }
  ]);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const handleSendAiMessage = async (overridePrompt?: string) => {
    const textToSend = overridePrompt || aiInput;
    if (!textToSend.trim() || aiLoading) return;

    const userTime = new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
    const userMsg = { role: "user" as const, content: textToSend, time: userTime };
    setAiMessages((prev) => [...prev, userMsg]);
    setAiInput("");
    setAiLoading(true);

    addSystemLog(`Gửi câu hỏi cho Trợ lý AI: "${textToSend.substring(0, 30)}..."`);

    // Scroll chat down
    setTimeout(() => chatBottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);

    try {
      // Map existing messages to backend payload format
      const historyPayload = aiMessages.concat(userMsg).map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: historyPayload,
          systemInstruction: "Bạn là Trợ lý AI tư vấn giáo dục kỹ năng, đạo đức và pháp luật trường THCS Lê Hồng Phong. Hãy trả lời học sinh thật tinh tế, khôn ngoan, khích lệ họ sống có ích, biết ơn và tôn trọng luật pháp. Chú ý sử dụng các icon bắt mắt và thân thiện."
        })
      });

      const data = await res.json();
      const replyTime = new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
      
      setAiMessages((prev) => [...prev, { role: "assistant", content: data.text, time: replyTime }]);
      awardXp(10, "b3"); // awarding XP for AI learning interaction!
    } catch (err) {
      console.error(err);
      showToast("Lỗi kết nối AI máy chủ. Chuyển hướng phản hồi dự phòng.", "error");
    } finally {
      setAiLoading(false);
      setTimeout(() => chatBottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  };

  // ==================== ROLE-SPECIFIC OPERATIONS ====================
  // Teacher approved deeds
  const handleApproveDeed = async (id: string, status: "Đã duyệt" | "Đã từ chối") => {
    setGoodDeeds((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status } : d))
    );
    addSystemLog(`Giáo viên xử lý phê duyệt việc tốt ID: ${id} -> Trạng thái: ${status}`);

    try {
      await supabase.from("good_deeds").update({ status }).eq("id", id);
    } catch (err) {
      console.error("Error updating deed status in Supabase:", err);
    }
  };

  const handleTeacherAddQuest = async (newQuest: Omit<Quest, "id" | "completed">) => {
    const q: Quest = {
      ...newQuest,
      id: "q_custom_" + Date.now().toString(),
      completed: false,
      isCustom: true
    };
    setQuests((prev) => [q, ...prev]);
    addSystemLog(`Giáo viên ban hành sứ mệnh tuần mới: "${q.title}" (+${q.xp} XP)`);

    try {
      await supabase.from("quests").insert({
        id: q.id,
        title: q.title,
        category: q.category,
        xp: q.xp,
        completed: q.completed,
        isCustom: q.isCustom,
        description: q.description || null
      });
    } catch (err) {
      console.error("Error creating custom quest in Supabase:", err);
    }
  };

  const handleParentSendEncouragement = async (text: string) => {
    const newEnc = { text, sender: "Phụ huynh lớp 7A5", claimed: false };
    setEncouragements((prev) => [newEnc, ...prev]);
    addSystemLog(`Phụ huynh gửi lời động viên: "${text.substring(0, 25)}..."`);

    try {
      await supabase.from("encouragements").insert({
        text: newEnc.text,
        sender: newEnc.sender,
        claimed: newEnc.claimed
      });
    } catch (err) {
      console.error("Error saving encouragement to Supabase:", err);
    }
  };

  // ==================== ADMIN OPERATIONS ====================
  const handleAdminAddQuiz = async (qPayload: Omit<QuizQuestion, "id">) => {
    const newQ: QuizQuestion = {
      ...qPayload,
      id: "quiz_cust_" + Date.now().toString()
    };
    setQuizzes((prev) => [...prev, newQ]);
    addSystemLog(`Admin thêm câu hỏi trắc nghiệm mới ID: ${newQ.id}`);

    try {
      await supabase.from("quizzes").insert({
        id: newQ.id,
        question: newQ.question,
        options: newQ.options,
        answer: newQ.answer,
        xp: newQ.xp
      });
    } catch (err) {
      console.error("Error adding quiz question to Supabase:", err);
    }
  };

  const handleAdminDeleteQuiz = async (id: string) => {
    setQuizzes((prev) => prev.filter((q) => q.id !== id));
    addSystemLog(`Admin xóa câu hỏi trắc nghiệm ID: ${id}`);
    showToast("Đã xóa câu hỏi trắc nghiệm thành công!", "success");

    try {
      await supabase.from("quizzes").delete().eq("id", id);
    } catch (err) {
      console.error("Error deleting quiz from Supabase:", err);
    }
  };

  const handleAdminUpdateQuiz = async (id: string, qPayload: Omit<QuizQuestion, "id">) => {
    setQuizzes((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...qPayload } : q))
    );
    addSystemLog(`Admin chỉnh sửa câu hỏi trắc nghiệm ID: ${id}`);

    try {
      await supabase.from("quizzes").update({
        question: qPayload.question,
        options: qPayload.options,
        answer: qPayload.answer,
        xp: qPayload.xp
      }).eq("id", id);
    } catch (err) {
      console.error("Error updating quiz in Supabase:", err);
    }
  };

  const handleAdminAdjustStudentXp = async (name: string, newXp: number) => {
    if (name === profile.name) {
      setProfile((prev) => {
        const nextLevel = 12 + Math.floor((newXp - 2350) / 400);
        return {
          ...prev,
          xp: newXp,
          level: nextLevel > prev.level ? nextLevel : prev.level
        };
      });
    }
    addSystemLog(`Admin điều chỉnh XP học sinh "${name}" thành ${newXp}`);
  };

  // ==================== CANVASES BACKGROUND PARTICLE SIMULATION ====================
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: {
      x: number;
      y: number;
      r: number;
      speed: number;
      angle: number;
      swing: number;
      swingAmount: number;
      opacity: number;
      type: "circle" | "star";
    }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = [];
      for (let i = 0; i < 55; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 2.2 + 0.8, // 0.8px to 3.0px
          speed: Math.random() * 0.6 + 0.3, // 0.3 to 0.9 px/frame (very gentle drift)
          angle: Math.random() * Math.PI * 2,
          swing: Math.random() * 0.015 + 0.005, // sway speed
          swingAmount: Math.random() * 0.5 + 0.2, // sway distance
          opacity: Math.random() * 0.45 + 0.3, // opacity 0.3 to 0.75
          type: Math.random() > 0.85 ? "star" : "circle"
        });
      }
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.strokeStyle = `rgba(255, 255, 255, ${p.opacity * 0.6})`;
        ctx.lineWidth = 1;

        if (p.type === "star") {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y - p.r);
          ctx.lineTo(p.x, p.y + p.r);
          ctx.moveTo(p.x - p.r, p.y);
          ctx.lineTo(p.x + p.r, p.y);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true);
          ctx.fill();
        }

        p.y += p.speed;
        p.angle += p.swing;
        p.x += Math.sin(p.angle) * p.swingAmount;

        if (p.y > canvas.height || p.x < -10 || p.x > canvas.width + 10) {
          particles[i] = {
            x: Math.random() * canvas.width,
            y: -10,
            r: p.r,
            speed: p.speed,
            angle: Math.random() * Math.PI * 2,
            swing: p.swing,
            swingAmount: p.swingAmount,
            opacity: p.opacity,
            type: p.type
          };
        }
      }
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="text-slate-100 flex flex-col min-h-screen relative overflow-x-hidden selection:bg-purple-500 selection:text-white pb-6 font-sans">
      {/* Background Aurora Glows */}
      <div className="aurora-bg-glow aurora-pink" />
      <div className="aurora-bg-glow aurora-blue" />
      <div className="aurora-bg-glow aurora-purple" />

      {/* Interactive canvas backdrop */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-10" />

      {/* Floating toasts alert popup desk */}
      <div className="fixed top-24 right-4 z-[100] pointer-events-none space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`p-4 rounded-2xl text-xs font-black text-white shadow-2xl pointer-events-auto flex items-center gap-2.5 transition-all transform duration-300 border bg-slate-900/95 ${
              t.type === "success"
                ? "border-emerald-500/50 text-emerald-300 shadow-emerald-950/40"
                : "border-rose-500/50 text-rose-300 shadow-rose-950/40"
            }`}
          >
            <span>{t.type === "success" ? "✔️" : "❌"}</span>
            <span className="leading-relaxed">{t.message}</span>
          </div>
        ))}
      </div>

      {!isLoggedIn ? (
        <LoginScreen onLoginSuccess={handleLoginSuccess} showToast={showToast} />
      ) : (
        <>
          {/* Primary Header Component */}
          <Header
            currentRole={currentRole}
            onRoleChange={(role) => {
              setCurrentRole(role);
              addSystemLog(`Chuyển đổi vai trò sang: ${role}`);
              if (role === Role.GIAO_VIEN) {
                setActiveModule(10);
                showToast("Đã chuyển đổi sang cổng Nghiệp vụ Giáo viên!", "success");
              } else if (role === Role.PHU_HUYNH) {
                setActiveModule(11);
                showToast("Đã đồng bộ cổng thông tin Phụ huynh con Trần Minh Anh!", "success");
              } else if (role === Role.ADMIN) {
                setActiveModule(12);
                if (adminLoggedIn) {
                  showToast("Đã kết nối trạm quản trị điều hành.", "success");
                } else {
                  showToast("Vui lòng nhập mật mã quản trị viên (admin/admin)!", "error");
                }
              } else {
                setActiveModule(1);
              }
            }}
            profile={profile}
          />

      {/* Primary Shell wrapper Grid */}
      <div className="relative z-20 flex-1 max-w-7xl w-full mx-auto flex flex-col lg:flex-row gap-6 p-4">
        {/* Left sidebar directory navigation panel */}
        <aside className="w-full lg:w-72 flex-shrink-0">
          <div className="bg-slate-950/40 backdrop-blur-2xl rounded-3xl p-4 border border-white/10 shadow-2xl sticky top-28 space-y-4">
            
            {/* Participant Identity Panel */}
            <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-3.5 space-y-2.5 text-left">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
                  Danh tính tham gia
                </span>
                {!isEditingProfile ? (
                  <button
                    onClick={() => {
                      setEditName(profile.name);
                      setEditClass(profile.className);
                      setIsEditingProfile(true);
                    }}
                    className="text-[10px] text-cyan-400 font-extrabold hover:underline cursor-pointer"
                  >
                    Thay đổi
                  </button>
                ) : (
                  <button
                    onClick={handleSaveProfile}
                    className="text-[10px] text-emerald-400 font-black hover:underline cursor-pointer"
                  >
                    Lưu
                  </button>
                )}
              </div>

              {!isEditingProfile ? (
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-400 to-indigo-500 flex items-center justify-center font-black text-slate-950 text-xs shadow-md">
                    {profile.name.split(" ").pop()?.substring(0, 2).toUpperCase() || "LHP"}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-200 text-xs">{profile.name}</h4>
                    <p className="text-[10px] text-slate-400 font-medium">Lớp {profile.className} • THCS LHP</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 text-xs">
                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-400 font-semibold" htmlFor="sidebar-edit-name">Họ và tên</label>
                    <input
                      type="text"
                      id="sidebar-edit-name"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full text-xs p-1.5 bg-slate-950 border border-slate-800 rounded outline-none text-slate-100 focus:border-cyan-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-400 font-semibold" htmlFor="sidebar-edit-class">Lớp</label>
                    <input
                      type="text"
                      id="sidebar-edit-class"
                      value={editClass}
                      onChange={(e) => setEditClass(e.target.value)}
                      className="w-full text-xs p-1.5 bg-slate-950 border border-slate-800 rounded outline-none text-slate-100 focus:border-cyan-500"
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3">Danh mục hành trình</p>
            </div>
            
            <nav className="space-y-1.5">
              {[
                { id: 1, title: "1. Trang chủ", icon: <Home className="w-4 h-4 text-pink-400" /> },
                { id: 2, title: "2. Sân chơi GDCD", icon: <Gamepad2 className="w-4 h-4 text-indigo-400" /> },
                { id: 3, title: "3. Câu lạc bộ", icon: <UsersRound className="w-4 h-4 text-emerald-400" /> },
                { id: 4, title: "4. Kho tình huống", icon: <FolderGit2 className="w-4 h-4 text-blue-400" /> },
                { id: 5, title: "5. Kho học liệu số", icon: <Library className="w-4 h-4 text-yellow-400" /> },
                { id: 6, title: "6. Thử thách công dân", icon: <SwatchBook className="w-4 h-4 text-rose-400" /> },
                { id: 7, title: "7. Cây năng lượng LHP", icon: <Milestone className="w-4 h-4 text-cyan-400" /> },
                { id: 8, title: "8. Thành tích - Thi đua", icon: <Trophy className="w-4 h-4 text-amber-400" /> },
                { id: 9, title: "9. AI Công dân Trợ Lý", icon: <Bot className="w-4 h-4 text-violet-400 animate-pulse" /> }
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    setActiveModule(m.id);
                    if (currentRole !== Role.HOC_SINH) {
                      setCurrentRole(Role.HOC_SINH);
                      showToast("Đã tự động trả về vai trò Học sinh.", "success");
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-left text-xs font-bold transition-all border ${
                    activeModule === m.id && currentRole === Role.HOC_SINH
                      ? "bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10 text-pink-300 border-pink-500/30 shadow-[0_0_15px_rgba(236,72,153,0.15)]"
                      : "text-slate-300 border-transparent hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    {m.icon}
                    {m.title}
                  </span>
                  {m.id === 1 && (
                    <span className="bg-pink-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-black animate-pulse">
                      NEW
                    </span>
                  )}
                  {m.id === 9 && (
                    <span className="bg-violet-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-black uppercase">
                      CHAT
                    </span>
                  )}
                </button>
              ))}

              <div className="h-[1px] bg-white/10 my-3"></div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 py-1">Hệ thống phân quyền</p>

              <button
                onClick={() => {
                  setCurrentRole(Role.GIAO_VIEN);
                  setActiveModule(10);
                }}
                className={`w-full flex items-center gap-2.5 px-3.5 py-3 rounded-2xl text-left text-xs font-bold transition-all border ${
                  activeModule === 10
                    ? "bg-gradient-to-r from-emerald-500/15 to-teal-500/15 text-emerald-300 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                    : "text-slate-400 border-transparent hover:text-emerald-300 hover:bg-white/5"
                }`}
              >
                <NotebookTabs className="w-4 h-4 text-emerald-500" />
                10. GV Lê Hồng Phong
              </button>

              <button
                onClick={() => {
                  setCurrentRole(Role.PHU_HUYNH);
                  setActiveModule(11);
                }}
                className={`w-full flex items-center gap-2.5 px-3.5 py-3 rounded-2xl text-left text-xs font-bold transition-all border ${
                  activeModule === 11
                    ? "bg-gradient-to-r from-orange-500/15 to-pink-500/15 text-orange-300 border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.15)]"
                    : "text-slate-400 border-transparent hover:text-orange-300 hover:bg-white/5"
                }`}
              >
                <Baby className="w-4 h-4 text-orange-500" />
                11. Cổng Phụ huynh
              </button>

              <button
                onClick={() => {
                  setCurrentRole(Role.ADMIN);
                  setActiveModule(12);
                }}
                className={`w-full flex items-center gap-2.5 px-3.5 py-3 rounded-2xl text-left text-xs font-bold transition-all border ${
                  activeModule === 12
                    ? "bg-gradient-to-r from-cyan-500/15 to-blue-500/15 text-cyan-300 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                    : "text-slate-400 border-transparent hover:text-cyan-300 hover:bg-white/5"
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-cyan-500" />
                12. Quản trị viên
              </button>
            </nav>

            {/* Quick AI Help card */}
            <div className="mt-4 p-4 rounded-2xl bg-gradient-to-tr from-indigo-950/60 to-purple-950/60 text-white text-xs border border-purple-500/20">
              <h4 className="font-extrabold flex items-center gap-1.5 text-cyan-300">
                <Sparkles className="w-4 h-4 text-cyan-300" /> Trợ lý AI pháp lý LHP
              </h4>
              <p className="text-slate-400 leading-relaxed text-[10px] mt-1">
                Hỏi đáp nhanh mọi tình huống về bạo lực học đường, kỹ năng an toàn số và ứng xử 24/7 tức thì.
              </p>
              <button
                onClick={() => {
                  setActiveModule(9);
                  if (currentRole !== Role.HOC_SINH) setCurrentRole(Role.HOC_SINH);
                }}
                className="w-full bg-cyan-400 hover:bg-cyan-500 text-slate-950 font-black py-2 rounded-xl transition-all shadow-md mt-2.5 text-[11px] cursor-pointer"
              >
                TRÒ CHUYỆN AI NGAY
              </button>
            </div>
          </div>
        </aside>

        {/* Center / Active workspace content render desk */}
        <main className="flex-1 min-w-0">
          
          {/* ==================== MODULE 1: TRANG CHỦ ==================== */}
          {activeModule === 1 && (
            <div className="space-y-6 animate-fade-in">
              {/* Banner */}
              <div className="bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-2xl border border-white/10 flex flex-col justify-between min-h-[180px]">
                <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl"></div>
                <div className="relative z-10 max-w-xl space-y-2 text-left">
                  <span className="inline-block bg-white/10 text-white text-[10px] font-black px-3.5 py-1.5 rounded-full backdrop-blur-md border border-white/10 uppercase tracking-widest">
                    Trường THCS Lê Hồng Phong 👋
                  </span>
                  <h2 className="text-xl md:text-3xl font-black leading-tight tracking-tight">
                    Khám phá kỹ năng mới, gieo mầm việc thiện mỗi ngày!
                  </h2>
                  <p className="text-slate-200 text-xs leading-relaxed max-w-md">
                    Hoàn thành các thử thách công dân tích cực để rèn luyện tư cách đạo đức, vun đắp cho cây năng lượng vũ trụ tươi xanh rực rỡ.
                  </p>
                </div>
              </div>

              {/* Dynamic Love Seed section (Floating Parent Encouragement messages) */}
              {encouragements.filter(msg => !msg.claimed).length > 0 && (
                <div className="space-y-2.5 text-left">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1 px-1">
                    <Heart className="w-4 h-4 text-pink-500 animate-pulse" /> Hạt giống yêu thương gửi từ Cha Mẹ
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {encouragements
                      .filter((msg) => !msg.claimed)
                      .map((msg, index) => (
                        <div
                          key={index}
                          className="bg-gradient-to-r from-pink-500/10 to-orange-500/5 border border-pink-500/20 p-4 rounded-3xl flex justify-between items-center gap-4 hover:border-pink-500/40 transition-colors"
                        >
                          <div className="space-y-1 text-xs">
                            <span className="text-[9px] font-black text-pink-400 block uppercase tracking-wider">Thư gia đình gửi</span>
                            <p className="text-slate-200 leading-relaxed italic font-medium">"{msg.text}"</p>
                          </div>
                          <button
                            onClick={() => handleClaimParentEncouragement(index)}
                            className="bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-[10px] px-3.5 py-2 rounded-xl transition-all shadow-md flex-shrink-0 flex items-center gap-0.5 cursor-pointer"
                          >
                            HẤP THỤ (+15 XP)
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Today's Missions & Leaderboard row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Checklist column */}
                <div className="bg-slate-900/40 backdrop-blur-xl rounded-3xl p-6 border border-slate-800/80 shadow-xl col-span-1 md:col-span-2 space-y-4 text-left">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-slate-200 text-xs sm:text-sm flex items-center gap-2">
                      <Award className="w-5 h-5 text-cyan-400" /> NHIỆM VỤ RÈN LUYỆN HÔM NAY
                    </h3>
                    <span className="text-[10px] text-slate-400 bg-slate-800/60 px-2.5 py-1 rounded-full border border-slate-700/50 font-bold">
                      Bình thường
                    </span>
                  </div>

                  <div className="space-y-3">
                    {quests.map((q) => (
                      <div
                        key={q.id}
                        className={`flex items-start gap-3.5 p-3.5 bg-slate-950/40 rounded-2xl border transition-all ${
                          q.completed
                            ? "border-slate-900 opacity-45"
                            : "border-slate-800 hover:border-purple-500/30 cursor-pointer"
                        }`}
                        onClick={() => {
                          if (!q.completed) handleQuestCheckbox(q.id, q.xp);
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={q.completed}
                          onChange={() => {}}
                          className="w-4 h-4 rounded mt-0.5 text-purple-600 focus:ring-purple-500"
                          disabled={q.completed}
                        />
                        <div className="flex-grow text-xs space-y-0.5">
                          <p className={`font-bold ${q.completed ? "line-through text-slate-500" : "text-slate-200"}`}>
                            {q.title}
                          </p>
                          {q.description && !q.completed && (
                            <p className="text-[10px] text-slate-500 leading-relaxed">{q.description}</p>
                          )}
                          <p className="text-[9px] text-cyan-400 font-bold uppercase tracking-wider">
                            +{q.xp} XP • Nhóm: {q.category}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Leaderboard Column */}
                <div className="bg-slate-900/40 backdrop-blur-xl rounded-3xl p-6 border border-slate-800/80 shadow-xl space-y-4 text-left">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-slate-200 text-xs sm:text-sm flex items-center gap-1.5">
                      <Trophy className="w-5 h-5 text-amber-400" /> BẢNG VÀNG LHP
                    </h3>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm">🥇</span>
                        <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-black text-[10px]">NL</div>
                        <div>
                          <p className="font-bold text-white leading-none">Nguyễn Linh</p>
                          <p className="text-[8px] text-slate-400 mt-1">Lớp 8A1</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-amber-400 font-mono">3,450 XP</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-950/40 border border-slate-850">
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm">🥈</span>
                        <div className="w-7 h-7 rounded-full bg-slate-500 text-white flex items-center justify-center font-black text-[10px]">HK</div>
                        <div>
                          <p className="font-bold text-slate-300 leading-none">Hoàng Kiên</p>
                          <p className="text-[8px] text-slate-400 mt-1">Lớp 9B2</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-300 font-mono">3,120 XP</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-2xl bg-purple-500/5 border border-purple-500/10">
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm">🥉</span>
                        <div className="w-7 h-7 rounded-full bg-pink-500 text-white flex items-center justify-center font-black text-[10px]">MA</div>
                        <div>
                          <p className="font-bold text-white leading-none">Trần Minh Anh</p>
                          <p className="text-[8px] text-slate-400 mt-1">Lớp {profile.className}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-pink-400 font-mono">{profile.xp.toLocaleString()} XP</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ==================== MODULE 2: SÂN CHƠI GDCD ==================== */}
          {activeModule === 2 && (
            <QuizArena
              quizzes={quizzes}
              profile={profile}
              onAwardXp={awardXp}
              showToast={showToast}
            />
          )}

          {/* ==================== MODULE 3: CÂU LẠC BỘ ==================== */}
          {activeModule === 3 && (
            <ClubsForum
              clubs={clubs}
              profile={profile}
              clubMessages={clubMessages}
              onJoinClub={async (clubName) => {
                const alreadyJoined = profile.joinedClubs.includes(clubName);
                if (alreadyJoined) return;

                setProfile((prev) => ({
                  ...prev,
                  joinedClubs: [...prev.joinedClubs, clubName]
                }));
                setClubs((prev) =>
                  prev.map((c) => (c.name === clubName ? { ...c, membersCount: c.membersCount + 1 } : c))
                );

                // Auto post joining message to board
                const systemJoinMsg: ClubMessage = {
                  id: "sys_" + Date.now().toString(),
                  clubName,
                  sender: profile.name,
                  role: `Học sinh lớp ${profile.className}`,
                  content: `👋 Chào các bạn! Mình vừa gia nhập câu lạc bộ. Rất vui được đồng hành cùng mọi người rèn luyện!`,
                  timestamp: new Date().toISOString().replace("T", " ").substring(0, 16)
                };
                setClubMessages((prev) => [...prev, systemJoinMsg]);
                showToast(`Gia nhập "${clubName}" thành công! Thưởng rèn luyện hội viên mới +30 XP!`, "success");
                awardXp(30);

                try {
                  await supabase.from("club_messages").insert({
                    id: systemJoinMsg.id,
                    clubName: systemJoinMsg.clubName,
                    sender: systemJoinMsg.sender,
                    role: systemJoinMsg.role,
                    content: systemJoinMsg.content,
                    timestamp: systemJoinMsg.timestamp
                  });
                } catch (err) {
                  console.error("Error saving club joining message to Supabase:", err);
                }
              }}
              onPostMessage={async (clubName, content, youtubeUrl, fileData, fileName, fileType) => {
                const newMsg: ClubMessage = {
                  id: "msg_" + Date.now().toString(),
                  clubName,
                  sender: profile.name,
                  role: `Lớp ${profile.className}`,
                  content,
                  timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
                  youtubeUrl,
                  fileData,
                  fileName,
                  fileType
                };
                setClubMessages((prev) => [...prev, newMsg]);

                try {
                  await supabase.from("club_messages").insert({
                    id: newMsg.id,
                    clubName: newMsg.clubName,
                    sender: newMsg.sender,
                    role: newMsg.role,
                    content: newMsg.content,
                    timestamp: newMsg.timestamp,
                    youtubeUrl: newMsg.youtubeUrl || null,
                    fileData: newMsg.fileData || null,
                    fileName: newMsg.fileName || null,
                    fileType: newMsg.fileType || null
                  });
                } catch (err) {
                  console.error("Error saving club message to Supabase:", err);
                }
              }}
              onReportContribution={async (clubName, text, xpAward) => {
                const newMsg: ClubMessage = {
                  id: "contrib_" + Date.now().toString(),
                  clubName,
                  sender: profile.name,
                  role: `Lớp ${profile.className}`,
                  content: text,
                  timestamp: new Date().toISOString().replace("T", " ").substring(0, 16)
                };
                setClubMessages((prev) => [...prev, newMsg]);
                awardXp(xpAward);
                showToast(`Đã công bố báo cáo việc tốt lên diễn đàn CLB! Nhận +${xpAward} XP!`, "success");

                try {
                  await supabase.from("club_messages").insert({
                    id: newMsg.id,
                    clubName: newMsg.clubName,
                    sender: newMsg.sender,
                    role: newMsg.role,
                    content: newMsg.content,
                    timestamp: newMsg.timestamp
                  });
                } catch (err) {
                  console.error("Error saving club contribution to Supabase:", err);
                }
              }}
            />
          )}

          {/* ==================== MODULE 4: KHO TÌNH HUỐNG ==================== */}
          {activeModule === 4 && (
            <ScenariosSimulator
              scenarios={initialScenarios}
              profile={profile}
              onAwardXp={awardXp}
              showToast={showToast}
            />
          )}

          {/* ==================== MODULE 5: KHO HỌC LIỆU SỐ ==================== */}
          {activeModule === 5 && (
            <LearningLibrary showToast={showToast} />
          )}

          {/* ==================== MODULE 6: THỬ THÁCH CÔNG DÂN ==================== */}
          {activeModule === 6 && (
            <div className="space-y-6 animate-fade-in text-left">
              <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-5 backdrop-blur-md">
                <h2 className="text-xl font-bold text-rose-300 flex items-center gap-2">
                  <SwatchBook className="w-6 h-6 text-rose-400" /> Thử Thách Công Dân Tích Cực Tuần Này
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Đây là các thử thách thực tế có quy mô rèn luyện trung-dài hạn. Đăng tải minh chứng mô tả cụ thể để nhận phần thưởng năng lượng đạo đức lớn nhất!
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: "trial1", title: "Không sử dụng túi nilon dùng 1 lần suốt 3 ngày liên tiếp", category: "Lối sống xanh", xp: 120, desc: "Tự chuẩn bị hộp cá nhân khi mua đồ ăn sáng hoặc khéo léo từ chối túi nilon phụ thêm." },
                  { id: "trial2", title: "Giáo dục văn minh mạng: Xóa bỏ 1 bình luận độc hại", category: "Văn minh mạng", xp: 100, desc: "Chủ động khuyên nhủ bạn học gỡ bỏ một phát ngôn trêu chọc ác ý hoặc báo cáo xấu các trang xúc phạm." }
                ].map((tr) => {
                  const isClaimed = profile.completedQuests.includes(tr.id);
                  return (
                    <div key={tr.id} className="bg-slate-900/40 border border-slate-850 p-5 rounded-3xl flex justify-between items-center gap-4 hover:border-rose-500/30 transition-all">
                      <div className="space-y-1.5 text-xs">
                        <span className="text-[9px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">{tr.category}</span>
                        <h4 className="font-extrabold text-white text-xs leading-snug">{tr.title}</h4>
                        <p className="text-[10px] text-slate-400 leading-relaxed">{tr.desc}</p>
                        <span className="text-xs font-black text-amber-400 font-mono block">Phần thưởng: +{tr.xp} XP</span>
                      </div>
                      <button
                        onClick={() => {
                          if (isClaimed) return;
                          setProfile((prev) => ({
                            ...prev,
                            completedQuests: [...prev.completedQuests, tr.id]
                          }));
                          awardXp(tr.xp, "b1");
                          showToast(`Đã ghi nhận đóng góp hoàn thành thử thách! Bạn được nhận +${tr.xp} XP!`, "success");
                        }}
                        disabled={isClaimed}
                        className={`px-4 py-2 rounded-xl font-black text-xs transition-all flex-shrink-0 cursor-pointer ${
                          isClaimed
                            ? "bg-slate-800 text-slate-500 border border-slate-850 cursor-default"
                            : "bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-950"
                        }`}
                      >
                        {isClaimed ? "ĐÃ DUYỆT" : "HOÀN THÀNH"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ==================== MODULE 7: CÂY NĂNG LƯỢNG LHP ==================== */}
          {activeModule === 7 && (
            <MoralTree
              profile={profile}
              goodDeeds={goodDeeds}
              onAddGoodDeed={handlePostDeed}
              onWaterTree={handleWaterTree}
              lastWatered={lastWatered}
            />
          )}

          {/* ==================== MODULE 8: THÀNH TÍCH - THI ĐUA ==================== */}
          {activeModule === 8 && (
            <div className="space-y-6 animate-fade-in text-left text-xs">
              {/* Badge visual board */}
              <div className="bg-slate-900/40 p-5 rounded-3xl border border-slate-800 space-y-4">
                <h3 className="font-extrabold text-slate-200 text-xs uppercase tracking-wider border-b border-slate-800 pb-2">
                  HUY CHƯƠNG DANH GIÁ KHÓA RÈN LUYỆN
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {initialBadges.map((badge) => {
                    const isUnlocked = profile.unlockedBadges.includes(badge.id);
                    return (
                      <div
                        key={badge.id}
                        className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-center space-y-2.5 transition-all ${
                          isUnlocked
                            ? "bg-gradient-to-tr from-amber-500/10 to-orange-500/5 border-amber-500/30 text-amber-300"
                            : "bg-slate-950/60 border-slate-900 text-slate-500 opacity-40"
                        }`}
                      >
                        <span className="text-3xl filter drop-shadow-[0_0_6px_rgba(245,158,11,0.3)]">
                          {badge.id === "b1" ? "⭐" : badge.id === "b2" ? "🌱" : badge.id === "b3" ? "🛡️" : "🏆"}
                        </span>
                        <div>
                          <h4 className="font-extrabold text-xs">{badge.title}</h4>
                          <p className="text-[9px] text-slate-400 mt-1 leading-relaxed max-w-[120px] mx-auto">
                            {badge.description}
                          </p>
                        </div>
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${
                          isUnlocked ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : "bg-slate-900 text-slate-500"
                        }`}>
                          {isUnlocked ? "Đã mở khóa" : "Chưa đạt"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ==================== MODULE 9: AI CÔNG DÂN TRỢ LÝ ==================== */}
          {activeModule === 9 && (
            <div className="bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[480px] animate-fade-in text-left">
              {/* Chat Header */}
              <div className="bg-slate-950/90 text-white p-4 flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 bg-violet-600/20 text-violet-400 rounded-xl border border-violet-500/30">
                    <Bot className="w-5 h-5 animate-pulse" />
                  </span>
                  <div>
                    <h3 className="font-black text-xs text-slate-100">AI Trợ Lý Công Dân LHP</h3>
                    <p className="text-[9px] text-emerald-400 font-bold">Máy chủ Gemini 3.5 Flash Active</p>
                  </div>
                </div>
                <span className="text-[9px] text-slate-400 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-850">
                  Tương tác bảo mật • 24/7
                </span>
              </div>

              {/* Chat messages list */}
              <div className="flex-grow overflow-y-auto p-4 space-y-3.5 custom-scrollbar text-xs">
                {aiMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex gap-2.5 items-start max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : ""}`}
                  >
                    <span className={`p-1.5 rounded-lg flex-shrink-0 text-xs ${
                      msg.role === "user" ? "bg-purple-600 text-white" : "bg-slate-950 text-violet-400"
                    }`}>
                      {msg.role === "user" ? "👤" : "🤖"}
                    </span>
                    <div className={`p-3 rounded-2xl border text-slate-200 leading-relaxed whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "bg-purple-600/25 border-purple-500/30 rounded-tr-sm"
                        : "bg-slate-950/80 border-slate-850 rounded-tl-sm"
                    }`}>
                      {msg.content}
                      <span className="block text-[8px] text-slate-500 text-right mt-1.5 font-mono">{msg.time}</span>
                    </div>
                  </div>
                ))}
                {aiLoading && (
                  <div className="flex gap-2.5 items-start max-w-[85%]">
                    <span className="p-1.5 bg-slate-950 text-cyan-400 rounded-lg flex-shrink-0">⏳</span>
                    <div className="bg-slate-950/80 p-3 rounded-2xl rounded-tl-sm text-slate-400 italic border border-slate-850">
                      AI Lê Hồng Phong đang phân tích tư duy đạo đức học đường...
                    </div>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Chat recommendations */}
              <div className="px-4 py-2 bg-slate-950/40 border-t border-slate-850 overflow-x-auto whitespace-nowrap flex gap-2 custom-scrollbar">
                {[
                  "LHP khuyên em làm gì khi thấy bạo lực học đường xảy ra?",
                  "Làm sao để giữ văn hóa giao tiếp chuẩn văn minh mạng?",
                  "Hãy tư vấn các biện pháp tiết kiệm tài nguyên lớp học",
                  "Mật khẩu tài khoản bị hack, em cần xử lý khôn ngoan thế nào?"
                ].map((rec, index) => (
                  <button
                    key={index}
                    onClick={() => handleSendAiMessage(rec)}
                    className="bg-slate-950 border border-slate-850 text-slate-300 text-[10px] font-bold px-3 py-1.5 rounded-full hover:border-purple-500 hover:text-white transition-colors cursor-pointer flex-shrink-0"
                  >
                    {rec.substring(0, 35)}...
                  </button>
                ))}
              </div>

              {/* Chat Input form */}
              <div className="p-3 bg-slate-950 border-t border-slate-850 flex gap-2">
                <input
                  type="text"
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendAiMessage()}
                  placeholder="Đặt bất kỳ câu hỏi đạo đức, pháp lý hay mâu thuẫn học đường..."
                  className="flex-1 text-xs p-3 bg-slate-900 border border-slate-850 rounded-xl outline-none text-slate-100 focus:border-purple-500 placeholder-slate-600"
                />
                <button
                  onClick={() => handleSendAiMessage()}
                  className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-xl transition-all shadow-lg shadow-purple-600/30 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ==================== MODULE 10: GV LÊ HỒNG PHONG ==================== */}
          {activeModule === 10 && (
            <TeacherParentPortals
              viewMode="teacher"
              profile={profile}
              onAwardXpToStudent={(name, xp) => {
                if (name === profile.name || name === "Trần Minh Anh") {
                  awardXp(xp);
                }
              }}
              goodDeeds={goodDeeds}
              onApproveGoodDeed={handleApproveDeed}
              quests={quests}
              onAddQuestByTeacher={handleTeacherAddQuest}
              onSendEncouragement={() => {}}
              encouragementMessages={[]}
              showToast={showToast}
            />
          )}

          {/* ==================== MODULE 11: CỔNG PHỤ HUYNH ==================== */}
          {activeModule === 11 && (
            <TeacherParentPortals
              viewMode="parent"
              profile={profile}
              onAwardXpToStudent={() => {}}
              goodDeeds={goodDeeds}
              onApproveGoodDeed={() => {}}
              quests={[]}
              onAddQuestByTeacher={() => {}}
              onSendEncouragement={handleParentSendEncouragement}
              encouragementMessages={encouragements}
              showToast={showToast}
            />
          )}

          {/* ==================== MODULE 12: QUẢN TRỊ VIÊN ==================== */}
          {activeModule === 12 && (
            <AdminPanel
              quizzes={quizzes}
              onAddQuiz={handleAdminAddQuiz}
              onDeleteQuiz={handleAdminDeleteQuiz}
              onUpdateQuiz={handleAdminUpdateQuiz}
              students={[
                profile,
                { name: "Nguyễn Linh", className: "8A1", xp: 3450, level: 14, completedQuests: [], joinedClubs: [], unlockedBadges: [], goodDeedsCount: 22 },
                { name: "Lê Hoàng Kiên", className: "9B2", xp: 3120, level: 13, completedQuests: [], joinedClubs: [], unlockedBadges: [], goodDeedsCount: 18 }
              ]}
              onAdjustStudentXp={handleAdminAdjustStudentXp}
              adminLoggedIn={adminLoggedIn}
              onAdminLogin={(success) => setAdminLoggedIn(success)}
              showToast={showToast}
              systemLogs={systemLogs}
            />
          )}

        </main>
      </div>

      {/* Main Footer */}
      <footer className="relative z-20 bg-slate-950/80 text-white mt-12 py-8 px-4 border-t border-slate-850 text-center">
        <div className="max-w-7xl mx-auto space-y-4 text-xs">
          <h3 className="text-[11px] md:text-sm font-black tracking-widest bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-300 bg-clip-text text-transparent uppercase">
            HỌC ĐỂ BIẾT • CHƠI ĐỂ TRẢI NGHIỆM • RÈN ĐỂ TRƯỞNG THÀNH • SỐNG ĐỂ TỬ TẾ
          </h3>
          <p className="text-slate-400 max-w-xl mx-auto leading-relaxed">
            Dự án cổng thông tin và sân chơi số rèn luyện nhân phẩm, giáo dục chuẩn mực pháp luật học sinh hàng đầu của Trường THCS Lê Hồng Phong.
          </p>
          <div className="text-[9px] text-slate-500 font-extrabold tracking-wider uppercase">
            &copy; 2026 TRƯỜNG THCS LÊ HỒNG PHONG • THIẾT KẾ PHÙ HỢP HOÀN TOÀN TRÊN MỌI THIẾT BỊ
          </div>
        </div>
      </footer>
        </>
      )}
    </div>
  );
}
