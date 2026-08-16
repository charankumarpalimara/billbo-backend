import { BaseRepository } from './BaseRepository';
import { Allotment, AllotmentAd } from '../models/Allotment';
import { Store } from '../models/Store';
import { Ad } from '../models/Ad';
import { Advertiser } from '../models/Advertiser';

export class AllotmentRepository extends BaseRepository<Allotment> {
  constructor() {
    super(Allotment);
  }

  async findAllPopulated(): Promise<Allotment[]> {
    return await this.model.findAll({
      include: [
        { model: Store, as: 'store' },
        { model: Ad, as: 'adIds' }
      ]
    });
  }

  async findPaginatedPopulated(page: number, limit: number): Promise<{ data: Allotment[]; total: number }> {
    const skip = (page - 1) * limit;
    const { rows, count } = await this.model.findAndCountAll({
      include: [
        { model: Store, as: 'store' },
        { model: Ad, as: 'adIds' }
      ],
      offset: skip,
      limit,
      distinct: true
    });
    return { data: rows, total: count };
  }

  async findByStoreIdPopulated(storeId: string | number): Promise<Allotment | null> {
    return await this.model.findOne({
      where: { storeId },
      include: [
        {
          model: Ad,
          as: 'adIds',
          include: [{ model: Advertiser, as: 'advertiser' }]
        }
      ]
    });
  }

  async upsertAllotment(storeId: string | number, adIds: any[]): Promise<Allotment | null> {
    let allotment = await this.model.findOne({ where: { storeId } });

    const numericAdIds = adIds.map(id => parseInt(id.toString()));

    if (allotment) {
      await (allotment as any).setAdIds(numericAdIds);
      return allotment;
    } else {
      const allotments = await this.model.findAll();
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
      allotment = await this.model.create({
        storeId: parseInt(storeId.toString()),
        allotmentCode: code
      });
      await (allotment as any).setAdIds(numericAdIds);
      return allotment;
    }
  }

  async removeAdFromAllotments(adId: string | number): Promise<any> {
    return await AllotmentAd.destroy({ where: { adId: parseInt(adId.toString()) } });
  }

  async deleteByStoreId(storeId: string | number): Promise<any> {
    return await this.model.destroy({ where: { storeId } });
  }
}
