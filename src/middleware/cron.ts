import { NextFunction, Request, Response } from 'express';
import { schedule } from 'node-cron';
import { cronModel } from '../models';

export const scheduler = schedule('*/30 * * * *', async () => {
  console.log('Running cron', new Date().toISOString());
  await cronModel.removeToken();
  await cronModel.removeForgotPassword();
});
