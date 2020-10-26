import request from "supertest";
import { app } from "../../app";
import { createFakeOrder, createFakeTicket } from "./test-base.test";

it("Has a route handler listening to /api/orders for post requests", async () => {
  await request(app)
    .get("/api/orders/")
    .send({})
    .then((response) => {
      expect(response.status).not.toEqual(404);
    });
});

it("Rejects unauthenticated users", async () => {
  await request(app)
    .get("/api/orders/")
    .then((response) => {
      expect(response.status).toEqual(401);
    });
});

it("Does not return 401 for authenticated users", async () => {
  await request(app)
    .get("/api/orders/")
    .set("Cookie", global.signInTestUser())
    .then((response) => {
      expect(response.status).not.toEqual(401);
    });
});

it("Returns 400 for invalid ticketID", async () => {

  await request(app)
    .get(`/api/orders/asdf`)
    .set("Cookie", global.signInTestUser())
    .then((response) => {
      expect(response.status).toEqual(400);
    });
});

it("Returns 200 for authenticated users", async () => {
  await request(app)
    .get("/api/orders/")
    .set("Cookie", global.signInTestUser())
    .expect(200);
});

it("Returns ticket data with the order list", async () => {
  const userCookies = global.signInTestUser();
  const fakeTicket = await createFakeTicket();
  const fakeOrder = await createFakeOrder(fakeTicket.id, fakeTicket.price, userCookies);

  const response = await request(app)
    .get("/api/orders/")
    .set("Cookie", userCookies)
    .expect(200);

  expect(response.body[0].id).toEqual(fakeOrder.id);
  expect(response.body[0].ticket).not.toBeNull();
  expect(response.body[0].ticket.id).not.toBeNull();
  expect(response.body[0].ticket.title).toEqual(fakeTicket.title);
});


it("Returns ticket data with a single order", async () => {
  const userCookies = global.signInTestUser();
  const fakeTicket = await createFakeTicket();
  const fakeOrder = await createFakeOrder(fakeTicket.id, fakeTicket.price, userCookies);

  const response = await request(app)
    .get(`/api/orders/${fakeOrder.id}`)
    .set("Cookie", userCookies)
    .expect(200);

  expect(response.body.id).toEqual(fakeOrder.id);
  expect(response.body.ticket).not.toBeNull();
  expect(response.body.ticket.id).not.toBeNull();
  expect(response.body.ticket.title).toEqual(fakeTicket.title);
});

it("Returns 401 for attempts to read another users orders", async () => {
  const userOneCookies = global.signInTestUser();
  const userTwoCookies = global.signInTestUser();

  const fakeTicketOne = await createFakeTicket("Title 7");
  const fakeTicketTwo = await createFakeTicket("Title 8");
  
  const order1 = await createFakeOrder(fakeTicketOne.id, fakeTicketOne.price, userOneCookies);
  const order2 = await createFakeOrder(fakeTicketTwo.id, fakeTicketTwo.price, userTwoCookies);
  
  // Read another users order
  await request(app)
    .get(`/api/orders/${order1.id}`)
    .set("Cookie", userTwoCookies)
    .then((response) => {
      expect(response.status).toEqual(404);
    });

  // Read current users order
  await request(app)
    .get(`/api/orders/${order2.id}`)
    .set("Cookie", userTwoCookies)
    .then((response) => {
      expect(response.status).toEqual(200);
    });
});