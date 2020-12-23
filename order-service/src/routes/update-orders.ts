import express, { Request, Response } from "express";
import { Order, OrderStatus } from "../models/order";
import { BadRequestError, checkUserIsAuthorized, NotAuthorizedError } from "@chaiwala/common";
import { NotFoundError, validateRequest } from "@chaiwala/common";
import mongoose from "mongoose";

import { param } from "express-validator";
import { orderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";
import { orderUpdatedPublisher } from "../events/publishers/__mocks__/order-updated-publisher";

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

    // Update ticket - no-op for now
    await orderToUpdate.save();

    // Publish ticket updated event
    await orderUpdatedPublisher.publishEvent({
      id: orderToUpdate.id,
      userID: orderToUpdate.userID
    });

    res.status(200).send(orderToUpdate);
  }
);

router.delete(
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

    if (orderToUpdate.status == OrderStatus.Cancelled) {
      throw new BadRequestError(`Order`, `Order ${orderToUpdate.id} is already cancelled.`);
    }

    // Update ticket
    orderToUpdate.status = OrderStatus.Cancelled;
    await orderToUpdate.save();

    // Publish ticket updated event
    await orderCancelledPublisher.publishEvent({
      id: orderToUpdate.id,
      userID: orderToUpdate.userID,
      ticket: {
        id: orderToUpdate.ticket.id
      }
    });

    res.status(200).send(orderToUpdate);
  }
);

export { router as updateOrdersRouter };
