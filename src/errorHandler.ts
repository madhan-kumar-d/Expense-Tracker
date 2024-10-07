import { NextFunction, Request, Response } from 'express';

export const errorHandler = (fn: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (e: any) {
      next(e);
    }
  };
};
