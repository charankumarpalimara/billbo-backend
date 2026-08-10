import { BaseRepository } from './BaseRepository';
import { Advertiser, IAdvertiser } from '../models/Advertiser';

export class AdvertiserRepository extends BaseRepository<IAdvertiser> {
  constructor() {
    super(Advertiser);
  }

  async findAllSortedByCreated(): Promise<IAdvertiser[]> {
    return await this.model.find().sort({ createdAt: -1 }).exec();
  }
}
