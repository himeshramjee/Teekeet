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
    let items: { subject: string, message: string }[];
    items = [];

    this.errors.map((error) => {
      items.push({ subject: error.param, message: error.msg });
    });

    return { errors: items };
  }
}
