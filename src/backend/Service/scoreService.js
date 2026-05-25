import User from '../Model/User.js';
import Score from '../Model/Score.js';
import { BaseRepository } from '../Repositories/baseRepository.js';

const userRepo = new BaseRepository(User);
const scoreRepo = new BaseRepository(Score);

/**
 * Xử lý tính điểm, kiểm tra kỷ lục cá nhân và thăng cấp khi lượt đấu kết thúc
 */
export const processGameOver = async (userId, gameType, correctAnswersCount) => {
    try {
        // Theo kịch bản của Thảo: mỗi câu trả lời đúng được cộng 2 điểm
        const totalScoreThisTurn = correctAnswersCount * 2;

        // 1. Nếu người chơi chọn chơi ẩn danh không cần tài khoản
        if (!userId) {
            return {
                status: "success",
                message: "Lượt chơi hoàn thành (Tài khoản Khách)",
                score: totalScoreThisTurn,
                isNewRecord: false,
                highScore: totalScoreThisTurn,
                level: 1 // Tài khoản khách mặc định level 1
            };
        }

        // 2. Nếu là người chơi đã đăng nhập hệ thống
        const user = await userRepo.findOne({ _id: userId });
        if (!user) {
            throw new Error("Không tồn tại tài khoản người chơi này!");
        }

        let isNewRecord = false;

        // Đảm bảo các thuộc tính này luôn có giá trị mặc định để không bị undefined ở hàm trả về
        if (user.highScore === undefined) user.highScore = 0;
        if (user.level === undefined) user.level = 1;

        // So sánh điểm lượt chơi hiện tại với kỷ lục cá nhân cũ
        if (totalScoreThisTurn > user.highScore) {
            user.highScore = totalScoreThisTurn;
            // Công thức thăng cấp tự động dựa theo điểm số kỷ lục
            user.level = Math.floor(user.highScore / 20) + 1;
            
            // Tiến hành cập nhật trực tiếp vào cơ sở dữ liệu qua BaseRepository
            await userRepo.update(user._id, {
                highScore: user.highScore,
                level: user.level
            });
            isNewRecord = true;
        }

        // Đồng bộ hóa: Dùng scoreRepo thay vì gọi trực tiếp Model Score để chuẩn Repository Pattern
        await scoreRepo.create({
            userId: user._id,
            gameType: gameType,
            points: totalScoreThisTurn,
            playedAt: new Date()
        });

        return {
            status: "success",
            message: isNewRecord ? "🎉 Tuyệt vời! Bạn đã phá kỷ lục điểm số cao nhất!" : "Lượt chơi kết thúc!",
            score: totalScoreThisTurn,
            isNewRecord: isNewRecord,
            highScore: user.highScore,
            level: user.level
        };

    } catch (error) {
        throw new Error("Lỗi trong quá trình xử lý lưu điểm: " + error.message);
    }
};

/**
 * Lấy Top 10 bảng xếp hạng người chơi có điểm kỷ lục cao nhất toàn hệ thống
 */
export const getLeaderboard = async () => {
    try {
        // Chỉ lấy những tài khoản có role là 'User', sắp xếp giảm dần theo điểm và giới hạn lấy 10 người
        return await User.find({ role: 'User' })
            .sort({ highScore: -1 })
            .limit(10)
            .select('fullName username highScore level');
    } catch (error) {
        throw new Error("Lỗi tải bảng xếp hạng: " + error.message);
    }
};