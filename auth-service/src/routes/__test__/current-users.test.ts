import request from "supertest";
import { app } from "../../app";

it("returns a 200 on get current user", async () => {
  const cookie = await global.getSignUpAuthNCookie();

  const response = await request(app)
    .get("/api/users/current-user")
    .set("Cookie", cookie)
    .expect(200);

  expect(response.body.currentUser.email).toEqual("test@test.com");
});

it("returns a 200 with null if not authN", async () => {
  const response = await request(app)
    .get("/api/users/current-user")
    .expect(200);

  expect(response.body.currentUser).toBeNull();
});
