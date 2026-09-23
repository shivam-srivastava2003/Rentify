import { Request, Response, NextFunction } from 'express';
import asyncHandler from '../middleware/asyncHandler';

// @desc    Forward chatbot payload to Make.com Webhook URL configured in .env
// @route   POST /api/chat/webhook
// @access  Public
export const handleMakeWebhook = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const webhookUrl = process.env.MAKE_WEBHOOK_URL;

    if (
      !webhookUrl ||
      webhookUrl.includes('your-webhook-id') ||
      webhookUrl.includes('your-actual-webhook-url')
    ) {
      res.status(200).json({
        success: false,
        reply:
          'Make.com Webhook URL is not configured in server/.env file (MAKE_WEBHOOK_URL). Please update your .env file with your Make.com Webhook URL!',
      });
      return;
    }

    // Forward request payload to Make.com Webhook via native fetch
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const responseText = await response.text();
    let replyText = responseText;

    try {
      const parsed = JSON.parse(responseText);
      if (typeof parsed === 'object' && parsed !== null) {
        replyText =
          parsed.reply ||
          parsed.response ||
          parsed.message ||
          parsed.text ||
          parsed.output ||
          responseText;
      }
    } catch (e) {
      // Keep original text if not JSON
    }

    res.status(200).json({
      success: true,
      reply: replyText || 'Response received from Make.com AI assistant.',
    });
  } catch (error: any) {
    console.error('Make.com Webhook Proxy Error:', error.message);
    res.status(200).json({
      success: false,
      reply: `Error communicating with Make.com webhook: ${error.message}. Please verify your MAKE_WEBHOOK_URL in server/.env.`,
    });
  }
});
