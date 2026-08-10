import { Request, Response, NextFunction } from 'express';
import { AllotmentService } from '../services/AllotmentService';

export class AllotmentController {
  private allotmentService = new AllotmentService();

  public getAllotments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : null;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : null;
      
      if (page && limit) {
        const result = await this.allotmentService.getAllotmentsPaginated(page, limit);
        res.json({
          data: result.data,
          total: result.total,
          page,
          limit
        });
      } else {
        const allotments = await this.allotmentService.getAllotments();
        res.json(allotments);
      }
    } catch (error) {
      next(error);
    }
  };

  public saveAllotment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { storeId, adIds } = req.body;
      const updated = await this.allotmentService.saveAllotment(storeId, adIds);
      res.json(updated);
    } catch (error) {
      next(error);
    }
  };

  public getPlaylist = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const playlist = await this.allotmentService.getPlaylistByTvCode(req.params.tvCode);
      res.json(playlist);
    } catch (error) {
      next(error);
    }
  };
}
