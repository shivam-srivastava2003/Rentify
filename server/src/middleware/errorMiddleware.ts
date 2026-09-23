import { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../utils/errorResponse';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for server diagnostics
  console.error('API Execution Error:', err);

  // Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError') {
    const message = `Resource not found with specified ID of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose Duplicate Key (code 11000)
  if (err.code === 11000) {
    const message = 'Duplicate field value entered. An account or resource with this detail already exists.';
    error = new ErrorResponse(message, 400);
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val: any) => val.message).join(', ');
    error = new ErrorResponse(message, 400);
  }

  // JWT Token Errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Session token invalid. Authentication failed.';
    error = new ErrorResponse(message, 401);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Session token expired. Please log in again.';
    error = new ErrorResponse(message, 401);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Internal Server Error',
  });
};

export default errorHandler;
