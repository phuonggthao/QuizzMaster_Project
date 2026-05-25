import User from '../Model/User.js';
import { BaseRepository } from '../Repositories/baseRepository.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userRepo = new BaseRepository(User);

// 1. Hàm Đăng Ký (Chỉ xuất hiện 1 lần duy nhất)
export const register = async (req, res) => {
    try {
        const { username, password, fullName } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userRepo.create({ username, password: hashedPassword, fullName });
        res.status(201).json({ message: "Đăng ký thành công", user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Hàm Đăng Nhập
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await userRepo.findOne({ username });
        
        if (user && await bcrypt.compare(password, user.password)) {
            // TẠO TOKEN Ở ĐÂY
            const token = jwt.sign(
                { id: user._id, role: user.role }, 
                process.env.JWT_SECRET || 'SECRET_KEY_MAC_DINH',
                { expiresIn: '1d' }
            );
            // Trả về cả token và user
            res.json({ message: "Đăng nhập thành công", token, user });
        } else {
            res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Hàm lấy thông tin Hồ sơ cá nhân (Dùng hàm findOne chuẩn của Thảo)
export const getMe = async (req, res) => {
    try {
        // req.user được tạo ra sau khi đi qua kiểm tra verifyToken
        const user = await userRepo.findOne({ _id: req.user.id });
        
        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy thông tin tài khoản người dùng!" });
        }
        
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};