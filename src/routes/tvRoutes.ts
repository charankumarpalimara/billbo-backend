import { Router } from 'express';
import { TVController } from '../controllers/TVController';

const router = Router();
const controller = new TVController();

router.put('/:id', controller.updateTV);
router.delete('/:id', controller.deleteTV);

export default router;
