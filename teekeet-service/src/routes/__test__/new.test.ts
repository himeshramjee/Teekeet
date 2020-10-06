import request from "supertest";
import { app } from "../../app";

it("Has a route handler listening to /api/tickets for post requests", async () => {
  await request(app)
    .post("/api/tickets")
    .send({})
    .then((response) => {
      expect(response.status).not.toEqual(404);
    });
});

it("Rejects unauthenticated users", async () => {
  await request(app)
    .post("/api/tickets")
    .then((response) => {
      expect(response.status).toEqual(401);
    });
});

it("Does not return 401 for authenticated users", async () => {
  const authNCookie = global.signInTestUser();
  console.log(authNCookie);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", authNCookie)
    .then((response) => {
      // console.log(response.status);
      expect(response.status).not.toEqual(401);
    });
});

it("Returns an error for invalid title values", async () => {});

it("Returns an error for invalid price values", async () => {});

it("Creates a ticket with valid inputs", async () => {});
