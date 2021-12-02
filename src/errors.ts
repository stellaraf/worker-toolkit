export class WorkerError extends Error {
  public statusCode: number;
  constructor(message: string, statusCode: number = 500) {
    super();
    this.message = message;
    this.statusCode = statusCode;
  }
}

/** Raised when a token is invalid. */
export class TokenError extends WorkerError {}

/** Raised when a request is improperly formatted. */
export class InvalidRequestError extends WorkerError {}
