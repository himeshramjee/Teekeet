// Interface vs Abstract class: abstract classes are generated and usable at runtime (e.g. instanceof).
// So using Abstract class to define the custom error type would allow for much simpler and generic code in the handler.
// Ensuring that the separation of concerns or responsibilities is correctly  maintained.
export abstract class CustomError extends Error {
  abstract statusCode: number;

  constructor(message: string) {
    super(message);

    // Blindly adding this for built in types (we're extending `Error`)
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeErrors(): { errors: {
    subject: string;
    message: string;
  }[]};
}