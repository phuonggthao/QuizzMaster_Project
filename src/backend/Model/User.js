import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String },
  role: { type: String, default: 'student' }, // student hoặc admin
  totalScore: { type: Number, default: 0 },   // Tổng điểm để làm bảng xếp hạng
  avatar: { type: String, default: 'default.png' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', UserSchema);