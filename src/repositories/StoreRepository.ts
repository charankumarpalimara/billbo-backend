import { BaseRepository } from './BaseRepository';
import { Store, IStore } from '../models/Store';

export class StoreRepository extends BaseRepository<IStore> {
  constructor() {
    super(Store);
  }

  async findAllSortedByCreated(): Promise<IStore[]> {
    return await this.model.find().sort({ createdAt: -1 }).exec();
  }
}
