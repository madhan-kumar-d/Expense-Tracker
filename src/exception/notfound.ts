import { customErrorCode, rootException, statusCode } from './root';

export class NotFound extends rootException {
  constructor(errorCode: customErrorCode) {
    super('Request Not Found', statusCode.NotFound, errorCode);
  }
}
