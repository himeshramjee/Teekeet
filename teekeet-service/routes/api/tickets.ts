import express, { Request, Response } from "express";
import { checkUserIsAuthorized } from "@chaiwala/common";

const router = express.Router();

router.post(
  "/api/tickets",
  checkUserIsAuthorized,
  (req: Request, res: Response) => {
    res.status(200).send({});
  }
);

export { router as ticketsRouter };
