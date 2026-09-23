import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import propertyRoutes from './routes/propertyRoutes';
import adminRoutes from './routes/adminRoutes';
import chatRoutes from './routes/chatRoutes';
import { helmetSecurity, apiLimiter, sanitizeNoSql } from './middleware/securityMiddleware';
import errorHandler from './middleware/errorMiddleware';

dotenv.config();

connectDB();

const app = express();

// 1. Security Headers via Helmet
app.use(helmetSecurity);

// 2. CORS Configuration
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  })
);

// 3. Body Parsers with payload limits
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// 4. Global NoSQL Injection Sanitizer
app.use(sanitizeNoSql);

// 5. Global API Rate Limiter
app.use('/api', apiLimiter);

// 6. Application API Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: 'Server is running safely with security headers & rate limiting' });
});

// 7. 404 Route Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'API route not found' });
});

// 8. Centralized Global Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
