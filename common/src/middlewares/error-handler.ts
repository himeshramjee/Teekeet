import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/custom-error";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    const errorItems = JSON.stringify(err.serializeErrors());
    if (process.env.NODE_ENV !== "test") {
      console.log(`\t${req.path}: Error - ${errorItems}`);
    }

    return res.status(err.statusCode).send(err.serializeErrors());
  }

  let msg = `Yoh! Unhandled exception. Error message: ${err.message}.`;
  if (process.env.NODE_ENV !== "test") {
    // TODO: Find 'if debuglog'
    console.log(msg);
    console.log(err.stack);
  }

  return res.status(500).send({
    errors: [
      {
        message: msg,
      },
    ],
  });
};
