import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { OrderDoc } from "../../models/order";
import { TicketDoc } from "../../models/ticket";
import { createFakeOrder, createFakeTicket } from "./test-base.test";

it("Rejects update request for unauthenticated user", async () => {
  // Update fake ticket
  await request(app).put("/api/orders/1234asdf").send({}).expect(401);
});

it("Rejects put request for order owned by another user", async () => {
  // Create fake ticket
  const fakeTicket = await createFakeTicket();
  
  // Create dummy order
  const order = await createFakeOrder(fakeTicket.id, fakeTicket.price, fakeTicket.userID);

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