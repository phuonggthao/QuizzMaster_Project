import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    icon: { type: String },                     // Tên icon hiển thị ngoài Menu giao diện
    status: { type: Boolean, default: true }    // Trạng thái danh mục (true: đang mở, false: tạm khóa)
}, {
    collection: 'categories' // Ép chuẩn đồng bộ vào bảng tên 'categories' viết thường
});

export default mongoose.model('Category', CategorySchema);