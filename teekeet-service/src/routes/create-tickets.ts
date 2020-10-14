import express, { Request, Response } from "express";
import { body } from "express-validator";
import { ticketCreatedPublisher } from "../events/publishers/ticket-created-publisher";

import {
  checkUserIsAuthorized,
  validateRequest,
  BadRequestError,
} from "@chaiwala/common";
import {
  defaultCurrencySymbol,
  removeCurrencyFormatting,
} from "../utils/currency-utils";

import { Ticket } from "../models/ticket";

const router = express.Router();

router.post(
  "/api/tickets/",
  checkUserIsAuthorized,
  [
    body("title")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Title is required (minimum 2 characters)"),
    body("title").not().contains("!@#$%").withMessage("Invalid Title"), // demonstration only
    body("price")
      .isCurrency({
        allow_negatives: false,
        symbol: defaultCurrencySymbol,
        require_symbol: true,
      })
      .withMessage(
        `Invalid currency or value (expected format: ${defaultCurrencySymbol}1,010.10)`
      ),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    let { title, price } = req.body;
    const userID = req.currentUser!.id;

    // Strip the currency formatting as we're storing the price as a Number
    price = removeCurrencyFormatting(price);

    // Check if the ticket has already been created by current user
    let duplicateTicket = await Ticket.findOne({ title, price, userID });

    if (duplicateTicket) {
      throw new BadRequestError(
        "Duplicate ticket",
        `User (${userID}) has already created a ticket with title "${title} and price ${price}".`
      );
    } else {
      // Add new ticket to database
      const newTicket = Ticket.build({ title, price, userID });
      await newTicket.save();

      // Publish new ticket event
      await ticketCreatedPublisher.publishEvent({
        id: newTicket.id,
        userID: newTicket.userID,
        price: newTicket.price,
        title: newTicket.title
      });

      return res.status(201).send(newTicket);
    }
  }
);

export { router as createTicketRouter };
