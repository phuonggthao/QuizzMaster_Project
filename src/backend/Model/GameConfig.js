import mongoose from 'mongoose';

const GameConfigSchema = new mongoose.Schema({
    gameType: { 
        type: String, 
        required: [true, 'Loại trò chơi là bắt buộc'], 
        unique: true,          // Đảm bảo mỗi game chỉ có 1 cấu hình duy nhất
        trim: true,            // Xóa khoảng trắng thừa
        index: true            // Đánh index để truy vấn theo gameType cực nhanh
    },
    basePoints: { 
        type: Number, 
        default: 10,
        min: [0, 'Điểm không được âm'] // Ràng buộc giá trị hợp lệ
    },
    bonusMultiplier: { 
        type: Number, 
        default: 1.5,
        min: [1, 'Hệ số nhân phải >= 1'] // Logic game: hệ số nhân < 1 sẽ làm giảm điểm
    },
    minLevelRequired: { 
        type: Number, 
        default: 1,
        min: [1, 'Cấp độ tối thiểu phải là 1']
    },
    isActive: { // Thêm trường này để dễ dàng tạm khóa 1 chế độ chơi mà không cần xóa config
        type: Boolean, 
        default: true 
    }
}, {
    timestamps: true,          // Tự động quản lý ngày tạo và cập nhật
    collection: 'gameconfigs'
});

export default mongoose.model('GameConfig', GameConfigSchema);