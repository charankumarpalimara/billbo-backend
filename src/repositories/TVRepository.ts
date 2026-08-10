import { BaseRepository } from './BaseRepository';
import { TV, ITV } from '../models/TV';

export class TVRepository extends BaseRepository<ITV> {
  constructor() {
    super(TV);
  }

  async findByStoreId(storeId: string): Promise<ITV[]> {
    return await this.model.find({ storeId }).exec();
  }

  async findByTvCode(tvCode: string): Promise<ITV | null> {
    return await this.model.findOne({ tvCode }).exec();
  }

  async deleteManyByStoreId(storeId: string): Promise<any> {
    return await this.model.deleteMany({ storeId }).exec();
  }

  async updateStatus(tvCode: string, status: 'online' | 'offline'): Promise<ITV | null> {
    const updateObj: any = { status };
    if (status === 'online') {
      updateObj.lastSeen = new Date();
    }
    return await this.model.findOneAndUpdate({ tvCode }, updateObj, { new: true }).exec();
  }
}
