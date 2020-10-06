import request from "supertest";
import { app } from "../../app";

it("returns a 200 on successful sign in", async () => {
  await request(app)
    .post("/api/users/sign-in")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(200);
});

it("returns a 400 with an invalid email address (email not registered)", async () => {
  await request(app)
    .post("/api/users/sign-in")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(400);
});

it("returns a 400 with an invalid email address", async () => {
  await request(app)
    .post("/api/users/sign-in")
    .send({
      email: "test@@test.com",
      password: "password",
    })
    .expect(400);
});

it("returns a 400 with an invalid password", async () => {
  await request(app)
    .post("/api/users/sign-in")
    .send({
      email: "test@test.com",
      password: "password1",
    })
    .expect(400);
});

it("returns a 400 with a missing email address and password", async () => {
  await request(app)
    .post("/api/users/sign-in")
    .send({
      email: "",
      password: "",
    })
    .expect(400);
});

it("sets JWT cookie on successful sign in", async () => {
  const response = await request(app)
    .post("/api/users/sign-in")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});
