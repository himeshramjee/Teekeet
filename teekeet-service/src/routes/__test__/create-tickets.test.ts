import request from "supertest";
import { app } from "../../app";
import { ticketCreatedPublisher } from "../../events/publishers/ticket-created-publisher";
import { Ticket } from "../../models/ticket";

import { createDummyTicket } from "./test-base.test";

it("Has a route handler listening to /api/tickets for post requests", async () => {
  await request(app)
    .post("/api/tickets/")
    .send({})
    .then((response) => {
      expect(response.status).not.toEqual(404);
    });
});

it("Rejects unauthenticated users", async () => {
  await request(app)
    .post("/api/tickets/")
    .then((response) => {
      expect(response.status).toEqual(401);
    });
});

it("Does not return 401 for authenticated users", async () => {
  await request(app)
    .post("/api/tickets/")
    .set("Cookie", global.signInTestUser())
    .then((response) => {
      expect(response.status).not.toEqual(401);
    });
});

it("Returns an error for invalid title character length", async () => {
  await request(app)
    .post("/api/tickets/")
    .set("Cookie", global.signInTestUser())
    .send({
      title: "a",
      price: 10.0,
    })
    .expect(400);
});

it("Returns an error for missing title", async () => {
  await request(app)
    .post("/api/tickets/")
    .set("Cookie", global.signInTestUser())
    .send({
      price: 10.0,
    })
    .expect(400);
});

it("Returns an error for invalid title characters", async () => {
  await request(app)
    .post("/api/tickets/")
    .set("Cookie", global.signInTestUser())
    .send({
      title: "aaa!@#$%fff",
      price: 10.0,
    })
    .expect(400);
});

it("Returns an error for missing price", async () => {
  await request(app)
    .post("/api/tickets/")
    .set("Cookie", global.signInTestUser())
    .send({
      title: "Happy pup",
    })
    .expect(400);
});

it("Returns an error for negative price value", async () => {
  await request(app)
    .post("/api/tickets/")
    .set("Cookie", global.signInTestUser())
    .send({
      title: "Happy pup",
      price: "R-10.00",
    })
    .expect(400);
});

it("Returns an error for incorrect price symbol", async () => {
  await request(app)
    .post("/api/tickets/")
    .set("Cookie", global.signInTestUser())
    .send({
      title: "Happy pup",
      price: "$10.00",
    })
    .expect(400);
});

it("Creates a ticket with valid inputs", async () => {
  // Get a count of all tickets - should be zero
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  await createDummyTicket("Happy pup", "R1,010.10").expect(201);

  // Check the count of all tickets now - should be one
  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
});

it("Rejects creation of duplicate ticket", async () => {
  const response = await createDummyTicket(/* Use method defaults */).expect(
    201
  );
  await createDummyTicket(
    undefined,
    undefined,
    response.body.userID /* Use method defaults */
  ).expect(400);
});

it("Publishes an event when a ticket is created", async() => {
  const response = await createDummyTicket(/* Use method defaults */).expect(
    201
  );

  expect(ticketCreatedPublisher.publishEvent).toHaveBeenCalled();
});