import mongoose from "mongoose";
import { DatabaseConnectionError } from "@chaiwala/common";

import { app } from "./app";

const start = async () => {
  if (!process.env.JWT_KEY || !process.env.MONGO_URI) {
    throw new Error("Missing environment variables.");
  }

  const authMongoDBEndpoint = process.env.MONGO_URI;

  await mongoose
    .connect(authMongoDBEndpoint, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then((result) => {
      console.log(
        `Now connected to MongoDB with name: ${result.connection.name}`
      );

      app.listen(7000, () => {
        console.log("Auth-wala v0.0.0 listening on port 7000...");
      });
    })
    .catch((e) => {
      // FIXME: Figure out why I'm still getting the UnhandledPromiseException
      console.log("Auth Mongo DB connection failed with Error: " + e.message);
      throw new DatabaseConnectionError(
        authMongoDBEndpoint,
        e.message ? e.message : "Reason - Unknown. Logs may have more info."
      );
    });
};

start();
