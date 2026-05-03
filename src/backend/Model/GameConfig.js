import mongoose from 'mongoose';

const GameConfigSchema = new mongoose.Schema({
  gameType: { type: String, required: true, unique: true },
  basePoints: { type: Number, default: 10 },  // Điểm chuẩn mỗi câu
  bonusMultiplier: { type: Number, default: 1.5 }, // Nhân điểm nếu trả lời nhanh
  minLevelRequired: { type: Number, default: 1 }   // Cấp độ tối thiểu để chơi
});

export default mongoose.model('GameConfig', GameConfigSchema);