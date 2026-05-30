export class BaseRepository {
    constructor(model) {
        this.model = model;
    }

    async getAll() {
        return await this.model.find().lean();
    }

    async findOne(filter) {
        // XÓA HẾT maxTimeMS
        return await this.model.findOne(filter).lean();
    }

    async create(data) {
        const newItem = new this.model(data);
        return await newItem.save();
    }

    async update(id, data) {
        return await this.model.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id) {
        return await this.model.findByIdAndDelete(id);
    }
}