import { Router, Request, Response } from 'express';
import { authController } from '../controller';
import { errorHandler } from '../errorHandler';
import { getValidate, userMiddleware, validate } from '../middleware';
import { authSchema } from '../schema';
export const authRouter = Router();
authRouter.post(
  '/accountCreation',
  validate(authSchema.register),
  errorHandler(authController.register)
);
authRouter.get(
  '/activate/:code',
  getValidate(authSchema.activationSchema),
  errorHandler(authController.activate)
);
authRouter.post(
  '/login',
  validate(authSchema.login),
  errorHandler(authController.login)
);
authRouter.post(
  '/token',
  validate(authSchema.token),
  errorHandler(authController.token)
);
authRouter.get(
  '/me',
  errorHandler(userMiddleware),
  errorHandler(authController.me)
);
authRouter.post(
  '/change-password',
  errorHandler(userMiddleware),
  errorHandler(authController.changePassword)
);

authRouter.post(
  '/forgot-password',
  validate(authSchema.forgotPassword),
  errorHandler(authController.forgotPassword)
); // Over Mail Reset Password

authRouter.post(
  '/reset-password',
  validate(authSchema.resetPassword),
  errorHandler(authController.updatePasswordFB)
);
authRouter.post(
  '/logout',
  [errorHandler(userMiddleware), validate(authSchema.token)],
  errorHandler(authController.logout)
); // Remove Refresh Token to Avoid reuse
// Logout All Device - Will Delete records in Token table
authRouter.get(
  '/logout',
  errorHandler(userMiddleware),
  errorHandler(authController.logoutAll)
);
