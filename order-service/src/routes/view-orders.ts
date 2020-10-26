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
    const orders = await Order.find({ userID: req.currentUser!.id }).populate("ticket");

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
    const order = await Order.findById(req.params.id).populate("ticket");
    
    if (!order) {
      throw new NotFoundError(`Order not found (${req.params.id})`);
    }

    if (order.userID != req.currentUser!.id) {
      // FIXME: This is inconsistent with the update order handlers where I throw the specific NotAuthorizedError.
      //        For production, I'd need to think about whether throwing the specific error doesn't open up to
      //        a security/availablity risk.
      throw new NotFoundError(`Order not found (${req.params.id})`);
    }

    res.status(200).send(order);
  }
);

export { router as viewOrdersRouter };
