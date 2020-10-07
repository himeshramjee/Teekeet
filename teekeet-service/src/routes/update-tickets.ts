import express, { Request, Response } from "express";
import { Ticket } from "../models/ticket";
import { removeCurrencyFormatting } from "../utils/currency-utils";
import { checkUserIsAuthorized, validateRequest } from "@chaiwala/common";
import { body } from "express-validator";
import { defaultCurrencySymbol } from "../utils/currency-utils";

const router = express.Router();

router.post(
  "/api/tickets/update",
  checkUserIsAuthorized,
  [
    body("title").trim().isLength({ min: 2 }).withMessage("Title is required"),
    body("price").isCurrency({
      allow_negatives: false,
      symbol: defaultCurrencySymbol,
      require_symbol: true,
    }),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    let { id, title, price } = req.body;
    price = removeCurrencyFormatting(price);

    let ticketToUpdate = await Ticket.findByIdAndUpdate(
      id,
      {
        title: title,
        price: price,
      },
      {
        useFindAndModify: false,
        new: true /* true to return the updated obj with all (even server side) modifications, false to return the original */,
      }
    ).catch((error) => {
      console.log("error");
    });

    res.status(200).send(ticketToUpdate);
  }
);

export { router as updateTicketsRouter };
