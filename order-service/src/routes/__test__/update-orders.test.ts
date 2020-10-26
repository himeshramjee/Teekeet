import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { OrderDoc, OrderStatus } from "../../models/order";
import { TicketDoc } from "../../models/ticket";
import { createFakeOrder, createFakeTicket } from "./test-base.test";

it("Rejects update request for unauthenticated user", async () => {
  await request(app).put("/api/orders/1234asdf").send({}).expect(401);
});

it("Rejects put request for order owned by another user", async () => {
  // Create fake ticket
  const fakeTicket: TicketDoc = await createFakeTicket();
  
  // Create dummy order
  const order: OrderDoc = await createFakeOrder(fakeTicket.id, fakeTicket.price, global.signInTestUser());

  // Update order owned by another user
  await request(app)
    .put(`/api/orders/${order.id}`)
    .set("Cookie", global.signInTestUser())
    .send({
    })
    .expect(401);
});

it("Accepts put requests on /api/orders/", async () => {
  const orderUserID = new mongoose.Types.ObjectId().toHexString();
  
  const response = await request(app)
    .put(`/api/orders/${orderUserID}`)
    .set("Cookie", global.signInTestUser(orderUserID))
    .send({
      
    });

  expect(response.status).not.toEqual(400);
});

it("Rejects put request with missing Order ID", async () => {
  // Create fake ticket
  const fakeTicket = await createFakeTicket();
  
  // Update fake ticket
  await request(app)
    .put("/api/orders/")
    .set("Cookie", global.signInTestUser())
    .send({
    })
    .expect(404);
});

it("Rejects put request with an invalid Order ID", async () => {
  // Update fake ticket
  await request(app)
    .put("/api/orders/asdf")
    .set("Cookie", global.signInTestUser())
    .send({
    })
    .expect(400);
});

it("Accepts a delete request to cancel an order", async () => {
  const fakeTicket: TicketDoc = await createFakeTicket();
  const cookies = global.signInTestUser();

  const response = await request(app)
    .post("/api/orders/")
    .set("Cookie", cookies)
    .send({
      ticketID: fakeTicket.id,
      price: fakeTicket.price
    });

  expect(response.status).toEqual(201);
  expect(response.body.status).toEqual(OrderStatus.Created);

  await request(app)
    .delete(`/api/orders/${response.body.id}`)
    .set("Cookie", cookies)
    .expect(200);
});

it("Rejects a delete request to cancel a cancelled order", async () => {
  const fakeTicket: TicketDoc = await createFakeTicket();
  const cookies = global.signInTestUser();

  const response = await request(app)
    .post("/api/orders/")
    .set("Cookie", cookies)
    .send({
      ticketID: fakeTicket.id,
      price: fakeTicket.price
    });

  expect(response.status).toEqual(201);
  expect(response.body.status).toEqual(OrderStatus.Created);

  await request(app)
    .delete(`/api/orders/${response.body.id}`)
    .set("Cookie", cookies)
    .expect(200);

  // Now try and cancel an order that's already cancelled
  await request(app)
    .delete(`/api/orders/${response.body.id}`)
    .set("Cookie", cookies)
    .expect(400);
});