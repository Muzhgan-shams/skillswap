export class AppError extends Error {
  // inherits everything from built-in Error class(message, stack, name)
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor); //node specific method - clean stack trace
  }
}
