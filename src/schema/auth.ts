import Joi from 'joi';
import JoiDate from '@joi/date';

const joi = Joi.extend(JoiDate);
const today = new Date().toISOString();
export const authSchema = {
  register: Joi.object({
    email: Joi.string().email().required(),
    userName: Joi.string().required(),
    password: Joi.string()
      .min(8)
      .max(15)
      .pattern(new RegExp('^(?=.*[!@#$%^&*])'), 'Special Character')
      .pattern(new RegExp('^(?=.*[A-Z])'), 'Upper Case')
      .pattern(new RegExp('^(?=.*[a-z])'), 'Lower Case')
      .pattern(new RegExp('^(?=.*[0-9])'), 'Number')
      .required()
      .messages({
        'string.min': 'Password should contain at least 8 Character',
        'string.pattern.name': 'Password should contain at least one {#name}'
      }),
    confirmPassword: Joi.valid(joi.ref('password')).required(),
    dob: joi.date().format('YYYY-MM-DD').required().min('1990-01-01').max(today)
  }),
  //dob: joi.date().format('YYYY-MM-DDTHH:mm:ssZ').required().min('1990-01-01T00:00:00Z').max(today)
  login: Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required()
  }),
  token: Joi.object({
    token: Joi.string().required()
  }),

  changePassword: Joi.object({
    oldPassword: Joi.string()
      .required()
      .min(8)
      .max(15)
      .pattern(new RegExp('^(?=.*[!@#$%^&*])'), 'Special Character')
      .pattern(new RegExp('^(?=.*[A-Z])'), 'Upper Case')
      .pattern(new RegExp('^(?=.*[a-z])'), 'Lower Case')
      .pattern(new RegExp('^(?=.*[0-9])'), 'Number')
      .messages({
        'string.min': 'Invalid Old password',
        'string.pattern.name': 'Invalid Old password'
      }),
    password: Joi.string()
      .min(8)
      .max(15)
      .pattern(new RegExp('^(?=.*[!@#$%^&*])'), 'Special Character')
      .pattern(new RegExp('^(?=.*[A-Z])'), 'Upper Case')
      .pattern(new RegExp('^(?=.*[a-z])'), 'Lower Case')
      .pattern(new RegExp('^(?=.*[0-9])'), 'Number')
      .required()
      .messages({
        'string.min': 'Password should contain at least 8 Character',
        'string.pattern.name': 'Password should contain at least one {#name}'
      }),
    confirmPassword: Joi.valid(joi.ref('password')).required()
  }),

  forgotPassword: Joi.object({
    email: Joi.string().email().required()
  }),

  resetPassword: Joi.object({
    email: Joi.string().email().required(),
    resetCode: Joi.string().required().min(6).max(6),
    password: Joi.string()
      .required()
      .min(8)
      .max(15)
      .pattern(new RegExp('^(?=.*[!@#$%^&*])'), 'Special Character')
      .pattern(new RegExp('^(?=.*[A-Z])'), 'Upper Case')
      .pattern(new RegExp('^(?=.*[a-z])'), 'Lower Case')
      .pattern(new RegExp('^(?=.*[0-9])'), 'Number')
      .required()
      .messages({
        'string.min': 'Password should contain at least 8 Character',
        'string.pattern.name': 'Password should contain at least one {#name}'
      }),
    confirmPassword: Joi.valid(joi.ref('password')).required()
  }),

  activationSchema: Joi.object({
    code: Joi.string().required()
  })
};
