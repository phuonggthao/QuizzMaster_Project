import User from '../Model/User.js';
import { BaseRepository } from '../Repositories/baseRepository.js';
import bcrypt from 'bcryptjs';

const userRepo = new BaseRepository(User);

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

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await userRepo.findOne({ username });
        if (user && await bcrypt.compare(password, user.password)) {
            res.json({ message: "Đăng nhập thành công", user });
        } else {
            res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};