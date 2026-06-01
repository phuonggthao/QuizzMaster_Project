import { mongoose } from '../../Api/mongoClient.js';

const CategorySchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Tên danh mục là bắt buộc'], 
        unique: true,          // Tự động tạo Index unique cho 'name'
        trim: true 
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
    timestamps: true,
    collection: 'categories'
});

// XÓA DÒNG CategorySchema.index({ name: 1 }); ĐI
// Vì 'unique: true' ở trên đã làm công việc đó rồi.

export default mongoose.model('Category', CategorySchema);