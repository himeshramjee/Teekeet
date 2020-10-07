import request from "supertest";
import { app } from "../../app";
import { createDummyTicket } from "./test-base";
import { removeCurrencyFormatting } from "../../utils/currency-utils";

it("Accepts requests on /api/tickets/update", async () => {
  // Create fake ticket
  const ticket = (await createDummyTicket().expect(201)).body;

  // Update title and price data
  const newTitle = `${ticket.title} 1`;
  const newPrice = "R30.00";

  // Update fake ticket
  await request(app)
    .post("/api/tickets/update")
    .set("Cookie", global.signInTestUser())
    .send({
      id: ticket.id,
      title: newTitle,
      price: newPrice,
    })
    .expect(200);

  // Get fake ticket
  const response = await request(app)
    .get(`/api/tickets/${ticket.id}`)
    .expect(200);

  // Validate ticket info
  expect(response.body.title).toEqual(newTitle);
  expect(response.body.price).toEqual(removeCurrencyFormatting(newPrice));
});

it("Rejects update request with missing title", async () => {
  // Create fake ticket
  const ticket = (await createDummyTicket().expect(201)).body;

  // Update fake ticket
  await request(app)
    .post("/api/tickets/update")
    .set("Cookie", global.signInTestUser())
    .send({
      id: ticket.id,
      price: "R30.00",
    })
    .expect(400);
});

it("Rejects update request with negative price", async () => {
  // Create fake ticket
  const ticket = (await createDummyTicket().expect(201)).body;

  // Update fake ticket
  await request(app)
    .post("/api/tickets/update")
    .set("Cookie", global.signInTestUser())
    .send({
      id: ticket.id,
      title: "Reject me",
      price: "-R30.00",
    })
    .expect(400);
});

it("Rejects update request with missing currency symbol", async () => {
  // Create fake ticket
  const ticket = (await createDummyTicket().expect(201)).body;

  // Update fake ticket
  await request(app)
    .post("/api/tickets/update")
    .set("Cookie", global.signInTestUser())
    .send({
      id: ticket.id,
      title: "Reject me",
      price: "50.00",
    })
    .expect(400);
});

it("Rejects update request with wrong currency", async () => {
  // Create fake ticket
  const ticket = (await createDummyTicket().expect(201)).body;

  // Update fake ticket
  await request(app)
    .post("/api/tickets/update")
    .set("Cookie", global.signInTestUser())
    .send({
      id: ticket.id,
      title: "Reject me",
      price: "$40.00",
    })
    .expect(400);
});

it("Rejects update request with missing price", async () => {
  // Create fake ticket
  const ticket = (await createDummyTicket().expect(201)).body;

  // Update fake ticket
  await request(app)
    .post("/api/tickets/update")
    .set("Cookie", global.signInTestUser())
    .send({
      id: ticket.id,
      title: "Reject me",
    })
    .expect(400);
});

it("Rejects update request with missing title and price", async () => {
  // Create fake ticket
  const ticket = (await createDummyTicket().expect(201)).body;

  // Update fake ticket
  await request(app)
    .post("/api/tickets/update")
    .set("Cookie", global.signInTestUser())
    .send({
      id: ticket.id,
    })
    .expect(400);
});

it("Rejects update request for unauthenticated user", async () => {
  // Update fake ticket
  await request(app).post("/api/tickets/update").send({}).expect(401);
});
