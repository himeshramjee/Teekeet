import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import mongoose from "mongoose";
import { OrderDoc } from "../../models/order";

// FIXME: *cough* Good tests, good tests. *cough*

it("Returns a fake ticket", async () => {
  const ticket = await createFakeTicket();
  expect(ticket).not.toBeNull();
});

it("Returns a fake order", async () => {
  const ticket = await createFakeTicket();
  const order = await createFakeOrder(ticket.id, ticket.price);
  expect(order).not.toBeNull();
});

const createFakeTicket = async (
  title: string = "Chaiwala 2020 Hits",
  price: number = 300,
) => {
  const fakeTicket = await Ticket.build({ 
    title, 
    price: price,
    userID: new mongoose.Types.ObjectId().toHexString() 
  });
  fakeTicket.save();

  return fakeTicket;
};

const createFakeOrder = async (
  ticketID: string,
  price: number,
  userID?: string
) => {
  const response = await request(app)
  .post("/api/orders/")
  .set("Cookie", global.signInTestUser(userID))
  .send({
    ticketID: ticketID,
    price: price
  });
  
  return response.body;
};

export { createFakeTicket, createFakeOrder };
