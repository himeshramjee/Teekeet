import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";

declare global {
  namespace NodeJS {
    interface Global {
      getSignUpAuthNCookie(): Promise<string[]>;
    }
  }
}

let mongo: MongoMemoryServer;

beforeAll(async () => {
  process.env.JWT_KEY = "test-jwt-key";

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  collections.map(async (collection) => {
    await collection.deleteMany({});
  });
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.getSignUpAuthNCookie = async () => {
  const email = "test@test.com";
  const password = "P@ssw0rd5";

  const response = await request(app)
    .post("/api/users/sign-up")
    .send({
      email,
      password,
    })
    .expect(201);

  return response.get("Set-Cookie");
};
