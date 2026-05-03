import mongoose from 'mongoose';

const ScoreSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  gameType: { type: String, required: true },
  points: { type: Number, required: true },
  accuracy: { type: Number },                 // Tỷ lệ % đúng
  timeSpent: { type: Number },                // Thời gian hoàn thành (giây)
  playedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Score', ScoreSchema);