import { StoreRepository } from '../repositories/StoreRepository';
import { TVRepository } from '../repositories/TVRepository';
import { IStore } from '../models/Store';

export class StoreService {
  private storeRepository = new StoreRepository();
  private tvRepository = new TVRepository();

  async getStores(): Promise<IStore[]> {
    return await this.storeRepository.findAllSortedByCreated();
  }

  async getStoresPaginated(page: number, limit: number): Promise<{ data: IStore[]; total: number }> {
    return await this.storeRepository.findPaginated({}, page, limit);
  }

  async createStore(data: Partial<IStore>): Promise<IStore> {
    const stores = await this.storeRepository.find({});
    let nextNum = 101;
    stores.forEach(s => {
      if (s.storeCode && s.storeCode.startsWith('STR_')) {
        const num = parseInt(s.storeCode.substring(4));
        if (!isNaN(num) && num >= nextNum) {
          nextNum = num + 1;
        }
      }
    });
    const code = `STR_${nextNum}`;
    return await this.storeRepository.create({ ...data, storeCode: code });
  }

  async deleteStore(id: string): Promise<IStore | null> {
    // Delete store and all associated TVs
    const store = await this.storeRepository.delete(id);
    if (store) {
      await this.tvRepository.deleteManyByStoreId(id);
    }
    return store;
  }

  async updateStore(id: string, data: Partial<IStore>): Promise<IStore | null> {
    return await this.storeRepository.update(id, data);
  }
}
