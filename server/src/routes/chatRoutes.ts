import express from 'express';
import { handleMakeWebhook } from '../controllers/chatController';

const router = express.Router();

router.post('/webhook', handleMakeWebhook);

export default router;
