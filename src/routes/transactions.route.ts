import { Request, Response, Router } from 'express';
import { categoryController, transactionsController } from 'src/controller';
import { errorHandler } from 'src/errorHandler';
import {
  getValidate,
  queryValidate,
  userMiddleware,
  validate
} from 'src/middleware';
import { CategorySchema, transactionsSchema } from 'src/schema';

export const transactionsRouter = Router();

transactionsRouter.get(
  '/category',
  [errorHandler(userMiddleware)],
  errorHandler(categoryController.get)
);
transactionsRouter.post(
  '/category',
  [errorHandler(userMiddleware), errorHandler(validate(CategorySchema.create))],
  errorHandler(categoryController.create)
);
transactionsRouter.patch(
  '/category/:categoryID',
  [
    errorHandler(userMiddleware),
    errorHandler(validate(CategorySchema.create)),
    errorHandler(getValidate(CategorySchema.update))
  ],
  errorHandler(categoryController.update)
);
transactionsRouter.delete(
  '/category/:categoryID',
  [
    errorHandler(userMiddleware),
    errorHandler(getValidate(CategorySchema.update))
  ],
  errorHandler(categoryController.delete)
);
transactionsRouter.post(
  '/',
  [
    errorHandler(userMiddleware),
    errorHandler(validate(transactionsSchema.create))
  ],
  errorHandler(transactionsController.create)
);

transactionsRouter.get(
  '/',
  [
    errorHandler(userMiddleware),
    errorHandler(queryValidate(transactionsSchema.get))
  ],
  errorHandler(transactionsController.get)
);
transactionsRouter.get(
  '/daily/',
  [
    errorHandler(userMiddleware),
    errorHandler(queryValidate(transactionsSchema.get))
  ],
  errorHandler(transactionsController.getDaily)
);
transactionsRouter.get(
  '/monthly',
  [
    errorHandler(userMiddleware),
    errorHandler(queryValidate(transactionsSchema.get))
  ],
  errorHandler(transactionsController.getMonthly)
);

transactionsRouter.delete(
  '/:id',
  [
    errorHandler(userMiddleware),
    errorHandler(getValidate(transactionsSchema.select))
  ],
  errorHandler(transactionsController.delete)
);
transactionsRouter.patch(
  '/:id',
  [
    errorHandler(userMiddleware),
    errorHandler(validate(transactionsSchema.create)),
    errorHandler(getValidate(transactionsSchema.select))
  ],
  errorHandler(transactionsController.update)
);
