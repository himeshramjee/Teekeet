import express, { Request, Response } from "express";
import { Order } from "../models/order";
import { checkUserIsAuthorized, NotAuthorizedError } from "@chaiwala/common";
import { NotFoundError, validateRequest } from "@chaiwala/common";
import mongoose from "mongoose";

import { param } from "express-validator";

const router = express.Router();

router.put(
  "/api/orders/:id",
  checkUserIsAuthorized,
  [
    param("id").exists().withMessage("Order ID is required").bail(),
    param("id").custom((orderID) => {
      // TODO: Couples Order service to MongoDB. Should abstract that away behind a sort of strategy for interacting with different data stores.
      return mongoose.Types.ObjectId.isValid(orderID);
    })
    .withMessage((value) => { return `Invalid order id: ${value}.` })
    .bail(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const id = req.params.id;

    // Validate order ownership
    let orderToUpdate = await Order.findById(id);
    if (!orderToUpdate) {
      throw new NotFoundError(`Order (${id})`);
    }
    if (req.currentUser!.id != orderToUpdate.userID) {
      throw new NotAuthorizedError(
        `User (${req.currentUser!.id})`,
        `Update to order ${id} rejected - not authorized.`
      );
    }

    // Update ticket
    await orderToUpdate.save();

    // Publish ticket updated event
    // TODO: Missing impl

    res.status(500).send(orderToUpdate);
  }
);

export { router as updateOrdersRouter };
