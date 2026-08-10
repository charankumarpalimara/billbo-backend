import { Model, Document, FilterQuery, UpdateQuery } from 'mongoose';

export class BaseRepository<T> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(item: Partial<T>): Promise<T> {
    const created = new this.model(item);
    return await created.save() as T;
  }

  async find(filter: FilterQuery<T> = {}): Promise<T[]> {
    return await this.model.find(filter).exec() as T[];
  }

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    return await this.model.findOne(filter).exec() as T | null;
  }

  async findById(id: string): Promise<T | null> {
    return await this.model.findById(id).exec() as T | null;
  }

  async update(id: string, item: UpdateQuery<T>): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, item, { new: true }).exec() as T | null;
  }

  async delete(id: string): Promise<T | null> {
    return await this.model.findByIdAndDelete(id).exec() as T | null;
  }

  async count(filter: FilterQuery<T> = {}): Promise<number> {
    return await this.model.countDocuments(filter).exec();
  }

  async findPaginated(filter: FilterQuery<T> = {}, page: number, limit: number): Promise<{ data: T[]; total: number }> {
    const skip = (page - 1) * limit;
    const total = await this.model.countDocuments(filter).exec();
    const data = await this.model.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).exec() as T[];
    return { data, total };
  }
}
