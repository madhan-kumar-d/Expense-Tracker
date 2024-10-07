import { customErrorCode, rootException, statusCode } from './root';

export class unauthorizedException extends rootException {
  constructor(errorCode: customErrorCode) {
    super('UnAuthorized Access', statusCode.Unauthorized, errorCode);
  }
}
