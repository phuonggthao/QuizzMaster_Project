import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Tên danh mục là bắt buộc'], 
        unique: true,          // Tránh trùng lặp danh mục
        trim: true             // Tự động xóa khoảng trắng thừa ở 2 đầu
    },
    description: { 
        type: String, 
        trim: true 
    },
    icon: { 
        type: String 
    },
    status: { 
        type: Boolean, 
        default: true 
    }
}, {
    timestamps: true,          // TỰ ĐỘNG TẠO createdAt và updatedAt
    collection: 'categories'   // Ép chuẩn vào collection 'categories'
});

// Thêm Index cho trường name để tìm kiếm nhanh hơn
CategorySchema.index({ name: 1 });

export default mongoose.model('Category', CategorySchema);