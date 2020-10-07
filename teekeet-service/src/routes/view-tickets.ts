import express, { Request, Response } from "express";

import mongoose from "mongoose";

import { validateRequest, NotFoundError } from "@chaiwala/common";
import { param } from "express-validator";
import { Ticket } from "../models/ticket";

const router = express.Router();

router.get("/api/tickets/list", async (req: Request, res: Response) => {
  const tickets = await Ticket.find({});

  res.status(200).send(tickets);
});

router.get(
  "/api/tickets/:id",
  [
    param("id")
      .exists({ checkNull: true })
      .withMessage("Ticket ID is required")
      .bail(),
    param("id").escape(), // Sanitize input - HTML only
    param("id")
      .custom((ticketID) => {
        return mongoose.Types.ObjectId.isValid(ticketID);
      })
      .withMessage("Invalid ticket id")
      .bail(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    let ticket;

    await Ticket.findById(req.params.id).then((doc) => {
      if (!doc) {
        throw new NotFoundError(`Ticket not found (${req.params.id})`);
      } else {
        ticket = doc;
      }
    });

    res.status(200).send(ticket);
  }
);

export { router as viewTicketRouter };
