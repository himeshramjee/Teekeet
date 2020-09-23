import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

import { validateRequest } from "../middlewares/validate-request";
import { Secrets } from "../utilities/secrets";
import { User } from "../models/user";
import { BadRequestError } from "../errors/bad-request-error";

const router = express.Router();

router.post(
  "/api/users/sign-in",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").trim().notEmpty().withMessage("Password is required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      throw new BadRequestError(
        "Invalid user info",
        "Email or Password is invalid."
      );
    }

    if (!Secrets.comparePasswordHashes(existingUser.password, password)) {
      throw new BadRequestError(
        "Invalid user info",
        "Email or Password is invalid."
      );
    }

    // Synchronously generate JWT token
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
    );

    // Store in session object
    req.session!.jwt = userJwt;

    res.status(200).send(`Welcome ${existingUser.email}`);
  }
);

export { router as signInRouter };
