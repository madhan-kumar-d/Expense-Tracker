import { Request, Response, NextFunction } from 'express';
import { rootException } from '../exception';
import jwt from 'jsonwebtoken';

export const errorMiddleware = async (
  error: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.log(error);
  if (error instanceof rootException) {
    res.status(error.statusCode).json({
      status: 'Failure',
      message: error.message,
      errorCode: error.errorCode,
      errors: error.errors
    });
  } else if (error instanceof jwt.JsonWebTokenError) {
    res.status(401).json({
      status: 'Failure',
      message: error.message,
      errorCode: 401
    });
  } else {
    res
      .status(500)
      .json({ status: 'Failure', message: 'Internal Server Error' });
  }
};
