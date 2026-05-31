export class BaseRepository {
    constructor(model) {
        this.model = model;
    }

    // Lấy tất cả, hỗ trợ lọc và sắp xếp nếu cần
    async getAll(filter = {}, sort = { createdAt: -1 }) {
        return await this.model.find(filter).sort(sort).lean();
    }

    // Tìm một bản ghi
    async findOne(filter) {
        return await this.model.findOne(filter).lean();
    }

    // Tìm theo ID
    async findById(id) {
        return await this.model.findById(id).lean();
    }

    // Tạo mới
    async create(data) {
        // Trả về object thuần để đồng bộ với .lean() ở các hàm khác
        const item = await this.model.create(data);
        return item.toObject(); 
    }

    // Cập nhật
    async update(id, data) {
        // Thêm { new: true } để trả về bản ghi sau khi đã update
        return await this.model.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
    }

    // Xóa
    async delete(id) {
        return await this.model.findByIdAndDelete(id);
    }
}