import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  icon: { type: String },                     // Icon hiển thị ngoài menu
  status: { type: Boolean, default: true }    // Đang mở hay đang khóa
});

export default mongoose.model('Category', CategorySchema);