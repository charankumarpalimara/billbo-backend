import { Request, Response, NextFunction } from 'express';
import { AdService } from '../services/AdService';
import cloudinary from '../config/cloudinary';

const uploadToCloudinary = (file: Express.Multer.File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const isVideo = file.mimetype.startsWith('video/');
    const resourceType = isVideo ? 'video' : 'auto';

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'tv_ads',
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        if (result?.secure_url) {
          resolve(result.secure_url);
        } else {
          reject(new Error('Cloudinary upload response was empty'));
        }
      }
    );
    uploadStream.end(file.buffer);
  });
};

export class AdController {
  private adService = new AdService();

  public getAds = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : null;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : null;
      
      if (page && limit) {
        const result = await this.adService.getAdsPaginated(page, limit);
        res.json({
          data: result.data,
          total: result.total,
          page,
          limit
        });
      } else {
        const ads = await this.adService.getAds();
        res.json(ads);
      }
    } catch (error) {
      next(error);
    }
  };

  public createAd = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let youtubeUrl = req.body.youtubeUrl;
      if (req.file) {
        youtubeUrl = await uploadToCloudinary(req.file);
      }
      
      const duration = req.body.duration ? parseInt(req.body.duration as string, 10) : undefined;
      const ad = await this.adService.createAd({
        ...req.body,
        youtubeUrl,
        duration: duration !== undefined && !isNaN(duration) ? duration : undefined,
      });
      res.json(ad);
    } catch (error) {
      next(error);
    }
  };

  public deleteAd = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.adService.deleteAd(req.params.id);
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  };

  public updateAd = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let youtubeUrl = req.body.youtubeUrl;
      if (req.file) {
        youtubeUrl = await uploadToCloudinary(req.file);
      }

      const duration = req.body.duration ? parseInt(req.body.duration as string, 10) : undefined;
      const updated = await this.adService.updateAd(req.params.id, {
        ...req.body,
        youtubeUrl,
        duration: duration !== undefined && !isNaN(duration) ? duration : undefined,
      });
      res.json(updated);
    } catch (error) {
      next(error);
    }
  };
}

