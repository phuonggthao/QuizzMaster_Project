import mongoose from 'mongoose';

<<<<<<< Updated upstream
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String },
  role: { type: String, default: 'student' }, // student hoặc admin
  totalScore: { type: Number, default: 0 },   // Tổng điểm để làm bảng xếp hạng
  avatar: { type: String, default: 'default.png' },
  createdAt: { type: Date, default: Date.now }
});
=======
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    fullName: { type: String, default: '' },        // Họ và tên hiển thị
    role: { 
        type: String, 
        enum: ['User', 'Admin'], 
        default: 'User' // Mặc định tài khoản đăng ký mới sẽ là Người chơi (User)
    },
    highScore: { type: Number, default: 0 },        // Kỷ lục điểm cao nhất
    level: { type: Number, default: 1 },            // Cấp độ người chơi
    tierName: { type: String, default: 'Đồng' }     // Hạng rank hiển thị
}, { timestamps: true });
>>>>>>> Stashed changes

export default mongoose.model('User', UserSchema);