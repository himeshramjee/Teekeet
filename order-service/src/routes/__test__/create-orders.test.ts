import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";

import { createFakeTicket } from "./test-base.test";
import { formatCurrency } from "@chaiwala/common";
import { OrderStatus } from "@teekeet/common";
import { TicketDoc } from "../../models/ticket";

it("Has a route handler listening to /api/orders for post requests", async () => {
  await request(app)
    .post("/api/orders/")
    .send({})
    .then((response) => {
      expect(response.status).not.toEqual(404);
    });
});

it("Rejects unauthenticated users", async () => {
  await request(app)
    .post("/api/orders/")
    .then((response) => {
      expect(response.status).toEqual(401);

      // FIXME: This is more illustrative right now. Serves only to point out that these tests aren't great in what they assert/expect. Right now I've only got magic strings to work with and so need a better plan.
      expect(response.body.errors[0].message).toEqual("Not authorized.");
    });
});

it("Does not return 401 for authenticated users", async () => {
  await request(app)
    .post("/api/orders/")
    .set("Cookie", global.signInTestUser())
    .then((response) => {
      expect(response.status).not.toEqual(401);
    });
});

it("Returns 400 for missing ticketID", async () => {
  await request(app)
    .post("/api/orders/")
    .set("Cookie", global.signInTestUser())
    .send({
      price: 10.0,
    })
    .then((response) => {
      expect(response.status).toEqual(400);
    });
});

it("Returns 400 for missing price", async () => {
  const newTicketID = "5f8981732f2c6e0018c97f1d";

  await request(app)
    .post("/api/orders/")
    .set("Cookie", global.signInTestUser())
    .send({
      ticketID: newTicketID,
    })
    .then((response) => {
      expect(response.status).toEqual(400);
    });
});

it("Returns 400 for invalid price", async () => {
  const newTicketID = "5f8981732f2c6e0018c97f1d";

  await request(app)
    .post("/api/orders/")
    .set("Cookie", global.signInTestUser())
    .send({
      ticketID: newTicketID,
      price: -300
    })
    .then((response) => {
      expect(response.status).toEqual(400);
    });
});

it("Returns 400 for invalid ticket", async () => {
  const newTicketID = mongoose.Types.ObjectId();

  await request(app)
    .post("/api/orders/")
    .set("Cookie", global.signInTestUser())
    .send({
      ticketID: newTicketID,
      price: 10.00
    })
    .then((response) => {
      expect(response.status).toEqual(404);
    });
});


it("Returns 201 for an authenticated user creating a new order", async () => {
  const fakeTicket: TicketDoc = await createFakeTicket();

  await request(app)
    .post("/api/orders/")
    .set("Cookie", global.signInTestUser())
    .send({
      ticketID: fakeTicket.id,
      price: fakeTicket.price
    })
    .then((response) => {
      expect(response.status).toEqual(201);
      expect(response.body.id).not.toBeNull();
      expect(response.body.price).toEqual(fakeTicket.price);
      expect(response.body.status).toEqual(OrderStatus.Created);
    });
});