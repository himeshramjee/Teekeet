import request from "supertest";
import { app } from "../../app";

it("returns a 201 on successful sign up", async () => {
  await request(app)
    .post("/api/users/sign-up")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
});

it("returns a 400 with an invalid email address (email not available)", async () => {
  await request(app)
    .post("/api/users/sign-up")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

    await request(app)
    .post("/api/users/sign-up")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(400);
});

it("returns a 400 with an invalid email address", async () => {
  await request(app)
    .post("/api/users/sign-up")
    .send({
      email: "test@@test.com",
      password: "password",
    })
    .expect(400);
});


it("returns a 400 with an invalid password", async () => {
  await request(app)
    .post("/api/users/sign-up")
    .send({
      email: "test@test.com",
      password: "p",
    })
    .expect(400);
});

it("returns a 400 with a missing email address and password", async () => {
  await request(app)
    .post("/api/users/sign-up")
    .send({
      email: "",
      password: "",
    })
    .expect(400);
});

it("sets JWT cookie on successful sign up", async () => {
  const response = await request(app)
    .post("/api/users/sign-up")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});