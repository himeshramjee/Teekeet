import { CustomError } from "../errors/custom-error";

export class DatabaseConnectionError extends CustomError {
  statusCode = 500;

  constructor(private subject: string, errorMessage: string) {
    super(errorMessage);

    // Trying to extend a built in class
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors() {
    return { errors: [{ subject: this.subject, message: this.message }] };
  }
}
