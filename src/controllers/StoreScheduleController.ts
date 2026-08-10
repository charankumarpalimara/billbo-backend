import { Request, Response, NextFunction } from 'express';
import { StoreScheduleService } from '../services/StoreScheduleService';

export class StoreScheduleController {
  private scheduleService = new StoreScheduleService();

  public getSchedules = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : null;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : null;
      const storeId = (req.query.storeId as string) || '';
      const search = (req.query.search as string) || '';

      if (page && limit) {
        const result = await this.scheduleService.getSchedulesPaginated(page, limit, storeId, search);
        res.json({
          data: result.data,
          total: result.total,
          page,
          limit,
        });
      } else {
        const list = await this.scheduleService.getSchedules();
        res.json(list);
      }
    } catch (error) {
      next(error);
    }
  };

  public createSchedule = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (req.body.sessions && req.body.sessions.length > 0) {
        const result = await this.scheduleService.createSchedulesBatch(req.body);
        res.json(result);
      } else {
        const schedule = await this.scheduleService.createSchedule(req.body);
        res.json(schedule);
      }
    } catch (error) {
      next(error);
    }
  };

  public updateSchedule = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const updated = await this.scheduleService.updateSchedule(req.params.id, req.body);
      res.json(updated);
    } catch (error) {
      next(error);
    }
  };

  public deleteSchedule = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.scheduleService.deleteSchedule(req.params.id);
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  };

  public getStoreActiveStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const isActive = await this.scheduleService.isStoreActive(req.params.storeId);
      res.json({ isActive });
    } catch (error) {
      next(error);
    }
  };
}
