import { mongoose } from '../../Api/mongoClient.js';
import User from '../Model/User.js';
import { BaseRepository } from '../Repositories/baseRepository.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const getUserRepo = () => new BaseRepository(User);

export const register = async (req, res) => {
   // if (mongoose.connection.readyState !== 1) {
    //    return res.status(500).json({ message: "Database chưa sẵn sàng, hãy đợi 2 giây!" });
  //  }
    try {
        const { username, password, fullName } = req.body;
        // Chuẩn hóa input: xóa khoảng trắng thừa
        const cleanUsername = username?.trim().toLowerCase();
        
        const userRepo = getUserRepo();
        const existingUser = await userRepo.findOne({ username: cleanUsername });
        
        if (existingUser) {
            return res.status(400).json({ message: "Tên đăng nhập đã tồn tại!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userRepo.create({ 
            username: cleanUsername, 
            password: hashedPassword, 
            fullName,
            role: 'User' // Mặc định là User
        });
        
        res.status(201).json({ message: "Đăng ký thành công", user });
    } catch (error) {
        res.status(500).json({ error: "Lỗi hệ thống: " + error.message });
    }
};

export const login = async (req, res) => {
    console.log("🔥 Đã vào hàm login! Dữ liệu nhận được:", req.body);
    
    try {
        const { username, password } = req.body;

        // 1. Kiểm tra username tồn tại
        const user = await User.findOne({ username: username.toLowerCase() }).select('+password');
        if (!user) {
            return res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu" });
        }

        // 2. So sánh mật khẩu bằng phương thức trong model
        const isMatch = await user.comparePassword(password);
        console.log("DEBUG: Kết quả so sánh mật khẩu:", isMatch);

        if (!isMatch) {
            return res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu" });
        }

        // 3. Tạo JWT Token nếu mật khẩu đúng
        const token = jwt.sign(
            { id: user._id, role: user.role || 'User' }, 
            process.env.JWT_SECRET , 
            { expiresIn: '1d' }
        );
        
        // 4. Chuẩn bị dữ liệu trả về (xóa password)
        const userResponse = user.toObject();
        delete userResponse.password;

        // 5. Phản hồi thành công
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