import { Request, Response, NextFunction } from "express";
import { RequestValidationError } from "../errors/request-validation-error";
import { validationResult } from "express-validator";

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const requestValidationErrors = validationResult(req);
    if (!requestValidationErrors.isEmpty()) {
      throw new RequestValidationError(requestValidationErrors.array());
    }

    next();
};