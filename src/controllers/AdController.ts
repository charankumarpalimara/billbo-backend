import { Request, Response, NextFunction } from 'express';
import { AdService } from '../services/AdService';
// import cloudinary from '../config/cloudinary';
import s3 from '../config/s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { downloadFileFromS3, deleteFileFromS3, getPresignedDownloadUrl } from '../utils/s3Helpers';

/*
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
*/

const uploadToS3 = async (file: Express.Multer.File): Promise<string> => {
  const bucketName = process.env.AWS_BUCKET_NAME || 'tv-ads-bucket';
  const region = process.env.AWS_REGION || 'ap-south-1';
  const fileKey = `tv_ads/${Date.now()}_${file.originalname.replace(/\s+/g, '_')}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: fileKey,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  await s3.send(command);

  return `https://${bucketName}.s3.${region}.amazonaws.com/${fileKey}`;
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
        youtubeUrl = await uploadToS3(req.file);
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
      const oldAd = await this.adService.getAdById(req.params.id);
      let youtubeUrl = req.body.youtubeUrl;

      if (req.file) {
        if (oldAd && oldAd.youtubeUrl) {
          try {
            await deleteFileFromS3(oldAd.youtubeUrl);
          } catch (err) {
            console.error("Failed to delete old S3 file:", err);
          }
        }
        youtubeUrl = await uploadToS3(req.file);
      } else if (oldAd && oldAd.youtubeUrl && req.body.youtubeUrl === '') {
        // The user explicitly removed the media file
        try {
          await deleteFileFromS3(oldAd.youtubeUrl);
        } catch (err) {
          console.error("Failed to delete S3 file on removal:", err);
        }
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

  public downloadAd = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const ad = await this.adService.getAdById(req.params.id);
      if (!ad || !ad.youtubeUrl) {
        res.status(404).json({ error: 'Ad or video not found' });
        return;
      }

      // Check if it's a YouTube link rather than S3 direct link
      if (ad.youtubeUrl.includes('youtube.com') || ad.youtubeUrl.includes('youtu.be')) {
        res.redirect(ad.youtubeUrl);
        return;
      }

      const presignedUrl = await getPresignedDownloadUrl(ad.youtubeUrl);
      res.redirect(presignedUrl);
    } catch (error) {
      next(error);
    }
  };
}

