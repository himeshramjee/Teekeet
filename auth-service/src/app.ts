import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";

import { signUpRouter } from "./routes/sign-up";
import { signInRouter } from "./routes/sign-in";
import { signOutRouter } from "./routes/sign-out";
import { currentUserRouter } from "./routes/current-users";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";

const app = express();

app.set("trust proxy", true); // Express is behind a proxy and should trust ssl traffic from ingress nginx
app.use(express.json());
app.use(
  cookieSession({
    name: "teekeet.com session",
    signed: false, // Disable cookie encryption to better support different service platforms (java, ruby, nodejs etc)
    secure: process.env.NODE_ENV !== "test", // Cookies should only be used over HTTPs
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

export { app };
