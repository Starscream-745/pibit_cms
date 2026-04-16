import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../utils/validation';

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error('Error:', err);

  // Handle ValidationError
  if (err instanceof ValidationError) {
    const response: ErrorResponse = {
      error: {
        code: err.code,
        message: err.message
      }
    };
    res.status(400).json(response);
    return;
  }

  // Handle AppError
  if (err instanceof AppError) {
    const response: ErrorResponse = {
      error: {
        code: err.code,
        message: err.message,
        details: err.details
      }
    };
    res.status(err.statusCode).json(response);
    return;
  }

  // Handle MongoDB errors
  if (err.name === 'MongoError' || err.name === 'MongoServerError') {
    const response: ErrorResponse = {
      error: {
        code: 'DATABASE_ERROR',
        message: 'Database operation failed'
      }
    };
    res.status(500).json(response);
    return;
  }

  // Handle generic errors
  const response: ErrorResponse = {
    error: {
      code: 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'production' 
        ? 'An internal error occurred' 
        : err.message
    }
  };
  res.status(500).json(response);
}

export function notFoundHandler(req: Request, res: Response): void {
  const response: ErrorResponse = {
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`
    }
  };
  res.status(404).json(response);
}
