import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

declare global {
  namespace NodeJS {
    interface Global {
      signInTestUser(id?: string): string[];
    }
  }
}

let mongo: MongoMemoryServer;

beforeAll(async () => {
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

global.signInTestUser = (
  id: string = new mongoose.Types.ObjectId().toHexString()
) => {
  // Build a JWT payload { id, email }
  const payload = {
    id: id,
    email: "order-service-test-user-0@teekeet.com",
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
