import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

import { createDummyTicket } from "./test-base.test";

let dummyID = new mongoose.Types.ObjectId().toHexString();

it("Has a route to handle unauthenticated requests to /api/tickets/:id", async () => {
  await request(app)
    .get(`/api/tickets/${dummyID}`)
    .then((response) => {
      expect(response.status).not.toEqual(401);
    });
});

it("Returns a status 200 for a valid ticket id", async () => {
  const title = "Happiest pup";
  const price = "R1,010.30";

  // Create a fake ticket
  const testTicket = (await createDummyTicket(title, price)).body;

  // Get fake ticket
  const response = await request(app)
    .get(`/api/tickets/${testTicket.id}`)
    .expect(200);

  // Validate ticket info
  expect(response.body.title).toEqual(title);
  expect(response.body.price).toEqual(1010.3);
});

it("Returns a status 404 for an non-existent ticket id", async () => {
  const ticketID = "1110000e0f5fe59b52000000";
  await request(app).get(`/api/tickets/${ticketID}`).expect(404);
});

it("Returns a status 400 for an malformed ticket id", async () => {
  const ticketID = "-- Drop Ticket;";
  await request(app).get(`/api/tickets/${ticketID}`).expect(400);
});

it("Has route to handle unauthenticated requestes to /api/tickets/list and return status 200", async () => {
  const ticketsData = [
    { title: "Happy pup", price: "R1,010.10" },
    { title: "Happier pupper", price: "R1,010.20" },
    { title: "Happiest puppy", price: "R1,010.30" },
  ];

  let newTickets = new Array();

  await Promise.all(
    ticketsData.map(async (ticket) => {
      const newT = (await createDummyTicket(ticket.title, ticket.price)).body;
      newTickets.push(newT);
    })
  );

  expect(newTickets.length).toBeGreaterThan(0);

  const ticketListResponse = await request(app)
    .get(`/api/tickets/list`)
    .expect(200);

  expect(ticketListResponse.body.length).toEqual(3);
});
