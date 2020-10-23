import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { removeCurrencyFormatting, formatCurrency } from "@chaiwala/common";

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
  price: string = "R300.00",
) => {
  const fakeTicket = await Ticket.build({ title, price: removeCurrencyFormatting(price) });
  fakeTicket.save();
  return fakeTicket;
};

const createFakeOrder = (
  ticketID: string,
  price: number,
  userID?: string
) => {
  const response = request(app)
  .post("/api/orders/")
  .set("Cookie", global.signInTestUser(userID))
  .send({
    ticketID: ticketID,
    price: formatCurrency(price)
  });

  return response;
};

export { createFakeTicket, createFakeOrder };
