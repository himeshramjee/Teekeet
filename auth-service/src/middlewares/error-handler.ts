import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/custom-error";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Something went wrong. Oh my hat!!!");
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send(err.serializeErrors());
  }

  return res.status(500).send({
    errors: [
      { message: `Unhandled exception. Error message: ${err.message}.` },
    ],
  });
};
