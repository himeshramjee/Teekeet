import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

import { User } from "../models/user";
import { BadRequestError } from "../errors/bad-request-error";
import { validateRequest } from "../middlewares/validate-request";

const router = express.Router();

router.post(
  "/api/users/sign-up",
  [
    body("email").isEmail().withMessage("Email is not valid"),
    body("password")
      .trim()
      .isLength({ min: 8, max: 20 })
      .withMessage("Password must be between 8 and 20 characters long."),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    // Check if email is already registered
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError("Email Address", "Email is not available.");
    }

    // Add new user to database
    const user = User.build({ email, password });
    await user.save();

    // Synchronously generate JWT token
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );

    // Store in session object
    req.session!.jwt = userJwt;

    res.status(201).send(user);
  }
);

export { router as signUpRouter };
