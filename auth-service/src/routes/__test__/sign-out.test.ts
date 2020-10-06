import request from "supertest";
import { app } from "../../app";

it("returns a 200 with no JWT cookies after sign out", async () => {
  await global.signInTestUser();

  await request(app).get("/api/users/current-user").expect(200);

  const response = await request(app).post("/api/users/sign-out").expect(200);

  expect(response.get("Set-Cookie")[0]).toEqual(
    "teekeet.com session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly"
  );
});
