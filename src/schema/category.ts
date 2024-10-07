import Joi from 'joi';

export const CategorySchema = {
  create: Joi.object({
    name: Joi.string().required()
  }),
  update: Joi.object({
    categoryID: Joi.string().required()
  })
};
