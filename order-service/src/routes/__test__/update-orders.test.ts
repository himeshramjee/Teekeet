import request from "supertest";
import { app } from "../../app";
import { createFakeTicket } from "./test-base.test";
import { removeCurrencyFormatting } from "@chaiwala/common";

it("Rejects update request for unauthenticated user", async () => {
  // Update fake ticket
  await request(app).put("/api/orders/1234asdf").send({}).expect(401);
});

it("Rejects put request for order owned by another user", async () => {
  // Create fake ticket
  const fakeTicket = await createFakeTicket();
  
  // Create dummy order
  const order = { id: "" };

  // Update order data

  // Update order owned by another user
  await request(app)
    .put(`/api/orders/${order.id}`)
    .set("Cookie", global.signInTestUser())
    .send({
    })
    .expect(401);

  // Get fake order
  const response = await request(app)
    .get(`/api/orders/${order.id}`)
    .expect(200);

  // Validate order info
  expect(response.body.id).toEqual(order.id);
});

it("Accepts put requests on /api/orders/", async () => {
  // Create fake ticket
  const fakeTicket = await createFakeTicket();
  
  // Create dummy order
  const order = { id: "", userID: "" };

  // Update order data

  // Update fake order
  await request(app)
    .put(`/api/orders/${order.id}`)
    .set("Cookie", global.signInTestUser(order.userID))
    .send({
    })
    .expect(200);

  // Get fake order
  const response = await request(app)
    .get(`/api/orders/${order.id}`)
    .expect(200);

  // Validate order info
  expect(response.body.id).toEqual(order.id);
});

it("Rejects put request with missing ticketID", async () => {
  // Create fake ticket
  const fakeTicket = await createFakeTicket();
  
  // Update fake ticket
  await request(app)
    .put("/api/orders/")
    .set("Cookie", global.signInTestUser())
    .send({
      ticketID: fakeTicket.id
    })
    .expect(404);
});