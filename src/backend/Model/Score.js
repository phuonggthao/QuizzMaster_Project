import mongoose from 'mongoose';

const ScoreSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    gameType: { type: String, required: true },
    points: { type: Number, required: true },
    accuracy: { type: Number },                 // Tỷ lệ % trả lời đúng trong lượt chơi
    timeSpent: { type: Number },                // Tổng thời gian hoàn thành lượt chơi (giây)
    playedAt: { type: Date, default: Date.now }
}, {
    collection: 'scores' // Ép chuẩn đồng bộ vào bảng tên 'scores' viết thường
});

export default mongoose.model('Score', ScoreSchema);