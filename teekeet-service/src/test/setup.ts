import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";
import jwt from "jsonwebtoken";

declare global {
  namespace NodeJS {
    interface Global {
      signInTestUser(): string[];
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

global.signInTestUser = () => {
  // Build a JWT payload { id, email }
  const payload = {
    id: 10101,
    email: "teeekeet-service-test-user-0@teekeet.com",
  };

  // Create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build the session object { jwt: MY_JWT }
  const userSession = {
    jwt: token,
  };

  // Turn that session object into JSON
  const userSessionJSON = JSON.stringify(userSession);

  // Base64 encode the JSON
  const userSessionEncoded = Buffer.from(userSessionJSON).toString("base64");

  // Return the stringy cookie
  return [`teekeet.com session=${userSessionEncoded}`];
};
