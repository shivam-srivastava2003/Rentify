import express from 'express';
import {
  getProperties,
  getMyProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  addPropertyReview,
} from '../controllers/propertyController';
import { protect, authorize } from '../middleware/authMiddleware';
import { validateBody } from '../middleware/validateMiddleware';
import { propertySchema, addReviewSchema } from '../schemas/validationSchemas';

const router = express.Router();

router.get('/', getProperties);
router.get('/my-properties', protect, authorize('OWNER', 'ADMIN'), getMyProperties);
router.get('/:id', getPropertyById);

router.post('/', protect, authorize('OWNER', 'ADMIN'), validateBody(propertySchema), createProperty);
router.post('/:id/reviews', protect, validateBody(addReviewSchema), addPropertyReview);
router.put('/:id', protect, authorize('OWNER', 'ADMIN'), updateProperty);
router.delete('/:id', protect, authorize('OWNER', 'ADMIN'), deleteProperty);

export default router;
