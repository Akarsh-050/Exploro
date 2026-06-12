import { Request, Response, NextFunction } from 'express';

// Global centralized error interceptor.
export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(`❌ [SERVER ERROR]: ${error.message}`);

  let statusCode = 500;
  let message = 'An unexpected internal server error occurred.';

  if (
    error.message.includes('already registered') || 
    error.message.includes('Access Denied')
  ) {
    statusCode = 400; // Bad Request
    message = error.message;
  }

  res.status(statusCode).json({
    success: false,
    error: message,
  });
};