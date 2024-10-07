import { customErrorCode, rootException, statusCode } from './root';

export class ConflictException extends rootException {
  constructor(errorCode: customErrorCode, error: any) {
    super('Conflict the Request Data', statusCode.Conflict, errorCode, error);
  }
}
