import express, { Request, Response } from "express";

import mongoose from "mongoose";

import { validateRequest, NotFoundError, checkUserIsAuthorized } from "@chaiwala/common";
import { param } from "express-validator";
import { Order } from "../models/order";

const router = express.Router();

router.get(
  "/api/orders/",
  checkUserIsAuthorized, 
  async (req: Request, res: Response) => {
    const orders = await Order.find({ userID: req.currentUser!.id });

    res.status(200).send(orders);
});

router.get(
  "/api/orders/:id",
  checkUserIsAuthorized,
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
    let order;

    await Order.findById(req.params.id).then((doc) => {
      if (!doc) {
        throw new NotFoundError(`Order not found (${req.params.id})`);
      } else {
        order = doc;
      }
    });

    res.status(200).send(order);
  }
);

export { router as viewOrdersRouter };
