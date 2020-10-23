import express, { Request, Response } from "express";
import { Order } from "../models/order";
import { checkUserIsAuthorized, NotAuthorizedError } from "@chaiwala/common";
import { NotFoundError, validateRequest } from "@chaiwala/common";

import { param } from "express-validator";

const router = express.Router();

router.put(
  "/api/orders/:id",
  checkUserIsAuthorized,
  [
    param("id").exists().withMessage("Order ID is required").bail()
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
    

    res.status(500).send(orderToUpdate);
  }
);

export { router as updateOrdersRouter };
