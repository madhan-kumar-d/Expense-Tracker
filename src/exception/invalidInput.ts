import { customErrorCode, rootException, statusCode } from './root';

export class InvalidInput extends rootException {
  constructor(errorCode: customErrorCode, errors: any) {
    super('Invalid Input', statusCode.UnprocessableEntity, errorCode, errors);
  }
}
