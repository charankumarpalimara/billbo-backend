import { Request, Response, NextFunction } from 'express';
import { TVService } from '../services/TVService';

export class TVController {
  private tvService = new TVService();

  public getTVsByStore = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : null;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : null;
      
      if (page && limit) {
        const result = await this.tvService.getTVsByStorePaginated(req.params.storeId, page, limit);
        res.json({
          data: result.data,
          total: result.total,
          page,
          limit
        });
      } else {
        const tvs = await this.tvService.getTVsByStore(req.params.storeId);
        res.json(tvs);
      }
    } catch (error) {
      next(error);
    }
  };

  public createTV = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tv = await this.tvService.createTV(req.params.storeId, req.body);
      res.json(tv);
    } catch (error) {
      next(error);
    }
  };

  public deleteTV = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.tvService.deleteTV(req.params.id);
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  };

  public updateTV = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const updated = await this.tvService.updateTV(req.params.id, req.body);
      res.json(updated);
    } catch (error) {
      next(error);
    }
  };
}
