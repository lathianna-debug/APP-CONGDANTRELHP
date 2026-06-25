import { QuizQuestion, Scenario, Badge, Club, GoodDeed, Quest } from "./types";

export const initialQuizzes: QuizQuestion[] = [
  {
    id: "q1",
    question: "Hành vi ứng xử nào dưới đây thể hiện chuẩn mực đạo đức tốt nhất của học sinh THCS Lê Hồng Phong trên Internet?",
    options: [
      "Nói lời cảm ơn, dùng ngôn từ văn minh và không chia sẻ tin giả.",
      "Sử dụng nick ảo để bình luận ẩn danh bôi nhọ giáo viên và bạn học.",
      "Chỉ sử dụng mạng để thả tim tất cả bài đăng vô thưởng vô phạt.",
      "Hùa theo đám đông bắt nạt hội đồng bạn cùng trường vì bất đồng ý kiến."
    ],
    answer: 0,
    xp: 100
  },
  {
    id: "q2",
    question: "Khi thấy nhóm bạn học lôi kéo chuẩn bị thực hiện một hành vi bạo lực học đường, em nên ứng xử thế nào?",
    options: [
      "Từ chối tham gia, can ngăn ôn hòa và lập tức báo cáo Giáo viên hoặc giám thị.",
      "Hùa theo cổ vũ và quay video đăng tải lên Facebook cá nhân để câu tương tác.",
      "Phớt lờ vì lo ngại ảnh hưởng tới sự an toàn cá nhân và coi như không thấy gì.",
      "Tự mình tổ chức một nhóm phản kháng khác để kéo nhau đi đánh trả thù."
    ],
    answer: 0,
    xp: 120
  },
  {
    id: "q3",
    question: "Luật Trẻ em 2016 quy định quyền lợi quan trọng nào giúp học sinh tự chủ học hỏi và rèn luyện kỹ năng?",
    options: [
      "Quyền được vui chơi, giải trí, tham gia hoạt động văn hóa học hỏi chuẩn mực xã hội.",
      "Quyền được từ chối tuân thủ tất cả nội quy và quy chế rèn luyện của nhà trường.",
      "Quyền bỏ học đi làm tự do trước tuổi quy định để kiếm sống.",
      "Quyền chia sẻ mật khẩu tài khoản và thông tin cá nhân của người khác vô điều kiện."
    ],
    answer: 0,
    xp: 100
  },
  {
    id: "q4",
    question: "Theo Luật An ninh mạng Việt Nam, hành vi nào sau đây bị nghiêm cấm hoàn toàn trên môi trường mạng?",
    options: [
      "Đăng tải thông tin sai sự thật gây hoang mang dư luận, xuyên tạc lịch sử.",
      "Tìm kiếm tư liệu phục vụ học tập môn Giáo dục công dân.",
      "Đăng ký tham gia câu lạc bộ thiện nguyện trực tuyến của trường học.",
      "Nhắn tin trao đổi bài tập nhóm với các bạn trong lớp."
    ],
    answer: 0,
    xp: 150
  }
];

export const initialScenarios: Scenario[] = [
  {
    id: "sc1",
    title: "Phát tán tin giả, bôi nhọ danh dự bạn học trên mạng xã hội",
    category: "Văn minh mạng",
    severity: "Nghiêm trọng",
    ageGroup: "Khối 7-9",
    description: "Một nhóm học sinh lập group chat kín rồi sử dụng phần mềm AI ghép khuôn mặt của bạn học cùng lớp vào các bức ảnh nhạy cảm nhằm trêu chọc và bêu rếu. Bức ảnh này sau đó bị rò rỉ ra các hội nhóm lớn của trường, khiến nạn nhân suy sụp và không muốn đi học.",
    questions: [
      {
        questionText: "Nếu em phát hiện group chat kín này và bức ảnh bị phát tán, hành động đầu tiên khôn ngoan nhất là gì?",
        choices: [
          {
            text: "Chụp lại màn hình bằng chứng, báo ngay cho GVCN hoặc ban Giám hiệu để can thiệp kịp thời và bảo vệ bạn học.",
            feedback: "Chính xác! Lưu trữ bằng chứng số và báo cáo cơ quan có thẩm quyền/thầy cô là cách bảo vệ nạn nhân triệt để và đúng luật nhất.",
            xpChange: 150,
            isBest: true
          },
          {
            text: "Nhảy vào group chat cùng mắng chửi nhóm bắt nạt để bảo vệ lẽ phải.",
            feedback: "Không nên! Tham gia tranh cãi có thể kích động nhóm bắt nạt xóa bằng chứng hoặc quay sang công kích cả em.",
            xpChange: -30,
            isBest: false
          },
          {
            text: "Phớt lờ và thoát group chat vì nghĩ 'chuyện này không liên quan tới mình'.",
            feedback: "Chưa tốt! Sự thờ ơ gián tiếp đồng lõa để hành vi sai trái tiếp tục gây hại đến tâm lý của bạn học.",
            xpChange: -50,
            isBest: false
          },
          {
            text: "Tải bức ảnh về máy rồi gửi cho các bạn khác xem để cùng cảnh giác.",
            feedback: "Rất nguy hiểm! Hành vi này chính là gián tiếp tham gia lan truyền văn hóa phẩm đồi trụy, bôi nhọ người khác và vi phạm Luật An ninh mạng.",
            xpChange: -100,
            isBest: false
          }
        ]
      }
    ]
  },
  {
    id: "sc2",
    title: "Mâu thuẫn nhỏ dẫn đến hẹn đánh nhau sau giờ học",
    category: "An toàn học đường",
    severity: "Cực kỳ nguy hiểm",
    ageGroup: "Khối 6-9",
    description: "Do hiểu lầm một bình luận khen chê trên Zalo, hai bạn học sinh lớp 8A nảy sinh mâu thuẫn lớn và hẹn nhau ra khu vực bãi đất trống sau trường học lúc tan học để 'giải quyết tay đôi'. Nhiều bạn khác biết chuyện nhưng rủ nhau đi xem và chuẩn bị quay video.",
    questions: [
      {
        questionText: "Khi biết tin và chứng kiến đám đông rủ nhau đi xem trận đánh nhau, em sẽ xử lý như thế nào?",
        choices: [
          {
            text: "Lập tức báo cho bác bảo vệ trường, GV chủ nhiệm hoặc thầy Tổng phụ trách Đội để ngăn chặn vụ việc ngay lập tức.",
            feedback: "Tuyệt vời! Ngăn chặn một vụ ẩu đả giúp tránh được những tổn thương nghiêm trọng về thể xác và kỷ luật cho cả hai bên.",
            xpChange: 150,
            isBest: true
          },
          {
            text: "Đi theo để làm trọng tài, đảm bảo hai bạn chỉ đánh nhau ôn hòa không dùng hung khí.",
            feedback: "Không đúng! Ẩu đả bạo lực không bao giờ được phép xảy ra dưới mọi hình thức, việc làm trọng tài chỉ gián tiếp cổ vũ bạo lực.",
            xpChange: -40,
            isBest: false
          },
          {
            text: "Mang điện thoại đi theo chọn góc đẹp để quay video sắc nét làm bằng chứng.",
            feedback: "Sai lầm! Quay phim phát tán bạo lực học đường vi phạm quy chế học sinh và lan truyền bạo lực.",
            xpChange: -80,
            isBest: false
          },
          {
            text: "Tránh xa và khuyên các bạn khác cũng về nhà ngay không liên lụy.",
            feedback: "Được một phần, nhưng chưa đủ. Em cần báo thầy cô để ngăn chặn bạo lực xảy ra chứ không chỉ tránh né.",
            xpChange: 20,
            isBest: false
          }
        ]
      }
    ]
  },
  {
    id: "sc3",
    title: "Tự ý sử dụng thiết bị và tài khoản người khác",
    category: "Bản quyền & Bảo mật số",
    severity: "Bình thường",
    ageGroup: "Khối 6-8",
    description: "Trong giờ thực hành tin học, bạn Nam quên đăng xuất tài khoản Gmail và Facebook cá nhân trên máy tính trường. Bạn Minh ngồi sau phát hiện ra, định đổi mật khẩu hoặc đăng vài status đùa vui lên trang cá nhân của Nam.",
    questions: [
      {
        questionText: "Nếu em là một người bạn ngồi kế bên chứng kiến hành động của Minh, em sẽ khuyên Minh thế nào?",
        choices: [
          {
            text: "Khuyên Minh dừng lại, đăng xuất hộ Nam và nhắc nhở Nam lần sau chú ý bảo mật tài khoản cá nhân.",
            feedback: "Rất tốt! Tôn trọng quyền riêng tư và thông tin số của người khác là bài học đạo đức mạng cơ bản nhưng vô cùng giá trị.",
            xpChange: 120,
            isBest: true
          },
          {
            text: "Cổ vũ Minh viết status thật hài hước để trêu Nam một chút rồi đăng xuất sau.",
            feedback: "Không nên! Sử dụng tài khoản người khác không xin phép là xâm phạm quyền riêng tư, có thể gây ra những hiểu lầm không đáng có.",
            xpChange: -30,
            isBest: false
          },
          {
            text: "Tự ý lấy mật khẩu để vào đọc trộm tin nhắn riêng tư của Nam xem có bí mật gì không.",
            feedback: "Rất xấu! Hành vi này vi phạm nghiêm trọng chuẩn mực ứng xử văn minh và đạo đức của học sinh LHP.",
            xpChange: -90,
            isBest: false
          }
        ]
      }
    ]
  }
];

export const initialClubs: Club[] = [
  {
    name: "CLB Công dân số Lê Hồng Phong",
    icon: "laptop",
    color: "indigo",
    description: "Tập trung hướng dẫn học sinh ứng xử văn minh, lịch thiệp trên mạng xã hội Facebook, TikTok, phòng chống lừa đảo mạng và bảo mật an toàn thông tin số cá nhân.",
    membersCount: 120,
    weeklyGoal: "Chiến dịch: Lan tỏa 100 lời chúc tử tế trong các nhóm Zalo lớp học"
  },
  {
    name: "CLB Pháp luật trẻ măng",
    icon: "scale",
    color: "pink",
    description: "Nơi tụ họp các bạn yêu thích tìm hiểu Hiến pháp nước CHXHCN Việt Nam, Luật Trẻ em, Luật An ninh mạng thông qua các phiên tòa giả định sinh động.",
    membersCount: 85,
    weeklyGoal: "Dựng hoạt cảnh sân khấu hóa: Phòng chống xâm hại và bảo vệ quyền trẻ em"
  },
  {
    name: "CLB Đại sứ xanh học đường",
    icon: "sprout",
    color: "emerald",
    description: "Sân chơi cho các chiến binh bảo vệ môi trường, thực hiện phân loại rác thải tại nguồn, giảm thiểu túi nilon, rác nhựa ở căng tin trường Lê Hồng Phong.",
    membersCount: 142,
    weeklyGoal: "Thu gom 50kg giấy vụn và pin cũ để đổi chậu cây xanh nhỏ xinh"
  },
  {
    name: "CLB Phát triển kỹ năng mềm",
    icon: "users-round",
    color: "amber",
    description: "Giúp học sinh rèn luyện kỹ năng tự chủ, làm chủ cảm xúc, quản lý thời gian khoa học, kỹ năng giao tiếp thuyết trình trước đám đông.",
    membersCount: 96,
    weeklyGoal: "Thực hành bài tập: Lắng nghe chủ động và giải quyết xung đột bằng hòa bình"
  }
];

export const initialBadges: Badge[] = [
  {
    id: "b1",
    title: "Sao chăm ngoan",
    icon: "star",
    description: "Dành cho học sinh bắt đầu rèn luyện và hoàn thành tối thiểu 3 nhiệm vụ hằng ngày.",
    criteria: "Hoàn thành 3 nhiệm vụ rèn luyện."
  },
  {
    id: "b2",
    title: "Hiệp sĩ xanh",
    icon: "shield",
    description: "Tôn vinh hành động bảo vệ môi trường lớp học, dọn dẹp sân trường hoặc trồng cây xanh.",
    criteria: "Chăm sóc cây đạo đức đạt cấp độ rèn luyện 2."
  },
  {
    id: "b3",
    title: "Công dân số văn minh",
    icon: "laptop",
    description: "Được trao tặng khi học sinh hoàn thành các tình huống ứng xử trực tuyến và trò chuyện thông thái với AI.",
    criteria: "Tương tác hỏi đáp học tập với Trợ lý AI."
  },
  {
    id: "b4",
    title: "Nhà thông thái luật pháp",
    icon: "graduation-cap",
    description: "Chứng minh học sinh am hiểu sâu sắc về Luật trẻ em, Luật An ninh mạng và các chuẩn mực đạo đức.",
    criteria: "Đạt điểm tuyệt đối trong trò chơi Rung chuông vàng."
  }
];

export const initialQuests: Quest[] = [
  {
    id: "q_daily_1",
    title: "Nói lời cảm ơn bạn học khi được chia sẻ bài tập hoặc giúp đỡ",
    category: "Đạo đức",
    xp: 50,
    completed: true,
  },
  {
    id: "q_daily_2",
    title: "Đọc & Xử lý tình huống về phòng chống bắt nạt trên mạng xã hội",
    category: "Pháp luật",
    xp: 100,
    completed: false,
    description: "Vào mục Kho tình huống, chọn và giải quyết tốt nhất 1 tình huống."
  },
  {
    id: "q_daily_3",
    title: "Giúp đỡ phụ huynh dọn dẹp nhà cửa chuẩn bị cuối tuần",
    category: "Kỹ năng",
    xp: 70,
    completed: false,
  },
];

export const initialGoodDeeds: GoodDeed[] = [
  {
    id: "gd1",
    studentName: "Nguyễn Linh",
    studentClass: "8A1",
    category: "Đạo đức",
    description: "Nhặt được chiếc ví đựng tiền học phí của bạn học sinh khối 6 rơi ở hành lang và nộp lại ngay cho phòng Đoàn Đội để trả lại cho bạn.",
    timestamp: "2026-06-24 14:30",
    status: "Đã duyệt",
    xpAwarded: 50
  },
  {
    id: "gd2",
    studentName: "Trần Minh Anh",
    studentClass: "7A5",
    category: "Văn minh",
    description: "Hỗ trợ bạn Lan nhặt lại hộp bút rơi ở lớp và chủ động giảng lại bài toán khó cho bạn hiểu.",
    timestamp: "2026-06-24 16:15",
    status: "Đã duyệt",
    xpAwarded: 40
  },
  {
    id: "gd3",
    studentName: "Lê Hoàng Kiên",
    studentClass: "9B2",
    category: "Kỹ năng",
    description: "Tự mang bình nước cá nhân đi học để giảm tiêu thụ chai nhựa và thu gom pin cũ mang nộp cho CLB Đại sứ xanh.",
    timestamp: "2026-06-24 09:10",
    status: "Đã duyệt",
    xpAwarded: 40
  }
];
