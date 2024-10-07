import express, { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

import secrets from './secrets';
import { authRouter, transactionsRouter } from './routes';
import { error404, errorMiddleware, limiter } from './middleware';
import { scheduler } from './middleware/cron';

const app: Express = express();
const PORT: number = +secrets.PORT;
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(limiter);
app.use('/auth', authRouter);
app.use('/transactions', transactionsRouter);

// 404 response
app.use(error404);

app.use(errorMiddleware);
export const prismaClient = new PrismaClient({
  log: ['query', 'error']
});
scheduler.start();
app.listen(PORT, () => {
  console.log(`App is running on Port ${PORT}`);
});
