import User from '../Model/User.js';
import Score from '../Model/Score.js';

/**
 * FIX #4: Nhận điểm thực từ frontend (score) thay vì tự tính lại
 * Frontend tính: 10đ/câu + combo bonus + double points
 * Backend chỉ cần lưu và cập nhật highScore
 */
export const processGameOver = async (username, gameType, correctAnswersCount, score) => {
    try {
        // Nếu frontend truyền score thực thì dùng, không thì fallback tính đơn giản
        const finalScore = (score !== undefined && score !== null) ? score : correctAnswersCount * 10;

        const user = await User.findOne({ username });
        const oldHighScore = user ? user.highScore : 0;

        const newHighScore = Math.max(finalScore, oldHighScore);
        const newLevel = Math.floor(newHighScore / 20) + 1;
        const newTierName = getTierName(newHighScore);

        const updatedUser = await User.findOneAndUpdate(
            { username },
            {
                $setOnInsert: { role: 'User' },
                $max: { highScore: finalScore },
                $set: { level: newLevel, tierName: newTierName }
            },
            { upsert: true, new: true }
        );

        // Tính accuracy nếu có correctAnswersCount
        const accuracy = correctAnswersCount > 0
            ? Math.round((correctAnswersCount / 10) * 100)
            : null;

        await Score.create({
            username,
            gameType,
            points: finalScore,
            accuracy,
            playedAt: new Date()
        });

        return {
            status: "success",
            score: finalScore,
            isNewRecord: finalScore > oldHighScore,
            highScore: updatedUser.highScore,
            level: updatedUser.level,
            tierName: updatedUser.tierName,
        };
    } catch (error) {
        console.error("❌ Lỗi tại processGameOver:", error);
        throw error;
    }
};

// Helper: tính tier dựa trên highScore
function getTierName(highScore) {
    if (highScore >= 500) return 'Kim Cương';
    if (highScore >= 300) return 'Vàng';
    if (highScore >= 150) return 'Bạc';
    return 'Đồng';
}

export const getGlobalLeaderboard = async () => {
    try {
        return await User.find({ role: 'User', highScore: { $gt: 0 } })
            .sort({ highScore: -1 })
            .limit(10)
            .select('username fullName highScore level tierName')
            .lean();
    } catch (error) {
        console.error("❌ Lỗi lấy bảng xếp hạng:", error);
        throw error;
    }
};

/**
 * Lấy lịch sử chơi gần đây của một user (10 lượt gần nhất)
 */
export const getUserHistory = async (username) => {
    try {
        return await Score.find({ username })
            .sort({ playedAt: -1 })
            .limit(10)
            .select('gameType points accuracy playedAt')
            .lean();
    } catch (error) {
        throw new Error("Lỗi tải lịch sử chơi: " + error.message);
    }
};

/**
 * Lấy thống kê tổng hợp của một user
 */
export const getUserStats = async (username) => {
    try {
        const result = await Score.aggregate([
            { $match: { username } },
            {
                $group: {
                    _id: null,
                    totalPlays: { $sum: 1 },
                    totalPoints: { $sum: '$points' }
                }
            }
        ]);
        if (result.length === 0) {
            return { totalPlays: 0, totalPoints: 0 };
        }
        return {
            totalPlays: result[0].totalPlays || 0,
            totalPoints: result[0].totalPoints || 0
        };
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

        const recentPlays = await Score.find()
            .sort({ playedAt: -1 })
            .limit(10)
            .select('gameType points playedAt username')
            .lean();

        // Lấy danh sách username duy nhất trong 10 lượt chơi gần nhất
        const usernames = [...new Set(recentPlays.map(p => p.username).filter(Boolean))];

        // Tìm thông tin full name của các users tương ứng
        const users = await User.find({ username: { $in: usernames } })
            .select('username fullName')
            .lean();

        // Tạo map để tra cứu thông tin nhanh chóng
        const userMap = {};
        users.forEach(u => {
            userMap[u.username] = u.fullName || u.username;
        });

        // Ánh xạ lại cấu trúc recentPlays để giữ tương thích ngược hoàn hảo với property play.userId của frontend
        const recentWithUser = recentPlays.map(play => ({
            ...play,
            userId: {
                username: play.username,
                fullName: userMap[play.username] || play.username
            }
        }));

        return { totalPlays, totalUsers, avgScore, recentPlays: recentWithUser };
    } catch (error) {
        throw new Error("Lỗi tải báo cáo: " + error.message);
    }
};
