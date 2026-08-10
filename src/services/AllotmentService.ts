import { AllotmentRepository } from '../repositories/AllotmentRepository';
import { TVRepository } from '../repositories/TVRepository';
import { Store } from '../models/Store';
import { IAllotment } from '../models/Allotment';
import { IAd } from '../models/Ad';

export class AllotmentService {
  private allotmentRepository = new AllotmentRepository();
  private tvRepository = new TVRepository();

  async getAllotments(): Promise<IAllotment[]> {
    return await this.allotmentRepository.findAllPopulated();
  }

  async getAllotmentsPaginated(page: number, limit: number): Promise<{ data: IAllotment[]; total: number }> {
    return await this.allotmentRepository.findPaginatedPopulated(page, limit);
  }

  async saveAllotment(storeId: string, adIds: string[]): Promise<IAllotment | null> {
    return await this.allotmentRepository.upsertAllotment(storeId, adIds);
  }

  async getPlaylistByTvCode(tvCode: string): Promise<IAd[]> {
    // 1. Check if the incoming tvCode is a Store Code (e.g. "STR_102")
    let store = await Store.findOne({ storeCode: tvCode }).exec();
    
    // 2. If not found, try searching by Store MongoDB _id directly
    if (!store) {
      try {
        store = await Store.findById(tvCode).exec();
      } catch (_) {
        // Invalid ObjectId format, safe to ignore
      }
    }

    // 3. If still not found, fallback to checking if it is a TV Code and finding its store
    let storeIdVal: string;
    if (store) {
      storeIdVal = store._id.toString();
    } else {
      const tv = await this.tvRepository.findByTvCode(tvCode);
      if (!tv) {
        return [];
      }
      storeIdVal = tv.storeId.toString();
    }

    const allotment = await this.allotmentRepository.findByStoreIdPopulated(storeIdVal);
    if (!allotment) {
      return [];
    }
    return allotment.adIds as unknown as IAd[];
  }
}
