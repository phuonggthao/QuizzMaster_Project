import {mongoose} from '../../Api/mongoClient.js';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: [true, 'Tên đăng nhập là bắt buộc'], 
        unique: true, 
        trim: true,
        lowercase: true, // Tốt nhất nên lưu username chữ thường để tránh lỗi "User" vs "user"
        index: true
    },
    password: { 
        type: String, 
        required: [true, 'Mật khẩu là bắt buộc'],
        select: false // BẢO MẬT: Mặc định không trả về password khi query user
    },
    fullName: { type: String, default: '' },
    role: {
        type: String,
        enum: ['User', 'Admin'],
        default: 'User'
    },
    highScore: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    tierName: { type: String, default: 'Đồng' },
    avatar: { type: String, default: null }, // URL ảnh đại diện từ Cloudinary
    loginStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastLoginDate: { type: Date, default: null }
}, { 
    timestamps: true 
});

// Hàm helper để so sánh mật khẩu ngay tại model (Best Practice)
userSchema.methods.comparePassword = async function(candidatePassword) {
    // Vì mật khẩu đã bị select: false, chúng ta phải query thêm hoặc dùng middleware
    // Nhưng với cách này, code login của bạn sẽ sạch hơn
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;