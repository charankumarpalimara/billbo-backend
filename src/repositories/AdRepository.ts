import { BaseRepository } from './BaseRepository';
import { Ad } from '../models/Ad';
import { Advertiser } from '../models/Advertiser';

export class AdRepository extends BaseRepository<Ad> {
  constructor() {
    super(Ad);
  }

  async findAllWithAdvertiser(): Promise<Ad[]> {
    return await this.model.findAll({
      include: [{ model: Advertiser, as: 'advertiser' }],
      order: [['createdAt', 'DESC']]
    });
  }

  async findPaginatedWithAdvertiser(page: number, limit: number): Promise<{ data: Ad[]; total: number }> {
    const skip = (page - 1) * limit;
    const { rows, count } = await this.model.findAndCountAll({
      include: [{ model: Advertiser, as: 'advertiser' }],
      offset: skip,
      limit,
      order: [['createdAt', 'DESC']]
    });
    return { data: rows, total: count };
  }

  async findByIdPopulated(id: string | number): Promise<Ad | null> {
    return await this.model.findByPk(id, {
      include: [{ model: Advertiser, as: 'advertiser' }]
    });
  }
}
