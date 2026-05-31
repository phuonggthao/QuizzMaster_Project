import User from '../Model/User.js';
import Score from '../Model/Score.js';

export const processGameOver = async (username, gameType, correctAnswersCount) => {
    try {
        const totalScoreThisTurn = correctAnswersCount * 2;

        // Tối ưu: Gộp tìm/tạo và cập nhật điểm vào 1 câu lệnh duy nhất
        // Chúng ta lấy user trước khi update để so sánh kỷ lục
        const user = await User.findOne({ username });
        const oldHighScore = user ? user.highScore : 0;

        // Cập nhật User với toán tử $max để đảm bảo highScore luôn là cao nhất
        const updatedUser = await User.findOneAndUpdate(
            { username },
            { 
                $setOnInsert: { role: 'User', level: 1 },
                $max: { highScore: totalScoreThisTurn },
                // Cập nhật level dựa trên điểm cao nhất (tính toán dựa trên điểm mới hoặc cũ)
                $set: { level: Math.floor(Math.max(totalScoreThisTurn, oldHighScore) / 20) + 1 }
            },
            { upsert: true, new: true }
        );

        // Tạo lịch sử chơi
        await Score.create({
            username,
            gameType,
            points: totalScoreThisTurn,
            playedAt: new Date()
        });

        return {
            status: "success",
            score: totalScoreThisTurn,
            isNewRecord: totalScoreThisTurn > oldHighScore,
            highScore: updatedUser.highScore,
            level: updatedUser.level
        };
    } catch (error) {
        console.error("❌ Lỗi tại processGameOver:", error);
        throw error;
    }
};

export const getGlobalLeaderboard = async () => {
    try {
        return await User.find({ role: 'User', highScore: { $gt: 0 } })
            .sort({ highScore: -1 })
            .limit(10)
            .select('username highScore level -_id') // Bỏ _id cho gọn
            .lean(); 
    } catch (error) {
        console.error("❌ Lỗi lấy bảng xếp hạng:", error);
        throw error;
    }
};

/**
 * Lấy lịch sử chơi gần đây của một user (10 lượt gần nhất)
 * username là string (không phải ObjectId)
 */
export const getUserHistory = async (username) => {
    try {
        const history = await Score.find({ username })
            .sort({ playedAt: -1 })
            .limit(10)
            .select('gameType points accuracy playedAt');
        return history;
    } catch (error) {
        throw new Error("Lỗi tải lịch sử chơi: " + error.message);
    }
};

/**
 * Lấy thống kê tổng hợp của một user
 */
export const getUserStats = async (username) => {
    try {
        const scores = await Score.find({ username });
        const totalPlays = scores.length;
        const totalPoints = scores.reduce((sum, s) => sum + (s.points || 0), 0);
        return { totalPlays, totalPoints };
    } catch (error) {
        throw new Error("Lỗi tải thống kê user: " + error.message);
    }
};

/**
 * Lấy thống kê tổng hợp cho trang Report (Admin)
 */
export const getReportStats = async () => {
    try {
        const totalPlays = await Score.countDocuments();
        const totalUsers = await User.countDocuments({ role: 'User' });
        const allScores = await Score.find().select('points');
        const totalPoints = allScores.reduce((sum, s) => sum + (s.points || 0), 0);
        const avgScore = totalPlays > 0 ? Math.round(totalPoints / totalPlays) : 0;

        // Lịch sử 10 lượt gần nhất (gộp tất cả user)
        const recentPlays = await Score.find()
            .sort({ playedAt: -1 })
            .limit(10)
            .select('gameType points playedAt username');

        return { totalPlays, totalUsers, avgScore, recentPlays };
    } catch (error) {
        throw new Error("Lỗi tải báo cáo: " + error.message);
    }
};