import express from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  verifyResetEmail,
  resetPassword,
  updateEmail,
} from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';
import { validateBody } from '../middleware/validateMiddleware';
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
  updateEmailSchema,
  resetPasswordSchema,
} from '../schemas/validationSchemas';

const router = express.Router();

router.post('/register', validateBody(registerSchema), registerUser);
router.post('/login', validateBody(loginSchema), loginUser);
router.post('/logout', logoutUser);
router.post('/verify-reset-email', verifyResetEmail);
router.post('/reset-password', validateBody(resetPasswordSchema), resetPassword);

router.get('/me', protect, getUserProfile);
router.put('/profile', protect, validateBody(updateProfileSchema), updateUserProfile);
router.put('/change-password', protect, validateBody(changePasswordSchema), changePassword);
router.put('/update-email', protect, validateBody(updateEmailSchema), updateEmail);

export default router;
