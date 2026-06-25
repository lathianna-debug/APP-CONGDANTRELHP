import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry user-agent
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
} else {
  console.warn("WARNING: GEMINI_API_KEY is not defined. AI Assistant will fall back to local responses.");
}

// API: Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// API: Chat with AI Assistant
app.post("/api/gemini/chat", async (req, res) => {
  const { messages, systemInstruction } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid request payload. 'messages' array is required." });
  }

  // Fallback if API key is not configured
  if (!ai) {
    const lastMessage = messages[messages.length - 1]?.content || "";
    const responseText = getLocalFallbackResponse(lastMessage);
    return res.json({ text: responseText, source: "local-fallback" });
  }

  try {
    // Format conversation history for @google/genai chats
    // The chats.create accepts contents. But here we can simply send the generateContent request
    // containing the structured message payload, or use chats.create.
    // Let's format history to parts or pass simple contents.
    // Let's map messages into GoogleGenAI standard parts.
    const formattedContents = messages.map(msg => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction: systemInstruction || "Bạn là Trợ lý AI giáo dục đạo đức trường THCS Lê Hồng Phong. Hãy trả lời cực kỳ tinh tế, khôn ngoan, truyền cảm hứng rèn luyện việc tốt và sống văn minh cho học sinh THCS. Sử dụng các icon bắt mắt và thân mật.",
        temperature: 1,
      }
    });

    const replyText = response.text || "Xin lỗi, mình không tìm thấy câu trả lời.";
    return res.json({ text: replyText, source: "gemini" });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    // Return graceful fallback message
    const lastMessage = messages[messages.length - 1]?.content || "";
    const responseText = getLocalFallbackResponse(lastMessage);
    return res.json({ 
      text: `[Lưu ý: Đã xảy ra lỗi khi kết nối với máy chủ AI (${error.message || "Unknown error"}). Dưới đây là phản hồi hỗ trợ dự phòng]\n\n${responseText}`, 
      source: "local-fallback" 
    });
  }
});

// Helper for local offline mock responses if AI is not configured or fails
function getLocalFallbackResponse(query: string): string {
  const q = query.toLowerCase();
  if (q.includes("bắt nạt") || q.includes("bạo lực") || q.includes("đánh nhau")) {
    return `Chào bạn! 🛑 Khi chứng kiến hoặc gặp phải hành vi bạo lực/bắt nạt học đường:
1. **Giữ an toàn đầu tiên**: Tránh xa khu vực căng thẳng, tuyệt đối không hùa theo cổ vũ hoặc livestream kích động.
2. **Báo cáo ngay**: Gửi tin nhắn hoặc gặp trực tiếp Giáo viên chủ nhiệm, thầy cô Giám thị hoặc thầy Hiệu trưởng.
3. **Đồng hành và hỗ trợ**: Động viên bạn bị bắt nạt, khuyên nhủ nhẹ nhàng và cùng xây dựng môi trường học đường lành mạnh Lê Hồng Phong nhé! 🌱`;
  }
  
  if (q.includes("mạng") || q.includes("facebook") || q.includes("tiktok") || q.includes("chia sẻ") || q.includes("tin giả")) {
    return `Chào bạn! 🌐 Sống văn minh trên môi trường mạng xã hội là kỹ năng cực kỳ quan trọng đối với thế hệ học sinh Lê Hồng Phong mới:
- **Tôn trọng người khác**: Không bình luận xúc phạm, nói tục, chửi thề hay lập hội bêu xấu bạn học.
- **Sống có kiểm chứng**: Không chia sẻ tin đồn thất thiệt, thông tin nhạy cảm chưa xác thực.
- **Bảo mật bản thân**: Không đăng số điện thoại, mật khẩu hoặc địa chỉ nhà riêng lên mạng xã hội. 🔒`;
  }

  if (q.includes("môi trường") || q.includes("rác") || q.includes("cây xanh") || q.includes("nước")) {
    return `Chào bạn! 🌳 Bảo vệ môi trường lớp học và khuôn viên trường THCS Lê Hồng Phong là trách nhiệm chung của chúng mình:
- **Phân loại rác**: Vứt rác đúng nơi quy định, phân biệt rác tái chế và rác hữu cơ.
- **Tiết kiệm tài nguyên**: Tắt quạt, tắt điện khi ra khỏi phòng học; khóa chặt vòi nước sau khi rửa tay.
- **Xanh hóa**: Chăm sóc cây năng lượng của bạn trên ứng dụng và cùng lớp chăm chút bồn hoa học đường nhé! 🌸`;
  }

  if (q.includes("áp lực") || q.includes("thi cử") || q.includes("stress") || q.includes("học tập")) {
    return `Chào bạn học Lê Hồng Phong! 📚 Áp lực học tập và thi cử là điều ai cũng từng trải qua. Hãy để mình gợi ý cho bạn vài cách giải tỏa nhé:
1. **Lập thời gian biểu khoa học**: Phân chia thời gian học và nghỉ ngơi hợp lý. Tránh học dồn dập vào đêm trước ngày thi.
2. **Chia sẻ và tâm sự**: Hãy trò chuyện với thầy cô, cha mẹ hoặc người bạn thân thiết nhất để giải tỏa cảm xúc.
3. **Thực hành thở sâu**: Khi thấy căng thẳng, hãy nhắm mắt lại và hít thở sâu trong 3 phút nhé! Bạn đang làm rất tốt rồi! 💪`;
  }

  return `Chào bạn học sinh THCS Lê Hồng Phong! 🌟 Đây là một câu hỏi rất hay về việc tự rèn luyện bản thân và xây dựng phong cách sống tích cực. 

Để trở thành một Công dân trẻ văn minh, hãy luôn ghi nhớ:
- **Hiểu pháp luật**: Tôn trọng và chấp hành luật pháp Việt Nam cùng nội quy nhà trường.
- **Sống đạo đức**: Luôn biết sẻ chia, biết ơn và làm việc thiện giúp đỡ cộng đồng.
- **Rèn kỹ năng**: Làm chủ cảm xúc, tự giác học tập và thích ứng an toàn.

Chúc bạn một ngày rèn luyện ngập tràn niềm vui và nhận thật nhiều điểm rèn luyện (XP) nhé!`;
}

// Vite Server integration
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

// Only start the standalone Express/Vite server if not running on Vercel
if (!process.env.VERCEL) {
  start();
}

export default app;
