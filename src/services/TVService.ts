import { TVRepository } from '../repositories/TVRepository';
import { AllotmentRepository } from '../repositories/AllotmentRepository';
import { ITV } from '../models/TV';

export class TVService {
  private tvRepository = new TVRepository();
  private allotmentRepository = new AllotmentRepository();

  async getTVsByStore(storeId: string): Promise<ITV[]> {
    return await this.tvRepository.findByStoreId(storeId);
  }

  async getTVsByStorePaginated(storeId: string, page: number, limit: number): Promise<{ data: ITV[]; total: number }> {
    return await this.tvRepository.findPaginated({ storeId }, page, limit);
  }

  async createTV(storeId: string, data: Partial<ITV>): Promise<ITV> {
    return await this.tvRepository.create({ ...data, storeId: storeId as any });
  }

  async deleteTV(id: string): Promise<ITV | null> {
    return await this.tvRepository.delete(id);
  }

  async getTVByTvCode(tvCode: string): Promise<ITV | null> {
    return await this.tvRepository.findByTvCode(tvCode);
  }

  async updateTVStatus(tvCode: string, status: 'online' | 'offline'): Promise<ITV | null> {
    return await this.tvRepository.updateStatus(tvCode, status);
  }

  async updateTV(id: string, data: Partial<ITV>): Promise<ITV | null> {
    return await this.tvRepository.update(id, data);
  }
}
