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
      price: -10.00,
    })
    .expect(400);
});

// FIXME: The second retrieval to verify saved ticket data is only working when I drop the 'await' specifier to
//        the `Ticket.findOne(....)` function call.
it("Creates a ticket with valid inputs", async () => {
  // Get a count of all tickets - should be zero
  const tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  const fakeTicket = await createDummyTicket();
  expect(fakeTicket).not.toBeNull();

  const retrievedTicket = await Ticket.findById(fakeTicket.id);

  expect(retrievedTicket).not.toBeNull();
  expect(retrievedTicket!.title).toEqual(fakeTicket.title);
  expect(retrievedTicket!.price).toEqual(fakeTicket.price);
});

it("Rejects creation of duplicate ticket", async () => {
  const ticket1 = await createDummyTicket();

  const ticket2 = await createDummyTicket(ticket1.userID);

  expect(ticket2.errors).not.toBeNull();
});

it("Publishes an event when a ticket is created", async() => {
  const ticket1 = await createDummyTicket();
  expect(ticket1).not.toBeNull();

  expect(ticketCreatedPublisher.publishEvent).toHaveBeenCalled();
});