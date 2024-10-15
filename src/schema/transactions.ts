import Joi from 'joi';
import { WALLETSTYPE } from '@prisma/client';
export const transactionsSchema = {
  create: Joi.object({
    amount: Joi.number().precision(2).required(),
    categoryID: Joi.number().required(),
    type: Joi.string()
      .required()
      .valid(...Object.values(WALLETSTYPE)),
    date: Joi.date().required().min('01-01-1990 00:00:00')
  }),
  get: Joi.object({
    categoryID: Joi.number().optional(),
    type: Joi.string()
      .valid(...Object.values(WALLETSTYPE))
      .optional(),
    date: Joi.date().min('01-01-1990').optional(),
    page: Joi.number().optional(),
    perPage: Joi.number().optional()
  }),
  select: Joi.object({
    id: Joi.number()
  })
};
