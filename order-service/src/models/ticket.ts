import mongoose from "mongoose";
import { Order, OrderStatus } from "./order";

interface RequiredTicketAttrs {
  title: string;
  price: number;
}

interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;

  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: RequiredTicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
  }
});

ticketSchema.statics.build = (attrs: RequiredTicketAttrs) => {
  return new Ticket(attrs);
};

ticketSchema.methods.isReserved = async function () {
  const blockingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [ 
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete
      ]
    }
  });

  return !!blockingOrder;
}

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket, TicketDoc };