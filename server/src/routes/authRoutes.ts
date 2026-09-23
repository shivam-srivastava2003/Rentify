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
import { authLimiter } from '../middleware/securityMiddleware';
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
  updateEmailSchema,
  resetPasswordSchema,
} from '../schemas/validationSchemas';

const router = express.Router();

// Apply auth rate limiter to prevent brute force login/register attacks
router.post('/register', authLimiter, validateBody(registerSchema), registerUser);
router.post('/login', authLimiter, validateBody(loginSchema), loginUser);
router.post('/logout', logoutUser);
router.post('/verify-reset-email', authLimiter, verifyResetEmail);
router.post('/reset-password', authLimiter, validateBody(resetPasswordSchema), resetPassword);

router.get('/me', protect, getUserProfile);
router.put('/profile', protect, validateBody(updateProfileSchema), updateUserProfile);
router.put('/change-password', protect, validateBody(changePasswordSchema), changePassword);
router.put('/update-email', protect, validateBody(updateEmailSchema), updateEmail);

export default router;
