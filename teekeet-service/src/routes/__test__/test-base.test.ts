import request from "supertest";
import { app } from "../../app";

it("Rejects requests with missing price", () => {
  createDummyTicket(undefined, "").expect(400);
});

const createDummyTicket = (
  title: String = "Chaiwala 2020 Hits",
  price: String = "R300.00",
  userID?: string
) => {
  const response = request(app)
    .post("/api/tickets/create")
    .set("Cookie", global.signInTestUser(userID))
    .send({
      title: title,
      price: price,
    });

  return response;
};

export { createDummyTicket };
