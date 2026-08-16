import { AdRepository } from '../repositories/AdRepository';
import { AllotmentRepository } from '../repositories/AllotmentRepository';
import { IAd } from '../models/Ad';
import { deleteFileFromS3 } from '../utils/s3Helpers';

export class AdService {
  private adRepository = new AdRepository();
  private allotmentRepository = new AllotmentRepository();

  async getAds(): Promise<IAd[]> {
    return await this.adRepository.findAllWithAdvertiser();
  }

  async getAdsPaginated(page: number, limit: number): Promise<{ data: IAd[]; total: number }> {
    return await this.adRepository.findPaginatedWithAdvertiser(page, limit);
  }

  async getAdById(id: string): Promise<IAd | null> {
    return await this.adRepository.findById(id);
  }

  async createAd(data: Partial<IAd>): Promise<IAd> {
    const ads = await this.adRepository.find({});
    let nextNum = 101;
    ads.forEach(a => {
      if (a.adCode && a.adCode.startsWith('AD_')) {
        const num = parseInt(a.adCode.substring(3));
        if (!isNaN(num) && num >= nextNum) {
          nextNum = num + 1;
        }
      }
    });
    const code = `AD_${nextNum}`;
    return await this.adRepository.create({ ...data, adCode: code });
  }

  async deleteAd(id: string): Promise<IAd | null> {
    const ad = await this.adRepository.delete(id);
    if (ad) {
      await this.allotmentRepository.removeAdFromAllotments(id);
      if (ad.youtubeUrl) {
        try {
          await deleteFileFromS3(ad.youtubeUrl);
        } catch (err) {
          console.error("Failed to delete associated S3 file:", err);
        }
      }
    }
    return ad;
  }

  async updateAd(id: string, data: Partial<IAd>): Promise<IAd | null> {
    await this.adRepository.update(id, data);
    return await this.adRepository.findByIdPopulated(id);
  }
}
