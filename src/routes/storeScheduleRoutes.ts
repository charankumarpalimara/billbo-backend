import { Router } from 'express';
import { StoreScheduleController } from '../controllers/StoreScheduleController';

const router = Router();
const controller = new StoreScheduleController();

router.get('/', controller.getSchedules);
router.post('/', controller.createSchedule);
router.put('/:id', controller.updateSchedule);
router.delete('/:id', controller.deleteSchedule);
router.get('/store/:storeId/active', controller.getStoreActiveStatus);

export default router;
