import { BaseRepository } from './BaseRepository';
import { TV } from '../models/TV';

export class TVRepository extends BaseRepository<TV> {
  constructor() {
    super(TV);
  }

  async findByStoreId(storeId: string | number): Promise<TV[]> {
    return await this.model.findAll({ where: { storeId } });
  }

  async findByTvCode(tvCode: string): Promise<TV | null> {
    return await this.model.findOne({ where: { tvCode } });
  }

  async deleteManyByStoreId(storeId: string | number): Promise<any> {
    return await this.model.destroy({ where: { storeId } });
  }

  async updateStatus(tvCode: string, status: 'online' | 'offline'): Promise<TV | null> {
    const updateObj: any = { status };
    if (status === 'online') {
      updateObj.lastSeen = new Date();
    }
    const tv = await this.model.findOne({ where: { tvCode } });
    if (!tv) return null;
    await tv.update(updateObj);
    return tv;
  }
}
