import express, { Request, Response } from "express";
import { body } from "express-validator";

import mongoose from "mongoose";

import { Order } from "../models/order";
import { Ticket } from "../models/ticket";

import {
  checkUserIsAuthorized,
  validateRequest,
  BadRequestError,
  NotFoundError
} from "@chaiwala/common";

const ORDER_EXPIRATION_WINDOW_SECONDS = parseInt(process.env.ORDER_EXPIRATION_WINDOW_SECONDS!);

const router = express.Router();

router.post("/api/orders/",
checkUserIsAuthorized,
[
  body("ticketID")
    .exists({ checkNull: true })
    .withMessage("Ticket ID is required")
    .bail(),
  body("ticketID").escape(), // Sanitize input - HTML only
  body("ticketID")
    .custom((ticketID) => {
      // TODO: Couples Order service to MongoDB. Should abstract that away behind a sort of strategy for interacting with different data stores.
      return mongoose.Types.ObjectId.isValid(ticketID);
    })
    .withMessage((value) => { return `Invalid ticket id: ${value}.` })
    .bail(),
  body("price")
    .isCurrency({
      allow_negatives: false
    })
    .withMessage((value) => {
        return `Invalid currency or value (expected format: <currency-symbol> 1,000,010.10 but got ${value}.)`;  
      }
    )
],
validateRequest,
async (req: Request, res: Response) => {
  let { ticketID, price } = req.body;

  // Validate the ticket
  let ticket = await Ticket.findById(ticketID);
  if (!ticket) {
    throw new NotFoundError(`Ticket not found (${ticketID})`);
  }

  // Make sure the ticket is not already reserved
  if (await ticket.isReserved()) {
    throw new BadRequestError("Ticket", `Ticket is currently reserved`)
  }

  // Calculate order expiration time
  const expirationTime = new Date();
  expirationTime.setSeconds(expirationTime.getSeconds() + ORDER_EXPIRATION_WINDOW_SECONDS);

  // Add new order to DB
  const newOrder = Order.build({ userID: req.currentUser!.id, price, ticket, expiresAt: expirationTime });
  await newOrder.save();

  // TODO: Publish new order event

  // Return response
  res.status(201).send(newOrder);
});

export { router as createOrdersRouter };