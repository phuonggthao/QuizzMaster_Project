// src/backend/Model/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username:  { type: String, required: true, unique: true, trim: true },
    password:  { type: String, required: true },
    fullName:  { type: String, default: '' },       // Họ và tên hiển thị
    role: {
        type: String,
        enum: ['User', 'Admin'],
        default: 'User'
    },
    highScore: { type: Number, default: 0 },        // Kỷ lục điểm cao nhất
    level:     { type: Number, default: 1 },        // Cấp độ người chơi
    tierName:  { type: String, default: 'Đồng' }    // Hạng rank hiển thị
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
