import express from 'express';
import {
  getProperties,
  getMyProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
} from '../controllers/propertyController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', getProperties);
router.get('/my-properties', protect, authorize('OWNER', 'ADMIN'), getMyProperties);
router.get('/:id', getPropertyById);
router.post('/', protect, authorize('OWNER', 'ADMIN'), createProperty);
router.put('/:id', protect, authorize('OWNER', 'ADMIN'), updateProperty);
router.delete('/:id', protect, authorize('OWNER', 'ADMIN'), deleteProperty);

export default router;
