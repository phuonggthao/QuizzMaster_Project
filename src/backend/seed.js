import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
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
   // 1. QUIZ
    { gameType: "Quiz", category: "Toán Học", questionText: "15 + 7 x 2 = ?", options: ["29", "44", "34", "19"], correctAnswer: "29", difficulty: "Easy" },
    { gameType: "Quiz", category: "Toán Học", questionText: "Số nguyên tố nhỏ nhất?", options: ["0", "1", "2", "3"], correctAnswer: "2", difficulty: "Easy" },
    { gameType: "Quiz", category: "Khoa Học", questionText: "Trái đất là hành tinh thứ mấy?", options: ["1", "2", "3", "4"], correctAnswer: "3", difficulty: "Easy" },
    { gameType: "Quiz", category: "Khoa Học", questionText: "Động vật nhanh nhất?", options: ["Sư tử", "Báo", "Ngựa", "Chó"], correctAnswer: "Báo", difficulty: "Easy" },
    { gameType: "Quiz", category: "Địa Lý", questionText: "Thủ đô Việt Nam?", options: ["Đà Nẵng", "Sài Gòn", "Hà Nội", "Cần Thơ"], correctAnswer: "Hà Nội", difficulty: "Easy" },
    { gameType: "Quiz", category: "Địa Lý", questionText: "Việt Nam có bao nhiêu tỉnh?", options: ["60", "63", "65", "68"], correctAnswer: "63", difficulty: "Easy" },
    { gameType: "Quiz", category: "Văn Học", questionText: "Tác giả Truyện Kiều?", options: ["Xuân Diệu", "Huy Cận", "Nguyễn Du", "Tố Hữu"], correctAnswer: "Nguyễn Du", difficulty: "Easy" },
    { gameType: "Quiz", category: "Văn Học", questionText: "Tác giả Chí Phèo?", options: ["Nam Cao", "Ngô Tất Tố", "Vũ Trọng Phụng", "Tô Hoài"], correctAnswer: "Nam Cao", difficulty: "Easy" },
    { gameType: "Quiz", category: "Tiếng Anh", questionText: "Trái nghĩa với 'Cao'?", options: ["Dài", "Thấp", "Rộng", "Xa"], correctAnswer: "Thấp", difficulty: "Easy" },
    { gameType: "Quiz", category: "Tiếng Anh", questionText: "Dịch 'Hello'?", options: ["Chào", "Tạm biệt", "Cảm ơn", "Xin lỗi"], correctAnswer: "Chào", difficulty: "Easy" },
    { gameType: "Quiz", category: "Khoa Học", questionText: "Chất khí cần cho hô hấp?", options: ["Nitơ", "Oxy", "CO2", "Hidro"], correctAnswer: "Oxy", difficulty: "Easy" },
    { gameType: "Quiz", category: "Khoa Học", questionText: "H2O là gì?", options: ["Nước", "Muối", "Đường", "Dầu"], correctAnswer: "Nước", difficulty: "Easy" },
    { gameType: "Quiz", category: "Toán Học", questionText: "1km bằng bao nhiêu mét?", options: ["100", "500", "1000", "10000"], correctAnswer: "1000", difficulty: "Easy" },
    { gameType: "Quiz", category: "Toán Học", questionText: "Số pi = ?", options: ["3.1", "3.14", "3.15", "3.2"], correctAnswer: "3.14", difficulty: "Easy" },
    { gameType: "Quiz", category: "Logic", questionText: "Cái gì không có chân?", options: ["Bàn", "Ghế", "Cá", "Chim"], correctAnswer: "Cá", difficulty: "Easy" },
    { gameType: "Quiz", category: "Khoa Học", questionText: "Sông dài nhất thế giới?", options: ["Mê Kông", "Sông Hồng", "Amazon", "Nile"], correctAnswer: "Nile", difficulty: "Easy" },
    { gameType: "Quiz", category: "Khoa Học", questionText: "Ai phát minh bóng đèn?", options: ["Einstein", "Newton", "Edison", "Tesla"], correctAnswer: "Edison", difficulty: "Easy" },
    { gameType: "Quiz", category: "Văn Học", questionText: "Quốc hoa Việt Nam?", options: ["Hoa hồng", "Hoa cúc", "Hoa sen", "Hoa mai"], correctAnswer: "Hoa sen", difficulty: "Easy" },
    { gameType: "Quiz", category: "Toán Học", questionText: "5 x 5 = ?", options: ["10", "20", "25", "30"], correctAnswer: "25", difficulty: "Easy" },
    { gameType: "Quiz", category: "Tiếng Anh", questionText: "Who is the US President?", options: ["Obama", "Biden", "Trump", "Bush"], correctAnswer: "Biden", difficulty: "Easy" },

    // 2. MATCHING
    { gameType: "Matching", category: "Tiếng Anh", correctAnswer: "Pairs_Configured", pairs: [{id: "1", text: "Apple", image: "apple.png"}, {id: "1", text: "Quả táo", image: "apple_vn.png"}, {id: "2", text: "Banana", image: "banana.png"}, {id: "2", text: "Quả chuối", image: "banana_vn.png"}], difficulty: "Easy" },
    { gameType: "Matching", category: "Tiếng Anh", correctAnswer: "Pairs_Configured", pairs: [{id: "1", text: "Cat", image: "cat.png"}, {id: "1", text: "Con mèo", image: "cat_vn.png"}, {id: "2", text: "Dog", image: "dog.png"}, {id: "2", text: "Con chó", image: "dog_vn.png"}], difficulty: "Easy" },
    { gameType: "Matching", category: "Tiếng Anh", correctAnswer: "Pairs_Configured", pairs: [{id: "1", text: "Sun", image: "sun.png"}, {id: "1", text: "Mặt trời", image: "sun_vn.png"}, {id: "2", text: "Moon", image: "moon.png"}, {id: "2", text: "Mặt trăng", image: "moon_vn.png"}], difficulty: "Easy" },
    { gameType: "Matching", category: "Tiếng Anh", correctAnswer: "Pairs_Configured", pairs: [{id: "1", text: "Book", image: "book.png"}, {id: "1", text: "Quyển sách", image: "book_vn.png"}, {id: "2", text: "Pen", image: "pen.png"}, {id: "2", text: "Cây bút", image: "pen_vn.png"}], difficulty: "Easy" },
    { gameType: "Matching", category: "Tiếng Anh", correctAnswer: "Pairs_Configured", pairs: [{id: "1", text: "Red", image: "red.png"}, {id: "1", text: "Màu đỏ", image: "red_vn.png"}, {id: "2", text: "Blue", image: "blue.png"}, {id: "2", text: "Màu xanh", image: "blue_vn.png"}], difficulty: "Easy" },
    { gameType: "Matching", category: "Tiếng Anh", correctAnswer: "Pairs_Configured", pairs: [{id: "1", text: "Bird", image: "bird.png"}, {id: "1", text: "Con chim", image: "bird_vn.png"}, {id: "2", text: "Fish", image: "fish.png"}, {id: "2", text: "Con cá", image: "fish_vn.png"}], difficulty: "Easy" },
    { gameType: "Matching", category: "Tiếng Anh", correctAnswer: "Pairs_Configured", pairs: [{id: "1", text: "Big", image: "big.png"}, {id: "1", text: "To lớn", image: "big_vn.png"}, {id: "2", text: "Small", image: "small.png"}, {id: "2", text: "Nhỏ bé", image: "small_vn.png"}], difficulty: "Easy" },
    { gameType: "Matching", category: "Tiếng Anh", correctAnswer: "Pairs_Configured", pairs: [{id: "1", text: "Fast", image: "fast.png"}, {id: "1", text: "Nhanh", image: "fast_vn.png"}, {id: "2", text: "Slow", image: "slow.png"}, {id: "2", text: "Chậm", image: "slow_vn.png"}], difficulty: "Easy" },
    { gameType: "Matching", category: "Tiếng Anh", correctAnswer: "Pairs_Configured", pairs: [{id: "1", text: "Happy", image: "happy.png"}, {id: "1", text: "Vui vẻ", image: "happy_vn.png"}, {id: "2", text: "Sad", image: "sad.png"}, {id: "2", text: "Buồn bã", image: "sad_vn.png"}], difficulty: "Easy" },
    { gameType: "Matching", category: "Tiếng Anh", correctAnswer: "Pairs_Configured", pairs: [{id: "1", text: "Hot", image: "hot.png"}, {id: "1", text: "Nóng", image: "hot_vn.png"}, {id: "2", text: "Cold", image: "cold.png"}, {id: "2", text: "Lạnh", image: "cold_vn.png"}], difficulty: "Easy" },
    { gameType: "Matching", category: "Toán Học", correctAnswer: "Pairs_Configured", pairs: [{id: "1", text: "1+1", image: ""}, {id: "1", text: "2", image: ""}, {id: "2", text: "2+2", image: ""}, {id: "2", text: "4", image: ""}], difficulty: "Medium" },
    { gameType: "Matching", category: "Toán Học", correctAnswer: "Pairs_Configured", pairs: [{id: "1", text: "3+3", image: ""}, {id: "1", text: "6", image: ""}, {id: "2", text: "4+4", image: ""}, {id: "2", text: "8", image: ""}], difficulty: "Medium" },
    { gameType: "Matching", category: "Logic", correctAnswer: "Pairs_Configured", pairs: [{id: "1", text: "A", image: ""}, {id: "1", text: "Chữ cái đầu", image: ""}, {id: "2", text: "B", image: ""}, {id: "2", text: "Chữ cái thứ 2", image: ""}], difficulty: "Easy" },
    { gameType: "Matching", category: "Logic", correctAnswer: "Pairs_Configured", pairs: [{id: "1", text: "Hình tròn", image: ""}, {id: "1", text: "Circle", image: ""}, {id: "2", text: "Hình vuông", image: ""}, {id: "2", text: "Square", image: ""}], difficulty: "Easy" },
    { gameType: "Matching", category: "Khoa Học", correctAnswer: "Pairs_Configured", pairs: [{id: "1", text: "H2O", image: ""}, {id: "1", text: "Nước", image: ""}, {id: "2", text: "O2", image: ""}, {id: "2", text: "Oxy", image: ""}], difficulty: "Medium" },
    { gameType: "Matching", category: "Khoa Học", correctAnswer: "Pairs_Configured", pairs: [{id: "1", text: "Mắt", image: ""}, {id: "1", text: "Nhìn", image: ""}, {id: "2", text: "Tai", image: ""}, {id: "2", text: "Nghe", image: ""}], difficulty: "Easy" },
    { gameType: "Matching", category: "Tiếng Anh", correctAnswer: "Pairs_Configured", pairs: [{id: "1", text: "Car", image: ""}, {id: "1", text: "Xe hơi", image: ""}, {id: "2", text: "Bike", image: ""}, {id: "2", text: "Xe đạp", image: ""}], difficulty: "Easy" },
    { gameType: "Matching", category: "Tiếng Anh", correctAnswer: "Pairs_Configured", pairs: [{id: "1", text: "Spring", image: ""}, {id: "1", text: "Mùa xuân", image: ""}, {id: "2", text: "Summer", image: ""}, {id: "2", text: "Mùa hè", image: ""}], difficulty: "Easy" },
    { gameType: "Matching", category: "Tiếng Anh", correctAnswer: "Pairs_Configured", pairs: [{id: "1", text: "Day", image: ""}, {id: "1", text: "Ban ngày", image: ""}, {id: "2", text: "Night", image: ""}, {id: "2", text: "Ban đêm", image: ""}], difficulty: "Easy" },
    { gameType: "Matching", category: "Tiếng Anh", correctAnswer: "Pairs_Configured", pairs: [{id: "1", text: "Up", image: ""}, {id: "1", text: "Lên", image: ""}, {id: "2", text: "Down", image: ""}, {id: "2", text: "Xuống", image: ""}], difficulty: "Easy" },

    // 3. LUCKY NUMBER
    { gameType: "LuckyNumber", category: "Logic", questionText: "Hệ thống quay từ 1-10, đoán số may mắn?", correctAnswer: "1", difficulty: "Easy" },
    { gameType: "LuckyNumber", category: "Logic", questionText: "Hệ thống quay từ 1-10, đoán số may mắn?", correctAnswer: "2", difficulty: "Easy" },
    { gameType: "LuckyNumber", category: "Logic", questionText: "Hệ thống quay từ 1-10, đoán số may mắn?", correctAnswer: "3", difficulty: "Easy" },
    { gameType: "LuckyNumber", category: "Logic", questionText: "Hệ thống quay từ 1-10, đoán số may mắn?", correctAnswer: "4", difficulty: "Easy" },
    { gameType: "LuckyNumber", category: "Logic", questionText: "Hệ thống quay từ 1-10, đoán số may mắn?", correctAnswer: "5", difficulty: "Easy" },
    { gameType: "LuckyNumber", category: "Logic", questionText: "Hệ thống quay từ 1-10, đoán số may mắn?", correctAnswer: "6", difficulty: "Easy" },
    { gameType: "LuckyNumber", category: "Logic", questionText: "Hệ thống quay từ 1-10, đoán số may mắn?", correctAnswer: "7", difficulty: "Easy" },
    { gameType: "LuckyNumber", category: "Logic", questionText: "Hệ thống quay từ 1-10, đoán số may mắn?", correctAnswer: "8", difficulty: "Easy" },
    { gameType: "LuckyNumber", category: "Logic", questionText: "Hệ thống quay từ 1-10, đoán số may mắn?", correctAnswer: "9", difficulty: "Easy" },
    { gameType: "LuckyNumber", category: "Logic", questionText: "Hệ thống quay từ 1-10, đoán số may mắn?", correctAnswer: "10", difficulty: "Easy" },
    { gameType: "LuckyNumber", category: "Logic", questionText: "Quay số từ 1-20, bạn chọn số nào?", correctAnswer: "12", difficulty: "Medium" },
    { gameType: "LuckyNumber", category: "Logic", questionText: "Quay số từ 1-20, bạn chọn số nào?", correctAnswer: "15", difficulty: "Medium" },
    { gameType: "LuckyNumber", category: "Logic", questionText: "Quay số từ 1-20, bạn chọn số nào?", correctAnswer: "18", difficulty: "Medium" },
    { gameType: "LuckyNumber", category: "Logic", questionText: "Quay số từ 1-20, bạn chọn số nào?", correctAnswer: "20", difficulty: "Medium" },
    { gameType: "LuckyNumber", category: "Logic", questionText: "Quay số từ 1-50, con số may mắn hôm nay?", correctAnswer: "25", difficulty: "Hard" },
    { gameType: "LuckyNumber", category: "Logic", questionText: "Quay số từ 1-50, con số may mắn hôm nay?", correctAnswer: "33", difficulty: "Hard" },
    { gameType: "LuckyNumber", category: "Logic", questionText: "Quay số từ 1-50, con số may mắn hôm nay?", correctAnswer: "40", difficulty: "Hard" },
    { gameType: "LuckyNumber", category: "Logic", questionText: "Quay số từ 1-50, con số may mắn hôm nay?", correctAnswer: "48", difficulty: "Hard" },
    { gameType: "LuckyNumber", category: "Logic", questionText: "Quay số từ 1-100, hãy thử vận may của bạn!", correctAnswer: "77", difficulty: "Hard" },
    { gameType: "LuckyNumber", category: "Logic", questionText: "Quay số từ 1-100, hãy thử vận may của bạn!", correctAnswer: "99", difficulty: "Hard" },

    // 4. FLASHCARD
    { gameType: "Flashcard", category: "Khoa Học", questionText: "Mặt trước: Nhiệt độ sôi của nước?", correctAnswer: "Mặt sau: 100 độ C.", difficulty: "Easy" },
    { gameType: "Flashcard", category: "Toán Học", questionText: "Mặt trước: 5 x 5 = ?", correctAnswer: "Mặt sau: 25.", difficulty: "Easy" },
    { gameType: "Flashcard", category: "Toán Học", questionText: "Mặt trước: Căn bậc hai của 9?", correctAnswer: "Mặt sau: 3.", difficulty: "Easy" },
    { gameType: "Flashcard", category: "Khoa Học", questionText: "Mặt trước: Hành tinh nào lớn nhất?", correctAnswer: "Mặt sau: Sao Mộc.", difficulty: "Medium" },
    { gameType: "Flashcard", category: "Tiếng Anh", questionText: "Mặt trước: Nghĩa của 'Hello'?", correctAnswer: "Mặt sau: Xin chào.", difficulty: "Easy" },
    { gameType: "Flashcard", category: "Khoa Học", questionText: "Mặt trước: Tốc độ ánh sáng?", correctAnswer: "Mặt sau: 300,000 km/s.", difficulty: "Hard" },
    { gameType: "Flashcard", category: "Logic", questionText: "Mặt trước: 1 tuần có mấy ngày?", correctAnswer: "Mặt sau: 7 ngày.", difficulty: "Easy" },
    { gameType: "Flashcard", category: "Toán Học", questionText: "Mặt trước: Số pi là bao nhiêu?", correctAnswer: "Mặt sau: Khoảng 3.14.", difficulty: "Medium" },
    { gameType: "Flashcard", category: "Tiếng Anh", questionText: "Mặt trước: 'Apple' là quả gì?", correctAnswer: "Mặt sau: Quả táo.", difficulty: "Easy" },
    { gameType: "Flashcard", category: "Khoa Học", questionText: "Mặt trước: Con người thở ra khí gì?", correctAnswer: "Mặt sau: CO2.", difficulty: "Medium" },
    { gameType: "Flashcard", category: "Logic", questionText: "Mặt trước: Hình tam giác có mấy cạnh?", correctAnswer: "Mặt sau: 3 cạnh.", difficulty: "Easy" },
    { gameType: "Flashcard", category: "Toán Học", questionText: "Mặt trước: 10 + 20 = ?", correctAnswer: "Mặt sau: 30.", difficulty: "Easy" },
    { gameType: "Flashcard", category: "Khoa Học", questionText: "Mặt trước: Nước có công thức gì?", correctAnswer: "Mặt sau: H2O.", difficulty: "Easy" },
    { gameType: "Flashcard", category: "Tiếng Anh", questionText: "Mặt trước: 'Book' là gì?", correctAnswer: "Mặt sau: Quyển sách.", difficulty: "Easy" },
    { gameType: "Flashcard", category: "Logic", questionText: "Mặt trước: 1 giờ có mấy phút?", correctAnswer: "Mặt sau: 60 phút.", difficulty: "Easy" },
    { gameType: "Flashcard", category: "Khoa Học", questionText: "Mặt trước: Trái đất quay quanh gì?", correctAnswer: "Mặt sau: Mặt trời.", difficulty: "Medium" },
    { gameType: "Flashcard", category: "Toán Học", questionText: "Mặt trước: 2 mũ 3 bằng bao nhiêu?", correctAnswer: "Mặt sau: 8.", difficulty: "Medium" },
    { gameType: "Flashcard", category: "Tiếng Anh", questionText: "Mặt trước: 'Cat' là con gì?", correctAnswer: "Mặt sau: Con mèo.", difficulty: "Easy" },
    { gameType: "Flashcard", category: "Khoa Học", questionText: "Mặt trước: Kim loại cứng nhất?", correctAnswer: "Mặt sau: Vonfram.", difficulty: "Hard" },
    { gameType: "Flashcard", category: "Logic", questionText: "Mặt trước: 1 năm có mấy tháng?", correctAnswer: "Mặt sau: 12 tháng.", difficulty: "Easy" },

    // 5. WORD SCRAMBLE
    { gameType: "WordScramble", category: "Tiếng Anh", correctAnswer: "EXPO", difficulty: "Easy" },
    { gameType: "WordScramble", category: "Tiếng Anh", correctAnswer: "APPLE", difficulty: "Easy" },
    { gameType: "WordScramble", category: "Tiếng Anh", correctAnswer: "BANANA", difficulty: "Easy" },
    { gameType: "WordScramble", category: "Tiếng Anh", correctAnswer: "CAT", difficulty: "Easy" },
    { gameType: "WordScramble", category: "Tiếng Anh", correctAnswer: "DOG", difficulty: "Easy" },
    { gameType: "WordScramble", category: "Tiếng Anh", correctAnswer: "BOOK", difficulty: "Easy" },
    { gameType: "WordScramble", category: "Tiếng Anh", correctAnswer: "PEN", difficulty: "Easy" },
    { gameType: "WordScramble", category: "Tiếng Anh", correctAnswer: "RED", difficulty: "Easy" },
    { gameType: "WordScramble", category: "Tiếng Anh", correctAnswer: "BLUE", difficulty: "Easy" },
    { gameType: "WordScramble", category: "Tiếng Anh", correctAnswer: "HAPPY", difficulty: "Medium" },
    { gameType: "WordScramble", category: "Tiếng Anh", correctAnswer: "COLD", difficulty: "Easy" },
    { gameType: "WordScramble", category: "Tiếng Anh", correctAnswer: "HOT", difficulty: "Easy" },
    { gameType: "WordScramble", category: "Tiếng Anh", correctAnswer: "SLOW", difficulty: "Medium" },
    { gameType: "WordScramble", category: "Tiếng Anh", correctAnswer: "FAST", difficulty: "Medium" },
    { gameType: "WordScramble", category: "Tiếng Anh", correctAnswer: "DREAM", difficulty: "Hard" },
    { gameType: "WordScramble", category: "Tiếng Anh", correctAnswer: "SING", difficulty: "Medium" },
    { gameType: "WordScramble", category: "Tiếng Anh", correctAnswer: "JUMP", difficulty: "Medium" },
    { gameType: "WordScramble", category: "Tiếng Anh", correctAnswer: "GIFT", difficulty: "Easy" },
    { gameType: "WordScramble", category: "Tiếng Anh", correctAnswer: "ORANGE", difficulty: "Hard" },
    { gameType: "WordScramble", category: "Tiếng Anh", correctAnswer: "GRAPE", difficulty: "Hard" },

    // 6. OpenBox
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
   
    // --- 7. PICTURE QUIZ (20 câu theo đúng cấu trúc) ---
    { gameType: "PictureQuiz", category: "Khoa Học", imageUrl: "https://picsum.photos/200/200?1", questionText: "Đây là hình ảnh gì?", correctAnswer: "Phong cảnh 1", difficulty: "Easy" },
    { gameType: "PictureQuiz", category: "Khoa Học", imageUrl: "https://picsum.photos/200/200?2", questionText: "Đây là hình ảnh gì?", correctAnswer: "Phong cảnh 2", difficulty: "Easy" },
    { gameType: "PictureQuiz", category: "Khoa Học", imageUrl: "https://picsum.photos/200/200?3", questionText: "Đây là hình ảnh gì?", correctAnswer: "Phong cảnh 3", difficulty: "Easy" },
    { gameType: "PictureQuiz", category: "Khoa Học", imageUrl: "https://picsum.photos/200/200?4", questionText: "Đây là hình ảnh gì?", correctAnswer: "Phong cảnh 4", difficulty: "Easy" },
    { gameType: "PictureQuiz", category: "Khoa Học", imageUrl: "https://picsum.photos/200/200?5", questionText: "Đây là hình ảnh gì?", correctAnswer: "Phong cảnh 5", difficulty: "Easy" },
    { gameType: "PictureQuiz", category: "Khoa Học", imageUrl: "https://picsum.photos/200/200?6", questionText: "Đây là hình ảnh gì?", correctAnswer: "Phong cảnh 6", difficulty: "Medium" },
    { gameType: "PictureQuiz", category: "Khoa Học", imageUrl: "https://picsum.photos/200/200?7", questionText: "Đây là hình ảnh gì?", correctAnswer: "Phong cảnh 7", difficulty: "Medium" },
    { gameType: "PictureQuiz", category: "Khoa Học", imageUrl: "https://picsum.photos/200/200?8", questionText: "Đây là hình ảnh gì?", correctAnswer: "Phong cảnh 8", difficulty: "Medium" },
    { gameType: "PictureQuiz", category: "Khoa Học", imageUrl: "https://picsum.photos/200/200?9", questionText: "Đây là hình ảnh gì?", correctAnswer: "Phong cảnh 9", difficulty: "Medium" },
    { gameType: "PictureQuiz", category: "Khoa Học", imageUrl: "https://picsum.photos/200/200?10", questionText: "Đây là hình ảnh gì?", correctAnswer: "Phong cảnh 10", difficulty: "Medium" },
    { gameType: "PictureQuiz", category: "Logic", imageUrl: "https://picsum.photos/200/200?11", questionText: "Đoán tên đồ vật?", correctAnswer: "Đồ vật 1", difficulty: "Easy" },
    { gameType: "PictureQuiz", category: "Logic", imageUrl: "https://picsum.photos/200/200?12", questionText: "Đoán tên đồ vật?", correctAnswer: "Đồ vật 2", difficulty: "Easy" },
    { gameType: "PictureQuiz", category: "Logic", imageUrl: "https://picsum.photos/200/200?13", questionText: "Đoán tên đồ vật?", correctAnswer: "Đồ vật 3", difficulty: "Easy" },
    { gameType: "PictureQuiz", category: "Logic", imageUrl: "https://picsum.photos/200/200?14", questionText: "Đoán tên đồ vật?", correctAnswer: "Đồ vật 4", difficulty: "Easy" },
    { gameType: "PictureQuiz", category: "Logic", imageUrl: "https://picsum.photos/200/200?15", questionText: "Đoán tên đồ vật?", correctAnswer: "Đồ vật 5", difficulty: "Easy" },
    { gameType: "PictureQuiz", category: "Logic", imageUrl: "https://picsum.photos/200/200?16", questionText: "Đoán tên đồ vật?", correctAnswer: "Đồ vật 6", difficulty: "Hard" },
    { gameType: "PictureQuiz", category: "Logic", imageUrl: "https://picsum.photos/200/200?17", questionText: "Đoán tên đồ vật?", correctAnswer: "Đồ vật 7", difficulty: "Hard" },
    { gameType: "PictureQuiz", category: "Logic", imageUrl: "https://picsum.photos/200/200?18", questionText: "Đoán tên đồ vật?", correctAnswer: "Đồ vật 8", difficulty: "Hard" },
    { gameType: "PictureQuiz", category: "Logic", imageUrl: "https://picsum.photos/200/200?19", questionText: "Đoán tên đồ vật?", correctAnswer: "Đồ vật 9", difficulty: "Hard" },
    { gameType: "PictureQuiz", category: "Logic", imageUrl: "https://picsum.photos/200/200?20", questionText: "Đoán tên đồ vật?", correctAnswer: "Đồ vật 10", difficulty: "Hard" },
   
    //// --- 8. TRUE FALSE (20 câu theo đúng cấu trúc của bạn) ---
    { gameType: "TrueFalse", category: "Khoa Học", questionText: "Mặt Trăng tự phát ra ánh sáng. Đúng hay Sai?", correctAnswer: "False", difficulty: "Easy" },
    { gameType: "TrueFalse", category: "Khoa Học", questionText: "Trái Đất quay quanh Mặt Trời. Đúng hay Sai?", correctAnswer: "True", difficulty: "Easy" },
    { gameType: "TrueFalse", category: "Khoa Học", questionText: "Cá sống ở dưới nước. Đúng hay Sai?", correctAnswer: "True", difficulty: "Easy" },
    { gameType: "TrueFalse", category: "Khoa Học", questionText: "Con người cần oxy để thở. Đúng hay Sai?", correctAnswer: "True", difficulty: "Easy" },
    { gameType: "TrueFalse", category: "Khoa Học", questionText: "Kim cương là vật liệu mềm nhất. Đúng hay Sai?", correctAnswer: "False", difficulty: "Medium" },
    { gameType: "TrueFalse", category: "Toán Học", questionText: "2 + 2 = 5. Đúng hay Sai?", correctAnswer: "False", difficulty: "Easy" },
    { gameType: "TrueFalse", category: "Toán Học", questionText: "Số 0 là số tự nhiên. Đúng hay Sai?", correctAnswer: "True", difficulty: "Easy" },
    { gameType: "TrueFalse", category: "Toán Học", questionText: "Hình tròn có 4 cạnh. Đúng hay Sai?", correctAnswer: "False", difficulty: "Easy" },
    { gameType: "TrueFalse", category: "Toán Học", questionText: "10 chia 2 bằng 5. Đúng hay Sai?", correctAnswer: "True", difficulty: "Easy" },
    { gameType: "TrueFalse", category: "Toán Học", questionText: "Số 7 là số nguyên tố. Đúng hay Sai?", correctAnswer: "True", difficulty: "Medium" },
    { gameType: "TrueFalse", category: "Logic", questionText: "Một tuần có 7 ngày. Đúng hay Sai?", correctAnswer: "True", difficulty: "Easy" },
    { gameType: "TrueFalse", category: "Logic", questionText: "Mùa hè thường lạnh hơn mùa đông. Đúng hay Sai?", correctAnswer: "False", difficulty: "Easy" },
    { gameType: "TrueFalse", category: "Logic", questionText: "Máy tính cần điện để hoạt động. Đúng hay Sai?", correctAnswer: "True", difficulty: "Easy" },
    { gameType: "TrueFalse", category: "Logic", questionText: "Chim cánh cụt biết bay. Đúng hay Sai?", correctAnswer: "False", difficulty: "Medium" },
    { gameType: "TrueFalse", category: "Logic", questionText: "Chúng ta đọc sách bằng mắt. Đúng hay Sai?", correctAnswer: "True", difficulty: "Easy" },
    { gameType: "TrueFalse", category: "Khoa Học", questionText: "Nước đóng băng ở 0 độ C. Đúng hay Sai?", correctAnswer: "True", difficulty: "Medium" },
    { gameType: "TrueFalse", category: "Khoa Học", questionText: "Con voi có thể bay. Đúng hay Sai?", correctAnswer: "False", difficulty: "Easy" },
    { gameType: "TrueFalse", category: "Tiếng Anh", questionText: "Từ 'Apple' có nghĩa là quả chuối. Đúng hay Sai?", correctAnswer: "False", difficulty: "Easy" },
    { gameType: "TrueFalse", category: "Tiếng Anh", questionText: "Từ 'Cat' nghĩa là con mèo. Đúng hay Sai?", correctAnswer: "True", difficulty: "Easy" },
    { gameType: "TrueFalse", category: "Logic", questionText: "Điện thoại dùng để ngủ. Đúng hay Sai?", correctAnswer: "False", difficulty: "Easy" },
   
    // --- 9. SIMPLE SPIN (20 câu tường minh) ---
    { gameType: "SimpleSpin", category: "Logic", correctAnswer: "Spin_Configured", rewards: [{name: "Ô may mắn: +50 điểm", value: 50}, {name: "Ô mất lượt", value: 0}, {name: "Ô nhân đôi điểm", value: 2}], difficulty: "Easy" },
    { gameType: "SimpleSpin", category: "Logic", correctAnswer: "Spin_Configured", rewards: [{name: "Ô +10 điểm", value: 10}, {name: "Ô +20 điểm", value: 20}, {name: "Ô mất lượt", value: 0}], difficulty: "Easy" },
    { gameType: "SimpleSpin", category: "Logic", correctAnswer: "Spin_Configured", rewards: [{name: "Ô +5 điểm", value: 5}, {name: "Ô +15 điểm", value: 15}, {name: "Ô nhân 3 điểm", value: 3}], difficulty: "Easy" },
    { gameType: "SimpleSpin", category: "Logic", correctAnswer: "Spin_Configured", rewards: [{name: "Ô may mắn: +100 điểm", value: 100}, {name: "Ô mất lượt", value: 0}, {name: "Ô quay lại", value: 0}], difficulty: "Medium" },
    { gameType: "SimpleSpin", category: "Logic", correctAnswer: "Spin_Configured", rewards: [{name: "Ô +30 điểm", value: 30}, {name: "Ô +40 điểm", value: 40}, {name: "Ô chia đôi", value: 0.5}], difficulty: "Medium" },
    { gameType: "SimpleSpin", category: "Logic", correctAnswer: "Spin_Configured", rewards: [{name: "Ô +50 điểm", value: 50}, {name: "Ô mất lượt", value: 0}, {name: "Ô thưởng thêm 1 lượt", value: 0}], difficulty: "Medium" },
    { gameType: "SimpleSpin", category: "Logic", correctAnswer: "Spin_Configured", rewards: [{name: "Ô +25 điểm", value: 25}, {name: "Ô +75 điểm", value: 75}, {name: "Ô mất lượt", value: 0}], difficulty: "Medium" },
    { gameType: "SimpleSpin", category: "Logic", correctAnswer: "Spin_Configured", rewards: [{name: "Ô +100 điểm", value: 100}, {name: "Ô nhân 2 điểm", value: 2}, {name: "Ô mất lượt", value: 0}], difficulty: "Hard" },
    { gameType: "SimpleSpin", category: "Logic", correctAnswer: "Spin_Configured", rewards: [{name: "Ô +200 điểm", value: 200}, {name: "Ô mất lượt", value: 0}, {name: "Ô nhân 5 điểm", value: 5}], difficulty: "Hard" },
    { gameType: "SimpleSpin", category: "Logic", correctAnswer: "Spin_Configured", rewards: [{name: "Ô +10 điểm", value: 10}, {name: "Ô +10 điểm", value: 10}, {name: "Ô mất lượt", value: 0}], difficulty: "Easy" },
    { gameType: "SimpleSpin", category: "Logic", correctAnswer: "Spin_Configured", rewards: [{name: "Ô +30 điểm", value: 30}, {name: "Ô mất lượt", value: 0}, {name: "Ô quay lại", value: 0}], difficulty: "Easy" },
    { gameType: "SimpleSpin", category: "Logic", correctAnswer: "Spin_Configured", rewards: [{name: "Ô +50 điểm", value: 50}, {name: "Ô +50 điểm", value: 50}, {name: "Ô mất lượt", value: 0}], difficulty: "Easy" },
    { gameType: "SimpleSpin", category: "Logic", correctAnswer: "Spin_Configured", rewards: [{name: "Ô +15 điểm", value: 15}, {name: "Ô +25 điểm", value: 25}, {name: "Ô nhân 2 điểm", value: 2}], difficulty: "Easy" },
    { gameType: "SimpleSpin", category: "Logic", correctAnswer: "Spin_Configured", rewards: [{name: "Ô +60 điểm", value: 60}, {name: "Ô mất lượt", value: 0}, {name: "Ô quay lại", value: 0}], difficulty: "Medium" },
    { gameType: "SimpleSpin", category: "Logic", correctAnswer: "Spin_Configured", rewards: [{name: "Ô +80 điểm", value: 80}, {name: "Ô +90 điểm", value: 90}, {name: "Ô mất lượt", value: 0}], difficulty: "Medium" },
    { gameType: "SimpleSpin", category: "Logic", correctAnswer: "Spin_Configured", rewards: [{name: "Ô +120 điểm", value: 120}, {name: "Ô mất lượt", value: 0}, {name: "Ô nhân 2 điểm", value: 2}], difficulty: "Medium" },
    { gameType: "SimpleSpin", category: "Logic", correctAnswer: "Spin_Configured", rewards: [{name: "Ô +150 điểm", value: 150}, {name: "Ô mất lượt", value: 0}, {name: "Ô quay lại", value: 0}], difficulty: "Hard" },
    { gameType: "SimpleSpin", category: "Logic", correctAnswer: "Spin_Configured", rewards: [{name: "Ô +300 điểm", value: 300}, {name: "Ô +400 điểm", value: 400}, {name: "Ô mất lượt", value: 0}], difficulty: "Hard" },
    { gameType: "SimpleSpin", category: "Logic", correctAnswer: "Spin_Configured", rewards: [{name: "Ô +500 điểm", value: 500}, {name: "Ô nhân 10 điểm", value: 10}, {name: "Ô mất lượt", value: 0}], difficulty: "Hard" },
    { gameType: "SimpleSpin", category: "Logic", correctAnswer: "Spin_Configured", rewards: [{name: "Ô Jackpot", value: 1000}, {name: "Ô mất lượt", value: 0}, {name: "Ô quay lại", value: 0}], difficulty: "Hard" },
   
    // --- 10. FIND MATCH (20 câu tường minh) ---
    { gameType: "FindMatch", category: "Logic", imageUrl: "https://lhu.edu.vn/images/logo_lhu.png", options: ["circle.png", "square.png", "https://lhu.edu.vn/images/logo_lhu.png", "triangle.png"], correctAnswer: "https://lhu.edu.vn/images/logo_lhu.png", difficulty: "Easy" },
    { gameType: "FindMatch", category: "Logic", imageUrl: "https://via.placeholder.com/150/FF0000", options: ["https://via.placeholder.com/150/FF0000", "blue.png", "green.png", "yellow.png"], correctAnswer: "https://via.placeholder.com/150/FF0000", difficulty: "Easy" },
    { gameType: "FindMatch", category: "Logic", imageUrl: "https://via.placeholder.com/150/0000FF", options: ["red.png", "https://via.placeholder.com/150/0000FF", "green.png", "yellow.png"], correctAnswer: "https://via.placeholder.com/150/0000FF", difficulty: "Easy" },
    { gameType: "FindMatch", category: "Logic", imageUrl: "https://via.placeholder.com/150/008000", options: ["red.png", "blue.png", "https://via.placeholder.com/150/008000", "yellow.png"], correctAnswer: "https://via.placeholder.com/150/008000", difficulty: "Easy" },
    { gameType: "FindMatch", category: "Logic", imageUrl: "https://via.placeholder.com/150/FFFF00", options: ["red.png", "blue.png", "green.png", "https://via.placeholder.com/150/FFFF00"], correctAnswer: "https://via.placeholder.com/150/FFFF00", difficulty: "Easy" },
    { gameType: "FindMatch", category: "Logic", imageUrl: "https://via.placeholder.com/150/000000", options: ["https://via.placeholder.com/150/000000", "white.png", "gray.png", "brown.png"], correctAnswer: "https://via.placeholder.com/150/000000", difficulty: "Medium" },
    { gameType: "FindMatch", category: "Logic", imageUrl: "https://via.placeholder.com/150/FFFFFF", options: ["black.png", "https://via.placeholder.com/150/FFFFFF", "gray.png", "brown.png"], correctAnswer: "https://via.placeholder.com/150/FFFFFF", difficulty: "Medium" },
    { gameType: "FindMatch", category: "Logic", imageUrl: "https://via.placeholder.com/150/808080", options: ["black.png", "white.png", "https://via.placeholder.com/150/808080", "brown.png"], correctAnswer: "https://via.placeholder.com/150/808080", difficulty: "Medium" },
    { gameType: "FindMatch", category: "Logic", imageUrl: "https://via.placeholder.com/150/A52A2A", options: ["black.png", "white.png", "gray.png", "https://via.placeholder.com/150/A52A2A"], correctAnswer: "https://via.placeholder.com/150/A52A2A", difficulty: "Medium" },
    { gameType: "FindMatch", category: "Logic", imageUrl: "https://via.placeholder.com/150/FFA500", options: ["https://via.placeholder.com/150/FFA500", "pink.png", "purple.png", "cyan.png"], correctAnswer: "https://via.placeholder.com/150/FFA500", difficulty: "Medium" },
    { gameType: "FindMatch", category: "Logic", imageUrl: "https://via.placeholder.com/150/FFC0CB", options: ["orange.png", "https://via.placeholder.com/150/FFC0CB", "purple.png", "cyan.png"], correctAnswer: "https://via.placeholder.com/150/FFC0CB", difficulty: "Hard" },
    { gameType: "FindMatch", category: "Logic", imageUrl: "https://via.placeholder.com/150/800080", options: ["orange.png", "pink.png", "https://via.placeholder.com/150/800080", "cyan.png"], correctAnswer: "https://via.placeholder.com/150/800080", difficulty: "Hard" },
    { gameType: "FindMatch", category: "Logic", imageUrl: "https://via.placeholder.com/150/00FFFF", options: ["orange.png", "pink.png", "purple.png", "https://via.placeholder.com/150/00FFFF"], correctAnswer: "https://via.placeholder.com/150/00FFFF", difficulty: "Hard" },
    { gameType: "FindMatch", category: "Logic", imageUrl: "https://via.placeholder.com/150/4B0082", options: ["https://via.placeholder.com/150/4B0082", "lime.png", "olive.png", "maroon.png"], correctAnswer: "https://via.placeholder.com/150/4B0082", difficulty: "Hard" },
    { gameType: "FindMatch", category: "Logic", imageUrl: "https://via.placeholder.com/150/00FF00", options: ["indigo.png", "https://via.placeholder.com/150/00FF00", "olive.png", "maroon.png"], correctAnswer: "https://via.placeholder.com/150/00FF00", difficulty: "Hard" },
    { gameType: "FindMatch", category: "Logic", imageUrl: "https://via.placeholder.com/150/808000", options: ["indigo.png", "lime.png", "https://via.placeholder.com/150/808000", "maroon.png"], correctAnswer: "https://via.placeholder.com/150/808000", difficulty: "Hard" },
    { gameType: "FindMatch", category: "Logic", imageUrl: "https://via.placeholder.com/150/800000", options: ["indigo.png", "lime.png", "olive.png", "https://via.placeholder.com/150/800000"], correctAnswer: "https://via.placeholder.com/150/800000", difficulty: "Hard" },
    { gameType: "FindMatch", category: "Logic", imageUrl: "https://via.placeholder.com/150/FFD700", options: ["https://via.placeholder.com/150/FFD700", "silver.png", "bronze.png", "copper.png"], correctAnswer: "https://via.placeholder.com/150/FFD700", difficulty: "Hard" },
    { gameType: "FindMatch", category: "Logic", imageUrl: "https://via.placeholder.com/150/C0C0C0", options: ["gold.png", "https://via.placeholder.com/150/C0C0C0", "bronze.png", "copper.png"], correctAnswer: "https://via.placeholder.com/150/C0C0C0", difficulty: "Hard" },
    { gameType: "FindMatch", category: "Logic", imageUrl: "https://via.placeholder.com/150/CD7F32", options: ["gold.png", "silver.png", "bronze.png", "https://via.placeholder.com/150/CD7F32"], correctAnswer: "https://via.placeholder.com/150/CD7F32", difficulty: "Hard" }
];



const seedDB = async () => {
    try {
        const directURI = "mongodb://admin:123456ABC@ac-1jjcnit-shard-00-00.rivxhf9.mongodb.net:27017,ac-1jjcnit-shard-00-01.rivxhf9.mongodb.net:27017,ac-1jjcnit-shard-00-02.rivxhf9.mongodb.net:27017/QuizzMaster?ssl=true&replicaSet=atlas-dz725f-shard-0&authSource=admin&appName=ClusterQuizzMaster";
        
        await mongoose.connect(directURI, {
            serverSelectionTimeoutMS: 5000
        });
        console.log("⚡ Đã kết nối với MongoDB Atlas thành công...");

        // 1. XÓA SẠCH DỮ LIỆU CŨ MỘT LẦN DUY NHẤT
        await User.deleteMany({});
        await Category.deleteMany({});
        await GameConfig.deleteMany({});
        await Question.deleteMany({});
        console.log("🧹 Đã xóa sạch toàn bộ dữ liệu cũ trong các collection.");

        // 2. BĂM MẬT KHẨU
        const passwordPlain = "123";
        const hashedPassword = await bcrypt.hash(passwordPlain, 10);

        // 3. TẠO USER MỚI
        await User.create({ 
            username: "test_thao", 
            password: hashedPassword, 
            fullName: "Thảo Test" 
        });
        console.log("✅ Đã tạo user 'test_thao' với mật khẩu đã băm!");

        // 4. CHÈN DỮ LIỆU MỚI
        await Category.insertMany(sampleCategories);
        await GameConfig.insertMany(sampleGameConfigs);
        await Question.insertMany(sampleQuestions);
        
        console.log("🎉 Nạp dữ liệu mẫu thành công!");
        
        await mongoose.connection.close();
        process.exit(); // Dòng này giúp thoát script hoàn toàn sau khi chạy xong
    } catch (error) {
        console.error("❌ Lỗi nạp dữ liệu:", error.message);
    }
};
seedDB();
export default sampleQuestions;