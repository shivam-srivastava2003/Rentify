import express from 'express';
import {
  getAdminStats,
  getAdminOwners,
  getOwnerDetailsWithProperties,
  getAdminRenters,
} from '../controllers/adminController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);
router.use(authorize('ADMIN'));

router.get('/stats', getAdminStats);
router.get('/owners', getAdminOwners);
router.get('/owners/:id', getOwnerDetailsWithProperties);
router.get('/renters', getAdminRenters);

export default router;
