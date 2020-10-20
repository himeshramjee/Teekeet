import mongoose from "mongoose";
import { DatabaseConnectionError } from "@chaiwala/common";

import { app } from "./app";

const start = async () => {
  if (
    !process.env.JWT_KEY ||
    !process.env.PORT ||
    !process.env.MONGO_URI ||
    !process.env.MAX_SIZE_JSON_REQUEST ||
    !process.env.NATS_URI ||
    !process.env.NATS_CLUSTER_ID ||
    !process.env.NATS_CLIENT_ID_PREFIX
  ) {
    throw new Error("Missing environment variables.");
  } else {
    console.info(
      `\n[order-service] Using environment variables: 
      \tJWT_KEY=<redacted>
      \n\tPORT=${process.env.port}
      \n\tMONGO_URI=${process.env.MONGO_URI}
      \n\tMAX_SIZE_JSON_REQUEST=${process.env.MAX_SIZE_JSON_REQUEST}
      \n\tNATS_URI=${process.env.NATS_URI}
      \n\tNATS_CLUSTER_ID=${process.env.NATS_CLUSTER_ID}
      \n\tNATS_CLIENT_ID_PREFIX=${process.env.NATS_CLIENT_ID_PREFIX}\n`
    );
  }
  const teekeetMongoDBEndpoint = process.env.MONGO_URI;

  // Connect to Mongoose
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

      app.listen(process.env.PORT, () => {
        console.log("Order Service v0.0.0 listening on port 7002...");
      });
    })
    .catch((e) => {
      // FIXME: [Needs retest] Figure out why I'm still getting the UnhandledPromiseException when mongoDb connectivity fails
      console.log(
        "Order Service Mongo DB connection failed with Error: " + e.message
      );
      throw new DatabaseConnectionError(
        teekeetMongoDBEndpoint,
        e.message ? e.message : "Reason - Unknown. Logs may have more info."
      );
    });
};

start();
