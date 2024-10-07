import { customErrorCode, rootException, statusCode } from './root';

export class customException extends rootException {
  constructor(
    message: string,
    statusCode: statusCode,
    errorCode: customErrorCode
  ) {
    super(message, statusCode, errorCode);
  }
}
