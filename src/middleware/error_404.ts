import { NextFunction, Request, Response } from 'express';
import { customErrorCode, NotFound } from '../exception';

export const error404 = (_req: Request, res: Response, next: NextFunction) => {
  throw new NotFound(customErrorCode.PageNotFound);
};
