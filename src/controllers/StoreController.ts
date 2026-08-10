import { Request, Response, NextFunction } from 'express';
import { StoreService } from '../services/StoreService';

export class StoreController {
  private storeService = new StoreService();

  public getStores = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : null;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : null;
      
      if (page && limit) {
        const result = await this.storeService.getStoresPaginated(page, limit);
        res.json({
          data: result.data,
          total: result.total,
          page,
          limit
        });
      } else {
        const stores = await this.storeService.getStores();
        res.json(stores);
      }
    } catch (error) {
      next(error);
    }
  };

  public createStore = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const store = await this.storeService.createStore(req.body);
      res.json(store);
    } catch (error) {
      next(error);
    }
  };

  public deleteStore = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.storeService.deleteStore(req.params.id);
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  };

  public updateStore = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const updated = await this.storeService.updateStore(req.params.id, req.body);
      res.json(updated);
    } catch (error) {
      next(error);
    }
  };
}
