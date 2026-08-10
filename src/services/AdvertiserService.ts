import { AdvertiserRepository } from '../repositories/AdvertiserRepository';
import { IAdvertiser } from '../models/Advertiser';

export class AdvertiserService {
  private advertiserRepository = new AdvertiserRepository();

  async getAdvertisers(): Promise<IAdvertiser[]> {
    return await this.advertiserRepository.findAllSortedByCreated();
  }

  async getAdvertisersPaginated(page: number, limit: number): Promise<{ data: IAdvertiser[]; total: number }> {
    return await this.advertiserRepository.findPaginated({}, page, limit);
  }

  async createAdvertiser(data: Partial<IAdvertiser>): Promise<IAdvertiser> {
    const advertisers = await this.advertiserRepository.find({});
    let nextNum = 101;
    advertisers.forEach(adv => {
      if (adv.advertiserCode && adv.advertiserCode.startsWith('ADV_')) {
        const num = parseInt(adv.advertiserCode.substring(4));
        if (!isNaN(num) && num >= nextNum) {
          nextNum = num + 1;
        }
      }
    });
    const code = `ADV_${nextNum}`;
    return await this.advertiserRepository.create({ ...data, advertiserCode: code });
  }

  async deleteAdvertiser(id: string): Promise<IAdvertiser | null> {
    return await this.advertiserRepository.delete(id);
  }

  async updateAdvertiser(id: string, data: Partial<IAdvertiser>): Promise<IAdvertiser | null> {
    return await this.advertiserRepository.update(id, data);
  }
}
