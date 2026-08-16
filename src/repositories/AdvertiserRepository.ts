import { BaseRepository } from './BaseRepository';
import { Advertiser } from '../models/Advertiser';

export class AdvertiserRepository extends BaseRepository<Advertiser> {
  constructor() {
    super(Advertiser);
  }

  async findAllSortedByCreated(): Promise<Advertiser[]> {
    return await this.model.findAll({ order: [['createdAt', 'DESC']] });
  }
}
