import { BaseRepository } from './BaseRepository';
import { Ad, IAd } from '../models/Ad';

export class AdRepository extends BaseRepository<IAd> {
  constructor() {
    super(Ad);
  }

  async findAllWithAdvertiser(): Promise<IAd[]> {
    return await this.model.find().populate('advertiserId').sort({ createdAt: -1 }).exec();
  }

  async findPaginatedWithAdvertiser(page: number, limit: number): Promise<{ data: IAd[]; total: number }> {
    const skip = (page - 1) * limit;
    const total = await this.model.countDocuments({}).exec();
    const data = await this.model.find().populate('advertiserId').sort({ createdAt: -1 }).skip(skip).limit(limit).exec();
    return { data, total };
  }

  async findByIdPopulated(id: string): Promise<IAd | null> {
    return await this.model.findById(id).populate('advertiserId').exec();
  }
}
