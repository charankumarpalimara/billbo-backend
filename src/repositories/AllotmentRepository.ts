import { BaseRepository } from './BaseRepository';
import { Allotment, IAllotment } from '../models/Allotment';

export class AllotmentRepository extends BaseRepository<IAllotment> {
  constructor() {
    super(Allotment);
  }

  async findAllPopulated(): Promise<IAllotment[]> {
    return await this.model.find()
      .populate('storeId')
      .populate('adIds')
      .exec();
  }

  async findPaginatedPopulated(page: number, limit: number): Promise<{ data: IAllotment[]; total: number }> {
    const skip = (page - 1) * limit;
    const total = await this.model.countDocuments({}).exec();
    const data = await this.model.find()
      .populate('storeId')
      .populate('adIds')
      .skip(skip)
      .limit(limit)
      .exec();
    return { data, total };
  }

  async findByStoreIdPopulated(storeId: string): Promise<IAllotment | null> {
    return await this.model.findOne({ storeId })
      .populate({
        path: 'adIds',
        populate: { path: 'advertiserId' }
      })
      .exec();
  }

  async upsertAllotment(storeId: string, adIds: string[]): Promise<IAllotment | null> {
    const existing = await this.model.findOne({ storeId }).exec();
    if (existing) {
      return await this.model.findOneAndUpdate(
        { storeId },
        { adIds },
        { new: true }
      ).exec();
    } else {
      const allotments = await this.model.find({}).exec();
      let nextNum = 101;
      allotments.forEach(a => {
        if (a.allotmentCode && a.allotmentCode.startsWith('ALT_')) {
          const num = parseInt(a.allotmentCode.substring(4));
          if (!isNaN(num) && num >= nextNum) {
            nextNum = num + 1;
          }
        }
      });
      const code = `ALT_${nextNum}`;
      return await this.model.findOneAndUpdate(
        { storeId },
        { adIds, allotmentCode: code },
        { upsert: true, new: true }
      ).exec();
    }
  }

  async removeAdFromAllotments(adId: string): Promise<any> {
    return await this.model.updateMany({}, { $pull: { adIds: adId } }).exec();
  }

  async deleteByStoreId(storeId: string): Promise<any> {
    return await this.model.deleteOne({ storeId }).exec();
  }
}
