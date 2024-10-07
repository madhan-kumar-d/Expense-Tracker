export class rootException extends Error {
  message: string;
  statusCode: statusCode;
  errorCode: customErrorCode;
  errors?: any;
  constructor(
    message: string,
    statusCode: statusCode,
    errorCode: customErrorCode,
    errors?: any
  ) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.errors = errors;
  }
}

export enum customErrorCode {
  UserAlreadyExist = 10001, // conflict
  InvalidCredentials = 10002, //UnprocessableEntity
  UserNotfound = 10003, // No Data Found
  NoDataFound = 10004, // No Data Found
  InvalidInput = 10005, //UnprocessableEntity
  InvalidToken = 10006, //unauth
  UnauthorizedAccess = 10007, //unauth
  PageNotFound = 404, // 404
  DataExist = 10008
}

export enum statusCode {
  // Default Response
  OK = 200,
  // Data Created
  Created = 201,
  // Data Updated
  Accepted = 202,
  // Invalid Token
  Unauthorized = 401,
  // Access forbidden User doesn't have access
  Forbidden = 403,
  // Not found, Page or Data not found
  NotFound = 404,
  // Conflict - User Conflict
  Conflict = 409,
  // Invalid input - Can use 400 also
  UnprocessableEntity = 422,
  // All other Errors
  InternalServerError = 500
}
