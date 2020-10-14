import express, { Request, Response } from "express";
import { Ticket } from "../models/ticket";
import { removeCurrencyFormatting } from "../utils/currency-utils";
import { defaultCurrencySymbol } from  "../utils/currency-utils";
import { checkUserIsAuthorized, NotAuthorizedError } from "@chaiwala/common";
import { NotFoundError, validateRequest } from "@chaiwala/common";

import { body, param } from "express-validator";
import { ticketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";

const router = express.Router();

router.put(
  "/api/tickets/:id",
  checkUserIsAuthorized,
  [
    param("id").exists().withMessage("Ticket ID is required").bail(),
    body("title")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Title is required")
      .bail(),
    body("price")
      .isCurrency({
        allow_negatives: false,
        symbol: defaultCurrencySymbol,
        require_symbol: true,
      })
      .withMessage(
        `Invalid currency or value (expected format: ${defaultCurrencySymbol}1,010.10)`
      )
      .bail(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;
    const id = req.params.id;

    // Validate ticket ownership
    let ticketToUpdate = await Ticket.findById(id);
    if (!ticketToUpdate) {
      throw new NotFoundError(`Ticket (${id})`);
    }
    if (req.currentUser!.id != ticketToUpdate.userID) {
      throw new NotAuthorizedError(
        `User (${req.currentUser!.id})`,
        `Update to ticket ${id} rejected - not authorized.`
      );
    }

    // Update ticket
    ticketToUpdate.title = title;
    ticketToUpdate.price = removeCurrencyFormatting(price);
    await ticketToUpdate.save();

    // Publish ticket updated event
    await ticketUpdatedPublisher.publishEvent({
        id: ticketToUpdate.id,
        userID: ticketToUpdate.userID,
        price: ticketToUpdate.price,
        title: ticketToUpdate.title
      });

    res.status(200).send(ticketToUpdate);
  }
);

export { router as updateTicketsRouter };
