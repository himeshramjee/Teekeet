import express, { Request, Response } from "express";
import { body } from "express-validator";
import { ticketCreatedPublisher } from "../events/publishers/ticket-created-publisher";

import {
  checkUserIsAuthorized,
  validateRequest,
  BadRequestError,
  removeCurrencyFormatting
} from "@chaiwala/common";

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
        allow_space_after_symbol: true
      })
      .withMessage((value) => {
        return `Invalid currency or value (expected format: <currency-symbol> 1,000,010.10 but got ${value}.)`;
        } 
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
