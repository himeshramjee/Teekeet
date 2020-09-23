import express from "express";
import "express-async-errors";
import mongoose from "mongoose";
import cookieSession from "cookie-session";

import { signUpRouter } from "./routes/sign-up";
import { signInRouter } from "./routes/sign-in";
import { signOutRouter } from "./routes/sign-out";
import { currentUserRouter } from "./routes/current-users";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";
import { DatabaseConnectionError } from "./errors/database-connection-error";

const app = express();

app.set("trust proxy", true); // Express is behind a proxy and should trust ssl traffic from ingress nginx
app.use(express.json());
app.use(
  cookieSession({
    name: "teekeet.com session",
    signed: false, // Disable cookie encryption to better support different service platforms (java, ruby, nodejs etc)
    secure: true, // Cookies should only be used over HTTPs
    maxAge: 1 * 10 * 60 * 1000, // 10mins
  })
);

app.use(signInRouter);
app.use(signOutRouter);
app.use(currentUserRouter);
app.use(signUpRouter);

app.all("*", (req, res) => {
  throw new NotFoundError(`${req.method}: ${req.path}`);
});

app.use(errorHandler);

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY is not defined.");
  }

  const authMongoDBEndpoint =
    "mongodb://auth-mongo-db-clusterip-srv:27017/auth";

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
