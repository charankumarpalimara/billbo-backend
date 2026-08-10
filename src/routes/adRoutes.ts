import { Router } from 'express';
import multer from 'multer';
import { AdController } from '../controllers/AdController';

const router = Router();
const controller = new AdController();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100 MB max for videos
  }
});

router.get('/', controller.getAds);
router.post('/', upload.single('file'), controller.createAd);
router.put('/:id', upload.single('file'), controller.updateAd);
router.delete('/:id', controller.deleteAd);

export default router;

