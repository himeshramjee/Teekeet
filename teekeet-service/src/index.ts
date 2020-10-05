import mongoose from "mongoose";
import { DatabaseConnectionError } from "@chaiwala/common";

import { app } from "./app";

const start = async () => {
  if (!process.env.JWT_KEY || !process.env.MONGO_URI) {
    throw new Error("Missing environment variables.");
  }

  const teekeetMongoDBEndpoint = process.env.MONGO_URI;

  await mongoose
    .connect(teekeetMongoDBEndpoint, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then((result) => {
      console.log(
        `Now connected to MongoDB with name: ${result.connection.name}`
      );

      app.listen(7001, () => {
        console.log("Teekeet Service v0.0.0 listening on port 7001...");
      });
    })
    .catch((e) => {
      // FIXME: Figure out why I'm still getting the UnhandledPromiseException when mongoDb connectivity fails
      console.log(
        "Teekeet Service Mongo DB connection failed with Error: " + e.message
      );
      throw new DatabaseConnectionError(
        teekeetMongoDBEndpoint,
        e.message ? e.message : "Reason - Unknown. Logs may have more info."
      );
    });
};

start();
