import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

it("Has a route handler listening to /api/tickets for post requests", async () => {
  await request(app)
    .post("/api/tickets/create")
    .send({})
    .then((response) => {
      expect(response.status).not.toEqual(404);
    });
});

it("Rejects unauthenticated users", async () => {
  await request(app)
    .post("/api/tickets/create")
    .then((response) => {
      expect(response.status).toEqual(401);
    });
});

it("Does not return 401 for authenticated users", async () => {
  await request(app)
    .post("/api/tickets/create")
    .set("Cookie", global.signInTestUser())
    .then((response) => {
      expect(response.status).not.toEqual(401);
    });
});

it("Returns an error for invalid title character length", async () => {
  await request(app)
    .post("/api/tickets/create")
    .set("Cookie", global.signInTestUser())
    .send({
      title: "a",
      price: 10.0,
    })
    .expect(400);
});

it("Returns an error for missing title", async () => {
  await request(app)
    .post("/api/tickets/create")
    .set("Cookie", global.signInTestUser())
    .send({
      price: 10.0,
    })
    .expect(400);
});

it("Returns an error for invalid title characters", async () => {
  await request(app)
    .post("/api/tickets/create")
    .set("Cookie", global.signInTestUser())
    .send({
      title: "aaa!@#$%fff",
      price: 10.0,
    })
    .expect(400);
});

it("Returns an error for missing price", async () => {
  await request(app)
    .post("/api/tickets/create")
    .set("Cookie", global.signInTestUser())
    .send({
      title: "Happy pup",
    })
    .expect(400);
});

it("Returns an error for negative price value", async () => {
  await request(app)
    .post("/api/tickets/create")
    .set("Cookie", global.signInTestUser())
    .send({
      title: "Happy pup",
      price: "R-10.00",
    })
    .expect(400);
});

it("Returns an error for incorrect price symbol", async () => {
  await request(app)
    .post("/api/tickets/create")
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

  await request(app)
    .post("/api/tickets/create")
    .set("Cookie", global.signInTestUser())
    .send({
      title: "Happy pup",
      price: "R1,010.10",
    })
    .expect(201);

  // Check the count of all tickets now - should be one
  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
});

it("Rejects creation of duplicate ticket", async () => {
  await request(app)
    .post("/api/tickets/create")
    .set("Cookie", global.signInTestUser())
    .send({
      title: "Happy pup",
      price: "R1,010.10",
    })
    .expect(201);

  console.log("Creating dup...");
  await request(app)
    .post("/api/tickets/create")
    .set("Cookie", global.signInTestUser())
    .send({
      title: "Happy pup",
      price: "R1,010.10",
    })
    .expect(400);
});
