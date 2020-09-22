import { CustomError } from "../errors/custom-error";

export class DatabaseConnectionError extends CustomError {
  statusCode = 500;

  constructor(private subject: string, private reason: string) {
    super("Failed to connect to database");

    if (!reason || reason.trim().length == 0) {
      reason = "Failed to connect to database.";
    }

    // Trying to extend a built in class
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors() {
    return [{ subject: this.subject, message: this.reason }];
  }
}
