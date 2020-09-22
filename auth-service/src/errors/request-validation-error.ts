import { ValidationError } from "express-validator";
import { CustomError } from "../errors/custom-error";

export class RequestValidationError extends CustomError {
  statusCode: number = 400;

  constructor(private errors: ValidationError[]) {
    super("Request has failed validation.");

    // Trying to extend a built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map((error) => {
      return { subject: error.param, message: error.msg };
    });
  }
}
