import mongoose from 'mongoose';
mongoose.set('debug', true);
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
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const sampleCategories = [
    { name: "Động Vật",    description: "Thế giới động vật muôn màu",         icon: "paw",        status: true },
    { name: "Địa Lý",      description: "Kiến thức địa lý thế giới",           icon: "globe",      status: true },
    { name: "Khoa Học",    description: "Khám phá thế giới tự nhiên",          icon: "flask",      status: true },
    { name: "Tiếng Anh",   description: "Rèn luyện từ vựng và ngữ pháp",      icon: "language",   status: true },
    { name: "Toán Học",    description: "Các câu hỏi logic, tính toán nhanh", icon: "calculator", status: true },
    { name: "Lịch Sử",     description: "Sự kiện lịch sử Việt Nam & thế giới",icon: "book",       status: true },
];

const sampleGameConfigs = [
    { gameType: "Quiz",        basePoints: 10, bonusMultiplier: 1.5, minLevelRequired: 1 },
    { gameType: "TrueFalse",   basePoints: 10, bonusMultiplier: 1.3, minLevelRequired: 1 },
    { gameType: "Flashcard",   basePoints: 10, bonusMultiplier: 1.2, minLevelRequired: 1 },
    { gameType: "WordScramble",basePoints: 10, bonusMultiplier: 1.5, minLevelRequired: 1 },
    { gameType: "FillInBlank", basePoints: 10, bonusMultiplier: 1.4, minLevelRequired: 1 },
    { gameType: "LuckyNumber", basePoints: 10, bonusMultiplier: 1.0, minLevelRequired: 1 },
    { gameType: "Matching",    basePoints: 10, bonusMultiplier: 1.5, minLevelRequired: 1 },
    { gameType: "OpenBox",     basePoints: 10, bonusMultiplier: 1.0, minLevelRequired: 1 },
    { gameType: "PictureQuiz", basePoints: 10, bonusMultiplier: 1.5, minLevelRequired: 1 },
    { gameType: "SimpleSpin",  basePoints: 10, bonusMultiplier: 1.0, minLevelRequired: 1 },
];

// ═══════════════════════════════════════════════════════════
// BỘ 1: ĐỘNG VẬT
// ═══════════════════════════════════════════════════════════
const dongVat = [
    // Quiz
    { gameType:"Quiz", category:"Động Vật", questionText:"Con vật nào được gọi là chúa tể rừng xanh?", options:["Hổ","Sư tử","Báo","Gấu"], correctAnswer:"Sư tử", difficulty:"Easy" },
    { gameType:"Quiz", category:"Động Vật", questionText:"Loài động vật nào lớn nhất trên cạn?", options:["Hà mã","Tê giác","Voi","Hươu cao cổ"], correctAnswer:"Voi", difficulty:"Easy" },
    { gameType:"Quiz", category:"Động Vật", questionText:"Cá voi thuộc nhóm động vật nào?", options:["Cá","Bò sát","Động vật có vú","Lưỡng cư"], correctAnswer:"Động vật có vú", difficulty:"Easy" },
    { gameType:"Quiz", category:"Động Vật", questionText:"Con vật nào có thể thay đổi màu sắc cơ thể?", options:["Tắc kè hoa","Kỳ nhông","Thằn lằn","Rắn"], correctAnswer:"Tắc kè hoa", difficulty:"Easy" },
    { gameType:"Quiz", category:"Động Vật", questionText:"Loài chim nào không biết bay?", options:["Đại bàng","Chim cánh cụt","Vẹt","Sếu"], correctAnswer:"Chim cánh cụt", difficulty:"Easy" },
    // TrueFalse
    { gameType:"TrueFalse", category:"Động Vật", questionText:"Cá heo là loài cá.", options:["Đúng","Sai"], correctAnswer:"Sai", difficulty:"Easy" },
    { gameType:"TrueFalse", category:"Động Vật", questionText:"Đà điểu là loài chim lớn nhất thế giới.", options:["Đúng","Sai"], correctAnswer:"Đúng", difficulty:"Easy" },
    { gameType:"TrueFalse", category:"Động Vật", questionText:"Bạch tuộc có 8 xúc tu.", options:["Đúng","Sai"], correctAnswer:"Đúng", difficulty:"Easy" },
    { gameType:"TrueFalse", category:"Động Vật", questionText:"Hổ là loài động vật ăn cỏ.", options:["Đúng","Sai"], correctAnswer:"Sai", difficulty:"Easy" },
    { gameType:"TrueFalse", category:"Động Vật", questionText:"Dơi là loài thú duy nhất biết bay.", options:["Đúng","Sai"], correctAnswer:"Đúng", difficulty:"Medium" },
    // Flashcard
    { gameType:"Flashcard", category:"Động Vật", questionText:"\"Con voi\" trong tiếng Anh là gì?", correctAnswer:"Elephant", difficulty:"Easy" },
    { gameType:"Flashcard", category:"Động Vật", questionText:"\"Con hổ\" trong tiếng Anh là gì?", correctAnswer:"Tiger", difficulty:"Easy" },
    { gameType:"Flashcard", category:"Động Vật", questionText:"\"Con cá\" trong tiếng Anh là gì?", correctAnswer:"Fish", difficulty:"Easy" },
    { gameType:"Flashcard", category:"Động Vật", questionText:"\"Con chim\" trong tiếng Anh là gì?", correctAnswer:"Bird", difficulty:"Easy" },
    { gameType:"Flashcard", category:"Động Vật", questionText:"\"Con rắn\" trong tiếng Anh là gì?", correctAnswer:"Snake", difficulty:"Easy" },
    // WordScramble
    { gameType:"WordScramble", category:"Động Vật", questionText:"Sắp xếp lại thành tên động vật tiếng Anh:", correctAnswer:"TIGER",    difficulty:"Easy" },
    { gameType:"WordScramble", category:"Động Vật", questionText:"Sắp xếp lại thành tên động vật tiếng Anh:", correctAnswer:"RABBIT",   difficulty:"Easy" },
    { gameType:"WordScramble", category:"Động Vật", questionText:"Sắp xếp lại thành tên động vật tiếng Anh:", correctAnswer:"MONKEY",   difficulty:"Easy" },
    { gameType:"WordScramble", category:"Động Vật", questionText:"Sắp xếp lại thành tên động vật tiếng Anh:", correctAnswer:"DOLPHIN",  difficulty:"Medium" },
    { gameType:"WordScramble", category:"Động Vật", questionText:"Sắp xếp lại thành tên động vật tiếng Anh:", correctAnswer:"ELEPHANT", difficulty:"Hard" },
    // FillInBlank
    { gameType:"FillInBlank", category:"Động Vật", questionText:"Con ___ là loài động vật lớn nhất trên cạn.", correctAnswer:"voi", difficulty:"Easy" },
    { gameType:"FillInBlank", category:"Động Vật", questionText:"Chim cánh cụt sống ở vùng ___.", correctAnswer:"Nam Cực", difficulty:"Easy" },
    { gameType:"FillInBlank", category:"Động Vật", questionText:"Con ___ có thể sống cả trên cạn lẫn dưới nước.", correctAnswer:"ếch", difficulty:"Easy" },
    { gameType:"FillInBlank", category:"Động Vật", questionText:"Loài chim nào được mệnh danh là \"vua bầu trời\"? Con ___.", correctAnswer:"đại bàng", difficulty:"Medium" },
    { gameType:"FillInBlank", category:"Động Vật", questionText:"Bạch tuộc có ___ xúc tu.", correctAnswer:"8", difficulty:"Easy" },
];

// ═══════════════════════════════════════════════════════════
// BỘ 2: ĐỊA LÝ
// ═══════════════════════════════════════════════════════════
const diaLy = [
    // Quiz
    { gameType:"Quiz", category:"Địa Lý", questionText:"Thủ đô của Việt Nam là gì?", options:["TP.HCM","Đà Nẵng","Hà Nội","Huế"], correctAnswer:"Hà Nội", difficulty:"Easy" },
    { gameType:"Quiz", category:"Địa Lý", questionText:"Quốc gia nào có diện tích lớn nhất thế giới?", options:["Trung Quốc","Mỹ","Canada","Nga"], correctAnswer:"Nga", difficulty:"Easy" },
    { gameType:"Quiz", category:"Địa Lý", questionText:"Sông nào dài nhất thế giới?", options:["Amazon","Nile","Mekong","Mississippi"], correctAnswer:"Nile", difficulty:"Medium" },
    { gameType:"Quiz", category:"Địa Lý", questionText:"Núi nào cao nhất thế giới?", options:["K2","Everest","Kilimanjaro","Mont Blanc"], correctAnswer:"Everest", difficulty:"Easy" },
    { gameType:"Quiz", category:"Địa Lý", questionText:"Thủ đô của Nhật Bản là gì?", options:["Osaka","Kyoto","Tokyo","Hiroshima"], correctAnswer:"Tokyo", difficulty:"Easy" },
    { gameType:"Quiz", category:"Địa Lý", questionText:"Châu lục nào lớn nhất thế giới?", options:["Châu Phi","Châu Mỹ","Châu Âu","Châu Á"], correctAnswer:"Châu Á", difficulty:"Easy" },
    // TrueFalse
    { gameType:"TrueFalse", category:"Địa Lý", questionText:"Hà Nội là thủ đô của Việt Nam.", options:["Đúng","Sai"], correctAnswer:"Đúng", difficulty:"Easy" },
    { gameType:"TrueFalse", category:"Địa Lý", questionText:"Úc vừa là quốc gia vừa là châu lục.", options:["Đúng","Sai"], correctAnswer:"Đúng", difficulty:"Easy" },
    { gameType:"TrueFalse", category:"Địa Lý", questionText:"Sông Amazon nằm ở châu Phi.", options:["Đúng","Sai"], correctAnswer:"Sai", difficulty:"Easy" },
    { gameType:"TrueFalse", category:"Địa Lý", questionText:"Nhật Bản là quốc đảo.", options:["Đúng","Sai"], correctAnswer:"Đúng", difficulty:"Easy" },
    { gameType:"TrueFalse", category:"Địa Lý", questionText:"Thủ đô của Úc là Sydney.", options:["Đúng","Sai"], correctAnswer:"Sai", difficulty:"Medium" },
    // Flashcard
    { gameType:"Flashcard", category:"Địa Lý", questionText:"\"Núi lửa\" trong tiếng Anh là gì?", correctAnswer:"Volcano", difficulty:"Easy" },
    { gameType:"Flashcard", category:"Địa Lý", questionText:"\"Đại dương\" trong tiếng Anh là gì?", correctAnswer:"Ocean", difficulty:"Easy" },
    { gameType:"Flashcard", category:"Địa Lý", questionText:"\"Thủ đô\" trong tiếng Anh là gì?", correctAnswer:"Capital", difficulty:"Easy" },
    { gameType:"Flashcard", category:"Địa Lý", questionText:"\"Bán đảo\" trong tiếng Anh là gì?", correctAnswer:"Peninsula", difficulty:"Medium" },
    { gameType:"Flashcard", category:"Địa Lý", questionText:"\"Hoang mạc\" trong tiếng Anh là gì?", correctAnswer:"Desert", difficulty:"Easy" },
    // WordScramble
    { gameType:"WordScramble", category:"Địa Lý", questionText:"Sắp xếp lại thành tên địa danh tiếng Anh:", correctAnswer:"OCEAN",    difficulty:"Easy" },
    { gameType:"WordScramble", category:"Địa Lý", questionText:"Sắp xếp lại thành tên địa danh tiếng Anh:", correctAnswer:"DESERT",   difficulty:"Easy" },
    { gameType:"WordScramble", category:"Địa Lý", questionText:"Sắp xếp lại thành tên địa danh tiếng Anh:", correctAnswer:"ISLAND",   difficulty:"Easy" },
    { gameType:"WordScramble", category:"Địa Lý", questionText:"Sắp xếp lại thành tên địa danh tiếng Anh:", correctAnswer:"VOLCANO",  difficulty:"Medium" },
    { gameType:"WordScramble", category:"Địa Lý", questionText:"Sắp xếp lại thành tên địa danh tiếng Anh:", correctAnswer:"MOUNTAIN", difficulty:"Medium" },
    // FillInBlank
    { gameType:"FillInBlank", category:"Địa Lý", questionText:"Thủ đô của Pháp là ___.", correctAnswer:"Paris", difficulty:"Easy" },
    { gameType:"FillInBlank", category:"Địa Lý", questionText:"Thủ đô của Mỹ là ___.", correctAnswer:"Washington", difficulty:"Easy" },
    { gameType:"FillInBlank", category:"Địa Lý", questionText:"Thủ đô của Anh là ___.", correctAnswer:"London", difficulty:"Easy" },
    { gameType:"FillInBlank", category:"Địa Lý", questionText:"Thủ đô của Trung Quốc là ___.", correctAnswer:"Bắc Kinh", difficulty:"Easy" },
    { gameType:"FillInBlank", category:"Địa Lý", questionText:"Núi ___ là ngọn núi cao nhất thế giới.", correctAnswer:"Everest", difficulty:"Easy" },
];

// ═══════════════════════════════════════════════════════════
// BỘ 3: KHOA HỌC
// ═══════════════════════════════════════════════════════════
const khoaHoc = [
    // Quiz
    { gameType:"Quiz", category:"Khoa Học", questionText:"Hành tinh nào lớn nhất trong hệ Mặt Trời?", options:["Sao Thổ","Sao Mộc","Sao Hải Vương","Trái Đất"], correctAnswer:"Sao Mộc", difficulty:"Easy" },
    { gameType:"Quiz", category:"Khoa Học", questionText:"Công thức hóa học của nước là gì?", options:["CO2","H2O","NaCl","O2"], correctAnswer:"H2O", difficulty:"Easy" },
    { gameType:"Quiz", category:"Khoa Học", questionText:"Tốc độ ánh sáng xấp xỉ bao nhiêu km/s?", options:["100.000","200.000","300.000","400.000"], correctAnswer:"300.000", difficulty:"Medium" },
    { gameType:"Quiz", category:"Khoa Học", questionText:"Nguyên tố nào chiếm nhiều nhất trong không khí?", options:["Oxy","Carbon","Nitơ","Hydro"], correctAnswer:"Nitơ", difficulty:"Medium" },
    { gameType:"Quiz", category:"Khoa Học", questionText:"Nhiệt độ sôi của nước ở điều kiện tiêu chuẩn là bao nhiêu?", options:["90°C","95°C","100°C","105°C"], correctAnswer:"100°C", difficulty:"Easy" },
    { gameType:"Quiz", category:"Khoa Học", questionText:"Hành tinh nào gần Mặt Trời nhất?", options:["Sao Kim","Trái Đất","Sao Thủy","Sao Hỏa"], correctAnswer:"Sao Thủy", difficulty:"Easy" },
    // TrueFalse
    { gameType:"TrueFalse", category:"Khoa Học", questionText:"Trái Đất quay quanh Mặt Trời.", options:["Đúng","Sai"], correctAnswer:"Đúng", difficulty:"Easy" },
    { gameType:"TrueFalse", category:"Khoa Học", questionText:"Mặt Trăng tự phát ra ánh sáng.", options:["Đúng","Sai"], correctAnswer:"Sai", difficulty:"Easy" },
    { gameType:"TrueFalse", category:"Khoa Học", questionText:"Kim cương là dạng thù hình của carbon.", options:["Đúng","Sai"], correctAnswer:"Đúng", difficulty:"Medium" },
    { gameType:"TrueFalse", category:"Khoa Học", questionText:"Âm thanh truyền nhanh hơn ánh sáng.", options:["Đúng","Sai"], correctAnswer:"Sai", difficulty:"Medium" },
    { gameType:"TrueFalse", category:"Khoa Học", questionText:"Oxy chiếm khoảng 21% không khí.", options:["Đúng","Sai"], correctAnswer:"Đúng", difficulty:"Medium" },
    // Flashcard
    { gameType:"Flashcard", category:"Khoa Học", questionText:"\"Quang hợp\" trong tiếng Anh là gì?", correctAnswer:"Photosynthesis", difficulty:"Medium" },
    { gameType:"Flashcard", category:"Khoa Học", questionText:"\"Trọng lực\" trong tiếng Anh là gì?", correctAnswer:"Gravity", difficulty:"Easy" },
    { gameType:"Flashcard", category:"Khoa Học", questionText:"\"Nguyên tử\" trong tiếng Anh là gì?", correctAnswer:"Atom", difficulty:"Easy" },
    { gameType:"Flashcard", category:"Khoa Học", questionText:"\"Năng lượng\" trong tiếng Anh là gì?", correctAnswer:"Energy", difficulty:"Easy" },
    { gameType:"Flashcard", category:"Khoa Học", questionText:"\"Phân tử\" trong tiếng Anh là gì?", correctAnswer:"Molecule", difficulty:"Medium" },
    // WordScramble
    { gameType:"WordScramble", category:"Khoa Học", questionText:"Sắp xếp lại thành thuật ngữ khoa học tiếng Anh:", correctAnswer:"ENERGY",   difficulty:"Easy" },
    { gameType:"WordScramble", category:"Khoa Học", questionText:"Sắp xếp lại thành thuật ngữ khoa học tiếng Anh:", correctAnswer:"GRAVITY",  difficulty:"Medium" },
    { gameType:"WordScramble", category:"Khoa Học", questionText:"Sắp xếp lại thành thuật ngữ khoa học tiếng Anh:", correctAnswer:"OXYGEN",   difficulty:"Easy" },
    { gameType:"WordScramble", category:"Khoa Học", questionText:"Sắp xếp lại thành thuật ngữ khoa học tiếng Anh:", correctAnswer:"PLANET",   difficulty:"Easy" },
    { gameType:"WordScramble", category:"Khoa Học", questionText:"Sắp xếp lại thành thuật ngữ khoa học tiếng Anh:", correctAnswer:"SCIENCE",  difficulty:"Medium" },
    // FillInBlank
    { gameType:"FillInBlank", category:"Khoa Học", questionText:"Công thức hóa học của nước là ___.", correctAnswer:"H2O", difficulty:"Easy" },
    { gameType:"FillInBlank", category:"Khoa Học", questionText:"Công thức hóa học của muối ăn là ___.", correctAnswer:"NaCl", difficulty:"Medium" },
    { gameType:"FillInBlank", category:"Khoa Học", questionText:"Hành tinh gần Mặt Trời nhất là ___.", correctAnswer:"Sao Thủy", difficulty:"Easy" },
    { gameType:"FillInBlank", category:"Khoa Học", questionText:"Nguyên tố có ký hiệu O là ___.", correctAnswer:"Oxy", difficulty:"Easy" },
    { gameType:"FillInBlank", category:"Khoa Học", questionText:"Nhiệt độ sôi của nước là ___ độ C.", correctAnswer:"100", difficulty:"Easy" },
];

// ═══════════════════════════════════════════════════════════
// BỘ 4: TIẾNG ANH
// ═══════════════════════════════════════════════════════════
const tiengAnh = [
    // Quiz
    { gameType:"Quiz", category:"Tiếng Anh", questionText:"\"Friendship\" có nghĩa là gì?", options:["Tình yêu","Tình bạn","Gia đình","Đồng nghiệp"], correctAnswer:"Tình bạn", difficulty:"Easy" },
    { gameType:"Quiz", category:"Tiếng Anh", questionText:"Thì hiện tại hoàn thành dùng trợ động từ nào?", options:["do/does","did","have/has","will"], correctAnswer:"have/has", difficulty:"Medium" },
    { gameType:"Quiz", category:"Tiếng Anh", questionText:"\"Photosynthesis\" là quá trình gì?", options:["Hô hấp","Quang hợp","Tiêu hóa","Tuần hoàn"], correctAnswer:"Quang hợp", difficulty:"Medium" },
    { gameType:"Quiz", category:"Tiếng Anh", questionText:"Từ nào là tính từ: \"She runs quickly\"?", options:["She","runs","quickly","Không có"], correctAnswer:"Không có", difficulty:"Medium" },
    { gameType:"Quiz", category:"Tiếng Anh", questionText:"\"Enormous\" có nghĩa là gì?", options:["Nhỏ bé","Khổng lồ","Bình thường","Đẹp đẽ"], correctAnswer:"Khổng lồ", difficulty:"Medium" },
    { gameType:"Quiz", category:"Tiếng Anh", questionText:"Dạng quá khứ của \"go\" là gì?", options:["goed","goes","went","gone"], correctAnswer:"went", difficulty:"Easy" },
    // TrueFalse
    { gameType:"TrueFalse", category:"Tiếng Anh", questionText:"\"Run\" là một động từ bất quy tắc.", options:["Đúng","Sai"], correctAnswer:"Đúng", difficulty:"Easy" },
    { gameType:"TrueFalse", category:"Tiếng Anh", questionText:"\"Informations\" là dạng số nhiều đúng của \"information\".", options:["Đúng","Sai"], correctAnswer:"Sai", difficulty:"Medium" },
    { gameType:"TrueFalse", category:"Tiếng Anh", questionText:"\"Beautiful\" là một tính từ.", options:["Đúng","Sai"], correctAnswer:"Đúng", difficulty:"Easy" },
    { gameType:"TrueFalse", category:"Tiếng Anh", questionText:"\"She don't like coffee\" là câu đúng ngữ pháp.", options:["Đúng","Sai"], correctAnswer:"Sai", difficulty:"Easy" },
    { gameType:"TrueFalse", category:"Tiếng Anh", questionText:"\"Quickly\" là một trạng từ.", options:["Đúng","Sai"], correctAnswer:"Đúng", difficulty:"Easy" },
    // Flashcard
    { gameType:"Flashcard", category:"Tiếng Anh", questionText:"\"Xin chào\" trong tiếng Anh là gì?", correctAnswer:"Hello", difficulty:"Easy" },
    { gameType:"Flashcard", category:"Tiếng Anh", questionText:"\"Cảm ơn\" trong tiếng Anh là gì?", correctAnswer:"Thank you", difficulty:"Easy" },
    { gameType:"Flashcard", category:"Tiếng Anh", questionText:"\"Bệnh viện\" trong tiếng Anh là gì?", correctAnswer:"Hospital", difficulty:"Easy" },
    { gameType:"Flashcard", category:"Tiếng Anh", questionText:"\"Sân bay\" trong tiếng Anh là gì?", correctAnswer:"Airport", difficulty:"Easy" },
    { gameType:"Flashcard", category:"Tiếng Anh", questionText:"\"Máy tính\" trong tiếng Anh là gì?", correctAnswer:"Computer", difficulty:"Easy" },
    // WordScramble
    { gameType:"WordScramble", category:"Tiếng Anh", questionText:"Sắp xếp lại thành từ tiếng Anh đúng:", correctAnswer:"SCHOOL",   difficulty:"Easy" },
    { gameType:"WordScramble", category:"Tiếng Anh", questionText:"Sắp xếp lại thành từ tiếng Anh đúng:", correctAnswer:"FRIEND",   difficulty:"Easy" },
    { gameType:"WordScramble", category:"Tiếng Anh", questionText:"Sắp xếp lại thành từ tiếng Anh đúng:", correctAnswer:"LIBRARY",  difficulty:"Medium" },
    { gameType:"WordScramble", category:"Tiếng Anh", questionText:"Sắp xếp lại thành từ tiếng Anh đúng:", correctAnswer:"COMPUTER", difficulty:"Hard" },
    { gameType:"WordScramble", category:"Tiếng Anh", questionText:"Sắp xếp lại thành từ tiếng Anh đúng:", correctAnswer:"LANGUAGE", difficulty:"Hard" },
    // FillInBlank
    { gameType:"FillInBlank", category:"Tiếng Anh", questionText:"\"___ are you?\" — \"I am fine, thank you.\"", correctAnswer:"How", difficulty:"Easy" },
    { gameType:"FillInBlank", category:"Tiếng Anh", questionText:"Ngôn ngữ lập trình ___ dùng để phát triển React Native.", correctAnswer:"JavaScript", difficulty:"Medium" },
    { gameType:"FillInBlank", category:"Tiếng Anh", questionText:"\"She ___ to school every day.\" (go)", correctAnswer:"goes", difficulty:"Easy" },
    { gameType:"FillInBlank", category:"Tiếng Anh", questionText:"\"I have ___ eating lunch.\" (just)", correctAnswer:"just", difficulty:"Medium" },
    { gameType:"FillInBlank", category:"Tiếng Anh", questionText:"Dạng quá khứ của \"eat\" là ___.", correctAnswer:"ate", difficulty:"Easy" },
];

// ═══════════════════════════════════════════════════════════
// BỘ 5: TOÁN HỌC
// ═══════════════════════════════════════════════════════════
const toanHoc = [
    // Quiz
    { gameType:"Quiz", category:"Toán Học", questionText:"Kết quả của 15 + 7 × 2 là bao nhiêu?", options:["44","29","34","19"], correctAnswer:"29", difficulty:"Easy" },
    { gameType:"Quiz", category:"Toán Học", questionText:"Số nguyên tố nào nhỏ hơn 10?", options:["4","6","7","9"], correctAnswer:"7", difficulty:"Easy" },
    { gameType:"Quiz", category:"Toán Học", questionText:"Căn bậc hai của 144 là bao nhiêu?", options:["10","11","12","13"], correctAnswer:"12", difficulty:"Medium" },
    { gameType:"Quiz", category:"Toán Học", questionText:"2³ + 3² bằng bao nhiêu?", options:["13","17","15","19"], correctAnswer:"17", difficulty:"Medium" },
    { gameType:"Quiz", category:"Toán Học", questionText:"Diện tích hình tròn bán kính r là?", options:["2πr","πr²","πr","2πr²"], correctAnswer:"πr²", difficulty:"Medium" },
    { gameType:"Quiz", category:"Toán Học", questionText:"Tổng các góc trong một tam giác bằng bao nhiêu độ?", options:["90°","180°","270°","360°"], correctAnswer:"180°", difficulty:"Easy" },
    // TrueFalse
    { gameType:"TrueFalse", category:"Toán Học", questionText:"Số Pi xấp xỉ bằng 3.14.", options:["Đúng","Sai"], correctAnswer:"Đúng", difficulty:"Easy" },
    { gameType:"TrueFalse", category:"Toán Học", questionText:"0 là số nguyên tố.", options:["Đúng","Sai"], correctAnswer:"Sai", difficulty:"Easy" },
    { gameType:"TrueFalse", category:"Toán Học", questionText:"Tổng các góc trong tam giác bằng 180 độ.", options:["Đúng","Sai"], correctAnswer:"Đúng", difficulty:"Easy" },
    { gameType:"TrueFalse", category:"Toán Học", questionText:"Số âm không thể là số nguyên.", options:["Đúng","Sai"], correctAnswer:"Sai", difficulty:"Easy" },
    { gameType:"TrueFalse", category:"Toán Học", questionText:"Căn bậc hai của 100 là 10.", options:["Đúng","Sai"], correctAnswer:"Đúng", difficulty:"Easy" },
    // Flashcard
    { gameType:"Flashcard", category:"Toán Học", questionText:"\"Phương trình\" trong tiếng Anh là gì?", correctAnswer:"Equation", difficulty:"Easy" },
    { gameType:"Flashcard", category:"Toán Học", questionText:"\"Hình học\" trong tiếng Anh là gì?", correctAnswer:"Geometry", difficulty:"Easy" },
    { gameType:"Flashcard", category:"Toán Học", questionText:"\"Số nguyên tố\" trong tiếng Anh là gì?", correctAnswer:"Prime number", difficulty:"Medium" },
    { gameType:"Flashcard", category:"Toán Học", questionText:"\"Phân số\" trong tiếng Anh là gì?", correctAnswer:"Fraction", difficulty:"Easy" },
    { gameType:"Flashcard", category:"Toán Học", questionText:"\"Căn bậc hai\" trong tiếng Anh là gì?", correctAnswer:"Square root", difficulty:"Medium" },
    // WordScramble
    { gameType:"WordScramble", category:"Toán Học", questionText:"Sắp xếp lại thành thuật ngữ toán học tiếng Anh:", correctAnswer:"NUMBER",   difficulty:"Easy" },
    { gameType:"WordScramble", category:"Toán Học", questionText:"Sắp xếp lại thành thuật ngữ toán học tiếng Anh:", correctAnswer:"CIRCLE",   difficulty:"Easy" },
    { gameType:"WordScramble", category:"Toán Học", questionText:"Sắp xếp lại thành thuật ngữ toán học tiếng Anh:", correctAnswer:"TRIANGLE", difficulty:"Medium" },
    { gameType:"WordScramble", category:"Toán Học", questionText:"Sắp xếp lại thành thuật ngữ toán học tiếng Anh:", correctAnswer:"FRACTION", difficulty:"Medium" },
    { gameType:"WordScramble", category:"Toán Học", questionText:"Sắp xếp lại thành thuật ngữ toán học tiếng Anh:", correctAnswer:"EQUATION", difficulty:"Hard" },
    // FillInBlank
    { gameType:"FillInBlank", category:"Toán Học", questionText:"Số Pi có giá trị xấp xỉ ___.", correctAnswer:"3.14", difficulty:"Easy" },
    { gameType:"FillInBlank", category:"Toán Học", questionText:"Căn bậc hai của 81 là ___.", correctAnswer:"9", difficulty:"Easy" },
    { gameType:"FillInBlank", category:"Toán Học", questionText:"Tổng các góc trong tam giác là ___ độ.", correctAnswer:"180", difficulty:"Easy" },
    { gameType:"FillInBlank", category:"Toán Học", questionText:"2 mũ 10 bằng ___.", correctAnswer:"1024", difficulty:"Hard" },
    { gameType:"FillInBlank", category:"Toán Học", questionText:"Diện tích hình vuông cạnh 5 là ___.", correctAnswer:"25", difficulty:"Easy" },
];

// ═══════════════════════════════════════════════════════════
// BỘ 6: LỊCH SỬ
// ═══════════════════════════════════════════════════════════
const lichSu = [
    // Quiz
    { gameType:"Quiz", category:"Lịch Sử", questionText:"Việt Nam giành độc lập năm nào?", options:["1945","1954","1975","1930"], correctAnswer:"1945", difficulty:"Easy" },
    { gameType:"Quiz", category:"Lịch Sử", questionText:"Ai là chủ tịch đầu tiên của nước Việt Nam?", options:["Võ Nguyên Giáp","Hồ Chí Minh","Trường Chinh","Phạm Văn Đồng"], correctAnswer:"Hồ Chí Minh", difficulty:"Easy" },
    { gameType:"Quiz", category:"Lịch Sử", questionText:"Chiến tranh thế giới thứ 2 kết thúc năm nào?", options:["1943","1944","1945","1946"], correctAnswer:"1945", difficulty:"Easy" },
    { gameType:"Quiz", category:"Lịch Sử", questionText:"Thế chiến thứ nhất bắt đầu năm nào?", options:["1910","1912","1914","1916"], correctAnswer:"1914", difficulty:"Easy" },
    { gameType:"Quiz", category:"Lịch Sử", questionText:"Ai phát minh ra bóng đèn điện?", options:["Newton","Edison","Einstein","Tesla"], correctAnswer:"Edison", difficulty:"Easy" },
    { gameType:"Quiz", category:"Lịch Sử", questionText:"Vạn Lý Trường Thành nằm ở quốc gia nào?", options:["Nhật Bản","Hàn Quốc","Trung Quốc","Mông Cổ"], correctAnswer:"Trung Quốc", difficulty:"Easy" },
    // TrueFalse
    { gameType:"TrueFalse", category:"Lịch Sử", questionText:"Hồ Chí Minh đọc Tuyên ngôn Độc lập năm 1945.", options:["Đúng","Sai"], correctAnswer:"Đúng", difficulty:"Easy" },
    { gameType:"TrueFalse", category:"Lịch Sử", questionText:"Thế chiến thứ nhất bắt đầu năm 1939.", options:["Đúng","Sai"], correctAnswer:"Sai", difficulty:"Easy" },
    { gameType:"TrueFalse", category:"Lịch Sử", questionText:"Edison phát minh ra điện thoại.", options:["Đúng","Sai"], correctAnswer:"Sai", difficulty:"Medium" },
    { gameType:"TrueFalse", category:"Lịch Sử", questionText:"Vạn Lý Trường Thành là một trong 7 kỳ quan thế giới.", options:["Đúng","Sai"], correctAnswer:"Đúng", difficulty:"Easy" },
    { gameType:"TrueFalse", category:"Lịch Sử", questionText:"Việt Nam thống nhất năm 1975.", options:["Đúng","Sai"], correctAnswer:"Đúng", difficulty:"Easy" },
    // Flashcard
    { gameType:"Flashcard", category:"Lịch Sử", questionText:"\"Cách mạng\" trong tiếng Anh là gì?", correctAnswer:"Revolution", difficulty:"Medium" },
    { gameType:"Flashcard", category:"Lịch Sử", questionText:"\"Độc lập\" trong tiếng Anh là gì?", correctAnswer:"Independence", difficulty:"Easy" },
    { gameType:"Flashcard", category:"Lịch Sử", questionText:"\"Chiến tranh\" trong tiếng Anh là gì?", correctAnswer:"War", difficulty:"Easy" },
    { gameType:"Flashcard", category:"Lịch Sử", questionText:"\"Hòa bình\" trong tiếng Anh là gì?", correctAnswer:"Peace", difficulty:"Easy" },
    { gameType:"Flashcard", category:"Lịch Sử", questionText:"\"Lịch sử\" trong tiếng Anh là gì?", correctAnswer:"History", difficulty:"Easy" },
    // WordScramble
    { gameType:"WordScramble", category:"Lịch Sử", questionText:"Sắp xếp lại thành từ lịch sử tiếng Anh:", correctAnswer:"HISTORY",     difficulty:"Medium" },
    { gameType:"WordScramble", category:"Lịch Sử", questionText:"Sắp xếp lại thành từ lịch sử tiếng Anh:", correctAnswer:"PEACE",       difficulty:"Easy" },
    { gameType:"WordScramble", category:"Lịch Sử", questionText:"Sắp xếp lại thành từ lịch sử tiếng Anh:", correctAnswer:"EMPIRE",      difficulty:"Medium" },
    { gameType:"WordScramble", category:"Lịch Sử", questionText:"Sắp xếp lại thành từ lịch sử tiếng Anh:", correctAnswer:"FREEDOM",     difficulty:"Medium" },
    { gameType:"WordScramble", category:"Lịch Sử", questionText:"Sắp xếp lại thành từ lịch sử tiếng Anh:", correctAnswer:"REVOLUTION",  difficulty:"Hard" },
    // FillInBlank
    { gameType:"FillInBlank", category:"Lịch Sử", questionText:"Việt Nam tuyên bố độc lập năm ___.", correctAnswer:"1945", difficulty:"Easy" },
    { gameType:"FillInBlank", category:"Lịch Sử", questionText:"Chủ tịch Hồ Chí Minh sinh năm ___.", correctAnswer:"1890", difficulty:"Medium" },
    { gameType:"FillInBlank", category:"Lịch Sử", questionText:"Thế chiến thứ ___ bắt đầu năm 1939.", correctAnswer:"2", difficulty:"Easy" },
    { gameType:"FillInBlank", category:"Lịch Sử", questionText:"___ phát minh ra bóng đèn điện.", correctAnswer:"Edison", difficulty:"Easy" },
    { gameType:"FillInBlank", category:"Lịch Sử", questionText:"Việt Nam thống nhất vào năm ___.", correctAnswer:"1975", difficulty:"Easy" },
];

// ═══════════════════════════════════════════════════════════
// LUCKY NUMBER (dùng chung)
// ═══════════════════════════════════════════════════════════
const luckyNumber = [
    { gameType:"LuckyNumber", category:"Logic", questionText:"Chọn số may mắn từ 1 đến 10!", correctAnswer:"7", difficulty:"Easy" },
    { gameType:"LuckyNumber", category:"Logic", questionText:"Thử vận may — chọn một con số!", correctAnswer:"3", difficulty:"Easy" },
    { gameType:"LuckyNumber", category:"Logic", questionText:"Con số nào sẽ mang lại may mắn?", correctAnswer:"5", difficulty:"Easy" },
];

const sampleQuestions = [
    ...dongVat,
    ...diaLy,
    ...khoaHoc,
    ...tiengAnh,
    ...toanHoc,
    ...lichSu,
    ...luckyNumber,
];

const seedDB = async () => {
    try {
        const directURI = "mongodb://admin:123456ABC@ac-1jjcnit-shard-00-00.rivxhf9.mongodb.net:27017,ac-1jjcnit-shard-00-01.rivxhf9.mongodb.net:27017,ac-1jjcnit-shard-00-02.rivxhf9.mongodb.net:27017/QuizzMaster?ssl=true&replicaSet=atlas-dz725f-shard-0&authSource=admin&appName=ClusterQuizzMaster";

        // Cấu hình để kết nối nhanh nhất có thể
        await mongoose.connect(directURI, { 
            serverSelectionTimeoutMS: 30000,
            autoIndex: false // TẮT autoIndex để tránh xung đột
        });
        console.log("⚡ Đã kết nối MongoDB Atlas thành công!");

        // Xóa toàn bộ database cũ (nhanh hơn deleteMany)
        const db = mongoose.connection.db;
        await db.dropDatabase(); 
        console.log("🧹 Đã drop toàn bộ database cũ.");

        await Category.insertMany(sampleCategories);
        await GameConfig.insertMany(sampleGameConfigs);
        await Question.insertMany(sampleQuestions);

        const total = await Question.countDocuments();
        console.log(\n🎉 Đã nạp thành công  câu hỏi vào MongoDB!\n);
        console.log("📦 Phân bổ theo bộ chủ đề:");
        for (const cat of ["Động Vật","Địa Lý","Khoa Học","Tiếng Anh","Toán Học","Lịch Sử"]) {
            const n = await Question.countDocuments({ category: cat });
            console.log(   :  câu);
        }
        console.log("\n🎮 Phân bổ theo loại game:");
        for (const g of ["Quiz","TrueFalse","Flashcard","WordScramble","FillInBlank","LuckyNumber"]) {
            const n = await Question.countDocuments({ gameType: g });
            console.log(   :  câu);
        }

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error("❌ Lỗi nạp dữ liệu:", error.message);
        process.exit(1);
    }
};

seedDB();
