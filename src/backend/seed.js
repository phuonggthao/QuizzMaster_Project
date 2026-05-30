import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Question from './Model/Question.js';
import Category from './Model/Category.js';
import GameConfig from './Model/GameConfig.js';
import User from './Model/User.js';
import { connectDatabase } from '../Api/mongoClient.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Nạp cấu hình file .env từ thư mục gốc QuizzMaster_Project
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const sampleCategories = [
    { name: "Toán Học", description: "Các câu hỏi logic, tính toán nhanh", icon: "calculator", status: true },
    { name: "Tiếng Anh", description: "Rèn luyện từ vựng và ngữ pháp", icon: "language", status: true },
    { name: "Khoa Học", description: "Khám phá thế giới tự nhiên", icon: "flask", status: true },
    { name: "Logic", description: "Thử thách tư duy nhạy bén", icon: "brain", status: true }
];

const sampleGameConfigs = [
    { gameType: "Quiz", basePoints: 10, bonusMultiplier: 1.5, minLevelRequired: 1 },
    { gameType: "MatchingPairs", basePoints: 10, bonusMultiplier: 1.5, minLevelRequired: 1 },
    { gameType: "LuckyNumber", basePoints: 10, bonusMultiplier: 1.0, minLevelRequired: 1 },
    { gameType: "FlashCards", basePoints: 10, bonusMultiplier: 1.2, minLevelRequired: 1 },
    { gameType: "WordScramble", basePoints: 10, bonusMultiplier: 1.5, minLevelRequired: 1 },
    { gameType: "OpenTheBox", basePoints: 10, bonusMultiplier: 1.0, minLevelRequired: 1 },
    { gameType: "PictureQuiz", basePoints: 10, bonusMultiplier: 1.5, minLevelRequired: 1 },
    { gameType: "TrueFalse", basePoints: 10, bonusMultiplier: 1.3, minLevelRequired: 1 },
    { gameType: "SimpleSpin", basePoints: 10, bonusMultiplier: 1.0, minLevelRequired: 1 },
    { gameType: "FindTheMatch", basePoints: 10, bonusMultiplier: 1.5, minLevelRequired: 1 }
];

const sampleQuestions = [
    // 1. Quiz
    {
        gameType: "Quiz",
        category: "Toán Học",
        questionText: "Kết quả của phép tính 15 + 7 x 2 là bao nhiêu?",
        options: ["44", "29", "34", "19"],
        correctAnswer: "29",
        difficulty: "Easy"
    },
    // 2. Matching (Đã sửa từ MatchingPairs thành Matching)
    {
        gameType: "Matching",
        category: "Tiếng Anh",
        correctAnswer: "Pairs_Configured",
        pairs: [
            { id: "1", text: "Apple", image: "apple.png" },
            { id: "1", text: "Quả táo", image: "apple_vn.png" },
            { id: "2", text: "Banana", image: "banana.png" },
            { id: "2", text: "Quả chuối", image: "banana_vn.png" }
        ],
        difficulty: "Easy"
    },
    // 3. Lucky Number
    {
        gameType: "LuckyNumber",
        category: "Logic",
        questionText: "Hệ thống quay số ngẫu nhiên từ 1 đến 10, hãy đoán con số may mắn?",
        correctAnswer: "7",
        difficulty: "Easy"
    },
    // 4. Flashcard (Đã sửa từ FlashCards thành Flashcard)
    {
        gameType: "Flashcard",
        category: "Khoa Học",
        questionText: "Mặt trước: Nhiệt độ sôi của nước là bao nhiêu?",
        correctAnswer: "Mặt sau: 100 độ C ở điều kiện áp suất tiêu chuẩn.",
        difficulty: "Easy"
    },
    // 5. Word Scramble
    {
        gameType: "WordScramble",
        category: "Tiếng Anh",
        correctAnswer: "EXPO",
        difficulty: "Easy"
    },
    // 6. OpenBox (Đã sửa từ OpenTheBox thành OpenBox)
    {
        gameType: "OpenBox",
        category: "Logic",
        correctAnswer: "Box_Reward",
        rewards: [
            { name: "Hộp Vàng: +20 điểm", value: 20 },
            { name: "Hộp Bạc: +10 điểm", value: 10 },
            { name: "Hộp Rỗng: May mắn lần sau", value: 0 }
        ],
        difficulty: "Easy"
    },
    // 7. Picture Quiz (Đã đổi tên trường từ imageName sang imageUrl và chèn link ảnh thật để test hiển thị)
    {
        gameType: "PictureQuiz",
        category: "Khoa Học",
        imageUrl: "https://lhu.edu.vn/images/logo_lhu.png", // Dùng tạm link logo trường mình làm mẫu nha Thảo
        questionText: "Đây là logo của trường đại học nào?",
        correctAnswer: "Lạc Hồng",
        difficulty: "Easy"
    },
    // 8. True or False
    {
        gameType: "TrueFalse",
        category: "Khoa Học",
        questionText: "Mặt Trăng tự phát ra ánh sáng. Đúng hay Sai?",
        correctAnswer: "False",
        difficulty: "Easy"
    },
    // 9. Simple Spin
    {
        gameType: "SimpleSpin",
        category: "Logic",
        correctAnswer: "Spin_Configured",
        rewards: [
            { name: "Ô may mắn: +50 điểm", value: 50 },
            { name: "Ô mất lượt", value: 0 },
            { name: "Ô nhân đôi điểm", value: 2 }
        ],
        difficulty: "Easy"
    },
    // 10. FindMatch (Đã sửa từ FindTheMatch thành FindMatch và cập nhật sang imageUrl)
    {
        gameType: "FindMatch",
        category: "Logic",
        imageUrl: "https://lhu.edu.vn/images/logo_lhu.png",
        options: ["circle.png", "square.png", "https://lhu.edu.vn/images/logo_lhu.png", "triangle.png"],
        correctAnswer: "https://lhu.edu.vn/images/logo_lhu.png",
        difficulty: "Easy"
    }
];

const runSeed = async () => {
    await connectDatabase();
    const newUser = await User.create({ username: "test_thao", password: "123", fullName: "Thảo Test" });
    console.log("Đã tạo thành công:", newUser);
};
runSeed();
const seedDB = async () => {
    try {
        // Chuỗi chính chủ bản 3.6 của Thảo sau khi đã đổi user, pass và thêm tên DB
        const directURI = "mongodb://admin:123456ABC@ac-1jjcnit-shard-00-00.rivxhf9.mongodb.net:27017,ac-1jjcnit-shard-00-01.rivxhf9.mongodb.net:27017,ac-1jjcnit-shard-00-02.rivxhf9.mongodb.net:27017/QuizzMaster?ssl=true&replicaSet=atlas-dz725f-shard-0&authSource=admin&appName=ClusterQuizzMaster";
        
        await mongoose.connect(directURI, {
            serverSelectionTimeoutMS: 5000
        });
        console.log("⚡ Đã kết nối với MongoDB Atlas thành công để nạp dữ liệu...");
        // Làm sạch toàn bộ dữ liệu cũ tránh rác dữ liệu trùng lặp
        await Category.deleteMany({});
        await GameConfig.deleteMany({});
        await Question.deleteMany({});
        console.log("🧹 Đã xóa sạch dữ liệu cũ trong các bảng categories, gameconfigs, và questions.");

        // Tiến hành chèn dữ liệu mới đồng bộ
        await Category.insertMany(sampleCategories);
        await GameConfig.insertMany(sampleGameConfigs);
        await Question.insertMany(sampleQuestions);
        
        console.log("🎉 Thảo ơi, đã nạp thành công dữ liệu mẫu cho cả 10 trò chơi vào MongoDB rồi nhé!");
        
        mongoose.connection.close();
    } catch (error) {
        console.error("❌ Lỗi nạp dữ liệu:", error.message);
    }
};

seedDB();