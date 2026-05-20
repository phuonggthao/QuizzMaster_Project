import mongoose from 'mongoose';

const GameConfigSchema = new mongoose.Schema({
    gameType: { type: String, required: true, unique: true },
    basePoints: { type: Number, default: 10 },       // Điểm chuẩn nhận được cho mỗi câu đúng
    bonusMultiplier: { type: Number, default: 1.5 },  // Hệ số nhân điểm khi trả lời cực nhanh
    minLevelRequired: { type: Number, default: 1 }    // Yêu cầu cấp độ tối thiểu của User để mở khóa game
}, {
    collection: 'gameconfigs' // Ép chuẩn đồng bộ vào bảng tên 'gameconfigs' viết thường
});

export default mongoose.model('GameConfig', GameConfigSchema);