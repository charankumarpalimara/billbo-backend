import { Request, Response, NextFunction } from 'express';
import { AdvertiserService } from '../services/AdvertiserService';

export class AdvertiserController {
  private advertiserService = new AdvertiserService();

  public getAdvertisers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : null;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : null;
      
      if (page && limit) {
        const result = await this.advertiserService.getAdvertisersPaginated(page, limit);
        res.json({
          data: result.data,
          total: result.total,
          page,
          limit
        });
      } else {
        const advertisers = await this.advertiserService.getAdvertisers();
        res.json(advertisers);
      }
    } catch (error) {
      next(error);
    }
  };

  public createAdvertiser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const advertiser = await this.advertiserService.createAdvertiser(req.body);
      res.json(advertiser);
    } catch (error) {
      next(error);
    }
  };

  public deleteAdvertiser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.advertiserService.deleteAdvertiser(req.params.id);
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  };

  public updateAdvertiser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const updated = await this.advertiserService.updateAdvertiser(req.params.id, req.body);
      res.json(updated);
    } catch (error) {
      next(error);
    }
  };
}
