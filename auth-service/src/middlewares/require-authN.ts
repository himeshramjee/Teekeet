import { Request, Response, NextFunction } from "express";

import { NotAuthorizedError } from "../errors/not-authorized-error";

export const checkUserIsAuthorized = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.currentUser) {
    throw new NotAuthorizedError("User", "Not authorized.");
  }

  next();
};
