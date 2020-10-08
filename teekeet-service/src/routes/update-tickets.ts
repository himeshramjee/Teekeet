import express, { Request, Response } from "express";
import { Ticket } from "../models/ticket";
import {
  removeCurrencyFormatting,
  defaultCurrencySymbol,
} from "../utils/currency-utils";
import {
  checkUserIsAuthorized,
  NotAuthorizedError,
  NotFoundError,
  validateRequest,
} from "@chaiwala/common";
import { body, param } from "express-validator";

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

    res.status(200).send(ticketToUpdate);
  }
);

export { router as updateTicketsRouter };
