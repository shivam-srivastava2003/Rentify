import express from 'express';
import {
  getAdminStats,
  getAdminOwners,
  getOwnerDetailsWithProperties,
  getAdminRenters,
  deleteItemByAdmin,
  getAdminDeletionHistory,
  deleteHistoryItem,
  clearAllDeletionHistory,
} from '../controllers/adminController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);
router.use(authorize('ADMIN'));

router.get('/stats', getAdminStats);
router.get('/owners', getAdminOwners);
router.get('/owners/:id', getOwnerDetailsWithProperties);
router.get('/renters', getAdminRenters);

// Deletion & History Tracking Routes
router.post('/delete-item', deleteItemByAdmin);
router.get('/history', getAdminDeletionHistory);
router.delete('/history/:id', deleteHistoryItem);
router.delete('/history', clearAllDeletionHistory);

export default router;
