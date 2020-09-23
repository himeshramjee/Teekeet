import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface VerifiedUser {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: VerifiedUser;
    }
  }
}

export const setCurrentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    return next();
  }

  try {
    const verifiedUser = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    ) as VerifiedUser;
    req.currentUser = verifiedUser;
  } catch (e) {
    // User isn't verified/auth'd
  }

  next();
};
