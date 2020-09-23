import { CustomError } from "../errors/custom-error";

export class NotAuthorizedError extends CustomError {
  statusCode: number = 401;

  constructor(private subject: string, private errorMessage: string) {
    super(errorMessage);

    // Trying to extend a built in class
    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeErrors() {
    return { errors: [{ subject: this.subject, message: this.message }] };
  }
}
