import { Router } from 'express';
import { StoreController } from '../controllers/StoreController';
import { TVController } from '../controllers/TVController';

const router = Router();
const storeController = new StoreController();
const tvController = new TVController();

router.get('/', storeController.getStores);
router.post('/', storeController.createStore);
router.put('/:id', storeController.updateStore);
router.delete('/:id', storeController.deleteStore);

// TV sub-resource under stores
router.get('/:storeId/tvs', tvController.getTVsByStore);
router.post('/:storeId/tvs', tvController.createTV);

export default router;
