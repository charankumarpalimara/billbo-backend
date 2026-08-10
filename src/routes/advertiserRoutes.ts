import { Router } from 'express';
import { AdvertiserController } from '../controllers/AdvertiserController';

const router = Router();
const controller = new AdvertiserController();

router.get('/', controller.getAdvertisers);
router.post('/', controller.createAdvertiser);
router.put('/:id', controller.updateAdvertiser);
router.delete('/:id', controller.deleteAdvertiser);

export default router;
