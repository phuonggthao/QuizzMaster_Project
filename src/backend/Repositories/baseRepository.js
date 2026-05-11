export class BaseRepository {
    constructor(model) {
        this.model = model;
    }

    // Lấy tất cả dữ liệu
    async getAll() {
        return await this.model.find();
    }

    // Tìm một bản ghi theo điều kiện (Ví dụ tìm theo Username)
    async findOne(filter) {
        return await this.model.findOne(filter);
    }

    // Tạo mới dữ liệu (Dùng cho Đăng ký hoặc thêm Câu hỏi)
    async create(data) {
        const newItem = new this.model(data);
        return await newItem.save();
    }

    // Cập nhật dữ liệu
    async update(id, data) {
        return await this.model.findByIdAndUpdate(id, data, { new: true });
    }

    // Xóa dữ liệu
    async delete(id) {
        return await this.model.findByIdAndDelete(id);
    }
}