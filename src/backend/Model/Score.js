import { mongoose } from '../../Api/mongoClient.js';

const ScoreSchema = new mongoose.Schema({
    username: { // Đổi userId thành username
        type: String,
        required: true,
        index: true 
    },
    gameType: { 
        type: String, 
        required: true, 
        index: true // Rất quan trọng: Để lọc Bảng xếp hạng theo từng loại game
    },
    points: { 
        type: Number, 
        required: true,
        index: true // Quan trọng: Để sắp xếp bảng xếp hạng theo điểm
    },
    accuracy: { 
        type: Number, 
        min: 0, 
        max: 100 // Giới hạn % chính xác
    },
    timeSpent: { 
        type: Number, // (giây)
        min: 0 
    },
    playedAt: { 
        type: Date, 
        default: Date.now,
        index: true // Để lọc bảng xếp hạng theo thời gian (ví dụ: Top tuần/tháng)
    }
}, {
    collection: 'scores'
});

// Thêm Compound Index để lấy Leaderboard cho từng game cực nhanh
// Cấu trúc: Lọc theo gameType -> Sắp xếp theo points (giảm dần) -> Lấy điểm gần nhất
ScoreSchema.index({ gameType: 1, points: -1, playedAt: -1 });

export default mongoose.model('Score', ScoreSchema);