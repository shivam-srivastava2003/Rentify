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
import { validateBody } from '../middleware/validateMiddleware';
import { adminDeleteSchema } from '../schemas/validationSchemas';

const router = express.Router();

router.use(protect);
router.use(authorize('ADMIN'));

router.get('/stats', getAdminStats);
router.get('/owners', getAdminOwners);
router.get('/owners/:id', getOwnerDetailsWithProperties);
router.get('/renters', getAdminRenters);

// Deletion & History Tracking Routes with Zod validation
router.post('/delete-item', validateBody(adminDeleteSchema), deleteItemByAdmin);
router.get('/history', getAdminDeletionHistory);
router.delete('/history/:id', deleteHistoryItem);
router.delete('/history', clearAllDeletionHistory);

export default router;
