import request from "supertest";
import { app } from "../../app";

const createDummyTicket = (
  title: String = "Chaiwala 2020 Hits",
  price: String = "R300.00"
) => {
  const response = request(app)
    .post("/api/tickets/create")
    .set("Cookie", global.signInTestUser())
    .send({
      title: title,
      price: price,
    });

  return response;
};

export { createDummyTicket };
