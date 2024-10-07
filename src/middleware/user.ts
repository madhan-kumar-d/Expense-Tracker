import { NextFunction, Request, Response } from 'express';
import { authUtils } from '../utils';
import secrets from '../secrets';
import { authModel } from '../models/auth.model';
import { unauthorizedException } from '../exception/unauthorized';
import { customErrorCode } from '../exception';

export const userMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const tokenUser = await authUtils.verifyToken(token!, secrets.JWT_SECRET!);
  console.log(tokenUser);
  const getUserDetails = await authModel.getUserByUserID(tokenUser.userID, [
    'id',
    'UUID',
    'Email',
    'dob',
    'createdAt',
    'isVerified'
  ]);
  if (!getUserDetails) {
    // Might be user inactive so make them login
    throw new unauthorizedException(customErrorCode.UnauthorizedAccess);
  }
  req.users = getUserDetails;
  next();
};
