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