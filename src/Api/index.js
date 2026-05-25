// 1. Nhập hàm kết nối từ mongoClient
import { connectDatabase } from './mongoClient';

<<<<<<< Updated upstream
// 2. Kích hoạt kết nối (Chỉ cần 1 lần duy nhất tại đây)
=======
// ⚙️ KHỞI TẠO EXPRESS APP TRƯỚC TIÊN
const app = express();
app.use(express.json()); // Phải đặt TRƯỚC khi đăng ký routes để req.body hoạt động

const router = express.Router();

// Tự động kích hoạt kết nối MongoDB Atlas khi API khởi động
>>>>>>> Stashed changes
connectDatabase();

// 3. Xuất các hàm API để h sử dụng ở Frontend

export const fetchQuizQuestions = async () => {
   //  gọi logic từ backend/Service ở đây
};

<<<<<<< Updated upstream
// Ví dụ: Hàm xử lý đăng nhập cho Thảo/Nhung
export const loginUser = async (credentials) => {
   // Thảo gọi logic từ backend/Controller ở đây
};
=======
        // Gọi service lưu trực tiếp vào Database thông qua Repository
        const newQuestion = await addQuestion({
            gameType,
            questionText,
            imageName,
            options,
            correctAnswer,
            category,
            difficulty,
            pairs,
            rewards
        });

        res.status(201).json({ message: "🎉 Câu hỏi đã được Admin thêm thành công!", data: newQuestion });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ------------------------------------------
// 🏆 HỆ THỐNG ĐIỂM SỐ & BẢNG XẾP HẠNG RANK
// ------------------------------------------
/**
 * API: Gọi lên khi người chơi bấm trả lời SAI hoặc HẾT 10 GIÂY đếm ngược
 */
router.post('/game/game-over', async (req, res) => {
    try {
        const { userId, gameType, correctAnswersCount } = req.body;
        
        if (correctAnswersCount === undefined || !gameType) {
            return res.status(400).json({ message: "Dữ liệu gửi lên bị thiếu trường bắt buộc!" });
        }

        const gameResult = await processGameOver(userId, gameType, correctAnswersCount);
        res.status(200).json(gameResult);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * API: Tải danh sách Top 10 người chơi đứng đầu hệ thống rank
 */
router.get('/game/leaderboard', async (req, res) => {
    try {
        const leaderboardData = await getLeaderboard();
        res.status(200).json(leaderboardData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ------------------------------------------
// ⚙️ KHỞI CHẠY SERVER EXPRESS
// ------------------------------------------

// Đăng ký toàn bộ router VÀO TRƯỚC khi app lắng nghe cổng
app.use('/api', router); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy trên cổng ${PORT}`);
});

export default router;
>>>>>>> Stashed changes
