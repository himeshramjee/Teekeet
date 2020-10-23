import request from "supertest";
import { app } from "../../app";

it("Rejects requests with missing price", () => {
  const response = createDummyTicket()
  expect(response).not.toBeNull();
});

const createDummyTicket = async (
  title: string = "Chaiwala 2020 Hits",
  price: Number = 300.00,
  userID?: string
) => {
  const response = await request(app)
    .post("/api/tickets/")
    .set("Cookie", global.signInTestUser(userID))
    .send({
      title: title,
      price: price,
    });

  // console.log(response.body);
  return response.body;
};

export { createDummyTicket };
