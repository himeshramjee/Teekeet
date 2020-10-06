import express, { Request, Response } from "express";
import { body } from "express-validator";

import {
  checkUserIsAuthorized,
  validateRequest,
  BadRequestError,
} from "@chaiwala/common";

import { Ticket } from "../../src/models/ticket";

const router = express.Router();
const currencySymbol = "R";

router.post(
  "/api/tickets/create",
  checkUserIsAuthorized,
  [
    body("title").trim().isLength({ min: 2 }).withMessage("Title is required"),
    body("title").not().contains("!@#$%").withMessage("Invalid Title"),
    body("price").trim().notEmpty().withMessage("Price is required"),
    body("price")
      .isCurrency({
        allow_negatives: false,
        symbol: currencySymbol,
        require_symbol: true,
      })
      .withMessage("Invalid currency or value"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    let { title, price } = req.body;
    const userID = req.currentUser!.id;

    // Strip the currency formatting as we're storing the price as a Number
    price = price.replace(currencySymbol, "").replace(",", "");

    // Check if the ticket has already been created by current user
    let duplicateTicket = await Ticket.findOne({ title, price, userID });

    if (duplicateTicket) {
      throw new BadRequestError(
        "Duplicate ticket",
        `User (${userID}) has already created a ticket with title "${title} and price ${price}".`
      );
    } else {
      console.log("Ticket creation validated, adding to database now...");

      // Add new ticket to database
      const newTicket = Ticket.build({ title, price, userID });
      await newTicket.save();

      return res.status(201).send(newTicket);
    }
  }
);

export { router as createTicketRouter };
