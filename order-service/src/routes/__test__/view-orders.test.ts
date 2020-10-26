import request from "supertest";
import { app } from "../../app";

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

it("Returns 200 for authenticated users", async () => {
  await request(app)
    .get("/api/orders/")
    .set("Cookie", global.signInTestUser())
    .then((response) => {
      expect(response.status).toEqual(200);
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