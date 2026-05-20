// src/backend/Model/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['User', 'Admin'], 
        default: 'User' // Mặc định tài khoản đăng ký mới sẽ là Người chơi (User)
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;