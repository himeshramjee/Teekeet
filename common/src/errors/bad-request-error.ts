import { CustomError } from "../errors/custom-error";

export class BadRequestError extends CustomError {
  statusCode: number = 400;

  constructor(private subject: string, private errorMessage: string) {
    super(errorMessage);

    // Trying to extend a built in class
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors() {
    return { errors: [{ subject: this.subject, message: this.message }]};
  }
}
