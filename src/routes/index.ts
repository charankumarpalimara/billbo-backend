import { Router } from 'express';
import advertiserRoutes from './advertiserRoutes';
import storeRoutes from './storeRoutes';
import tvRoutes from './tvRoutes';
import adRoutes from './adRoutes';
import allotmentRoutes from './allotmentRoutes';
import storeScheduleRoutes from './storeScheduleRoutes';
import { AllotmentController } from '../controllers/AllotmentController';

const router = Router();
const allotmentController = new AllotmentController();

// Entity routes
router.use('/advertisers', advertiserRoutes);
router.use('/stores', storeRoutes);
router.use('/tvs', tvRoutes);
router.use('/ads', adRoutes);
router.use('/allotments', allotmentRoutes);
router.use('/schedules', storeScheduleRoutes);

// Custom/Specific endpoints
router.get('/tv/:tvCode/playlist', allotmentController.getPlaylist);

router.get('/tv/:customerId/reset-check', (req, res) => {
  res.json({ response: 'no_reset' });
});

router.post('/tv/completion-event', (req, res) => {
  const { tvCode, adCode } = req.body;
  console.log(`[EVENT] Completion event received from TV "${tvCode}" for Ad "${adCode}"`);
  res.json({ response: 'success' });
});

export default router;



