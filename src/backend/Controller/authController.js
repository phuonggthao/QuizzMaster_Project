import { mongoose } from '../../Api/mongoClient.js';
import User from '../Model/User.js';
import { BaseRepository } from '../Repositories/baseRepository.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const getUserRepo = () => new BaseRepository(User);

export const register = async (req, res) => {
    try {
        const { username, password, fullName } = req.body;

        // 1. Kiểm tra đầu vào hợp lệ
        if (!username || !password || !fullName) {
            return res.status(400).json({ message: "Vui lòng nhập đầy đủ họ tên, tên đăng nhập và mật khẩu!" });
        }

        const cleanUsername = username.trim().toLowerCase();
        if (cleanUsername.length < 3) {
            return res.status(400).json({ message: "Tên đăng nhập phải có ít nhất 3 ký tự!" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Mật khẩu phải có ít nhất 6 ký tự!" });
        }
        
        const userRepo = getUserRepo();
        const existingUser = await userRepo.findOne({ username: cleanUsername });
        
        if (existingUser) {
            return res.status(400).json({ message: "Tên đăng nhập đã tồn tại!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userRepo.create({ 
            username: cleanUsername, 
            password: hashedPassword, 
            fullName: fullName.trim(),
            role: 'User' // Mặc định là User
        });
        
        // 2. Bảo mật: Ẩn mật khẩu khi trả về client
        const userResponse = { ...user };
        delete userResponse.password;

        res.status(201).json({ message: "Đăng ký thành công", user: userResponse });
    } catch (error) {
        res.status(500).json({ error: "Lỗi hệ thống: " + error.message });
    }
};

export const login = async (req, res) => {
    console.log("🔥 Đã vào hàm login! Dữ liệu nhận được:", req.body);
    
    try {
        const { username, password } = req.body;

        // 1. Kiểm tra đầu vào hợp lệ
        if (!username || !password) {
            return res.status(400).json({ message: "Vui lòng nhập tài khoản và mật khẩu!" });
        }

        // 2. Kiểm tra username tồn tại
        const user = await User.findOne({ username: username.trim().toLowerCase() }).select('+password');
        if (!user) {
            return res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu" });
        }

        // 2. So sánh mật khẩu bằng phương thức trong model
        const isMatch = await user.comparePassword(password);
        console.log("DEBUG: Kết quả so sánh mật khẩu:", isMatch);

        if (!isMatch) {
            return res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu" });
        }

        // 3. Tính login streak
        const now = new Date();
        const todayStr = now.toISOString().slice(0, 10); // "YYYY-MM-DD"
        const lastLogin = user.lastLoginDate;
        const lastLoginStr = lastLogin ? lastLogin.toISOString().slice(0, 10) : null;

        let newStreak = user.loginStreak || 0;

        if (lastLoginStr === null) {
            // Lần đầu đăng nhập
            newStreak = 1;
        } else if (lastLoginStr === todayStr) {
            // Đã đăng nhập hôm nay rồi, giữ nguyên streak
            newStreak = user.loginStreak || 1;
        } else {
            // Kiểm tra hôm qua
            const yesterday = new Date(now);
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().slice(0, 10);

            if (lastLoginStr === yesterdayStr) {
                // Đăng nhập liên tiếp — tăng streak
                newStreak = (user.loginStreak || 0) + 1;
            } else {
                // Bỏ lỡ ít nhất 1 ngày — reset streak
                newStreak = 1;
            }
        }

        const newLongest = Math.max(newStreak, user.longestStreak || 0);

        // Chỉ cập nhật DB nếu có thay đổi
        if (lastLoginStr !== todayStr) {
            await User.findByIdAndUpdate(user._id, {
                loginStreak: newStreak,
                longestStreak: newLongest,
                lastLoginDate: now,
            });
        }

        // 4. Tạo JWT Token nếu mật khẩu đúng
        const token = jwt.sign(
            { id: user._id, role: user.role || 'User' }, 
            process.env.JWT_SECRET , 
            { expiresIn: '1d' }
        );
        
        // 5. Chuẩn bị dữ liệu trả về (xóa password)
        const userResponse = user.toObject();
        delete userResponse.password;
        userResponse.loginStreak = newStreak;
        userResponse.longestStreak = newLongest;
        userResponse.lastLoginDate = now;

        // 6. Phản hồi thành công
        return res.status(200).json({ 
            message: "Đăng nhập thành công", 
            token, 
            user: userResponse 
        });

    } catch (error) {
        console.error("❌ Lỗi login:", error); 
        return res.status(500).json({ error: "Lỗi server: " + error.message });
    }
};

export const getMe = async (req, res) => {
    try {
        // req.user.id được lấy từ verifyToken middleware
        const user = await User.findById(req.user.id).exec();
        if (!user) return res.status(404).json({ message: "Không tìm thấy user!" });
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};