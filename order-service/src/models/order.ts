import mongoose from "mongoose";
import { OrderStatus } from "@teekeet/common";
import { TicketDoc } from "./ticket";

export { OrderStatus };

// An interface that describes all the properties that a Order Document (single Order instance) can specify.
interface OrderDoc extends mongoose.Document {
  price: number;
  userID: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

// Interface that describes required properties to create a new Order Model
interface RequiredOrderAttrs {
  userID: string;
  price: number;
  expiresAt: Date;
  ticket: TicketDoc;
}

// Interface that describes the properteies that a Order Model has.
interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: RequiredOrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema(
  {
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userID: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
      required: true
    },
  },
  {
    toJSON: {
      // TODO: Yep this mixes view concerns with model so not good from an MVC pattern perspective
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

// Note the use of `function` here is important as using `=>` arrow syntax results in a different/incorrect context for `this`.
orderSchema.pre("save", async function () {
  // if (this.isModified("password")) {
  //   // Do pre save stuff
  // }
});

// Hack to leverage TypeScript attr type checking. Without this, the model is basically ignored by TypeScript.
orderSchema.statics.build = (attrs: RequiredOrderAttrs) => {
  return new Order(attrs);
};

// Note: Always ensure the model is only built off the schema after defining statics on the schema, else the new static `build` method isn't available.
// FTD: "Note: The .model() function makes a copy of schema. Make sure that you've added everything you want to schema, including hooks, before calling .model()!" - https://mongoosejs.com/docs/models.html
const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order, OrderDoc };
