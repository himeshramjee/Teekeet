import { CustomError } from "./custom-error";

export class NotFoundError extends CustomError {
  statusCode = 404;

  constructor(public field: string) {
    super("Resource not found.");

    // oh my.
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return [{ message: "Invalid resource requested.", subject: this.field }];
  }
}
