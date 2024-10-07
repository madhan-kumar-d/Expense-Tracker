import { NextFunction, Response, Request } from 'express';
import { customErrorCode, InvalidInput } from '../exception';
import Joi from 'joi';

export const validate = (Schema: Joi.ObjectSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const { error } = Schema.validate(req.body, { abortEarly: false });
    if (error) {
      throw new InvalidInput(
        customErrorCode.InvalidInput,
        error.details.map((detail) => detail.message).join(', ')
      );
    }
    next();
  };
};

export const getValidate = (Schema: Joi.ObjectSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const { error } = Schema.validate(req.params, { abortEarly: false });
    if (error) {
      throw new InvalidInput(
        customErrorCode.InvalidInput,
        error.details.map((detail) => detail.message).join(', ')
      );
    }
    next();
  };
};

export const queryValidate = (Schema: Joi.ObjectSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const { error } = Schema.validate(req.query, { abortEarly: false });
    if (error) {
      throw new InvalidInput(
        customErrorCode.InvalidInput,
        error.details.map((detail) => detail.message).join(', ')
      );
    }
    next();
  };
};
