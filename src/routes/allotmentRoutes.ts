import { Router } from 'express';
import { AllotmentController } from '../controllers/AllotmentController';

const router = Router();
const controller = new AllotmentController();

router.get('/', controller.getAllotments);
router.post('/', controller.saveAllotment);

export default router;
