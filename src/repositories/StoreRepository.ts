import { BaseRepository } from './BaseRepository';
import { Store } from '../models/Store';

export class StoreRepository extends BaseRepository<Store> {
  constructor() {
    super(Store);
  }

  async findAllSortedByCreated(): Promise<Store[]> {
    return await this.model.findAll({ order: [['createdAt', 'DESC']] });
  }
}
