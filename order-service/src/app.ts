// FIXME: Old but has a good list. Obviously look current OWASP/standards
// https://itnext.io/make-security-on-your-nodejs-api-the-priority-50da8dc71d68

import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";

import { errorHandler, NotFoundError, setCurrentUser } from "@chaiwala/common";

const app = express();

app.set("trust proxy", true); // Express is behind a proxy and should trust ssl traffic from ingress nginx
app.use(express.json({ limit: process.env.MAX_SIZE_JSON_REQUEST }));
app.use(
  cookieSession({
    name: "teekeet.com session",
    signed: false, // Disable cookie encryption to better support different service platforms (java, ruby, nodejs etc)
    secure: process.env.NODE_ENV !== "test", // Cookies should only be used over HTTPs
    maxAge: 1 * 10 * 60 * 1000, // 10mins
  })
);

// Ensure every request can check the current user and their auth state
app.use(setCurrentUser);

// Register route handlers
app.all("*", (req, res) => {
  throw new NotFoundError(`${req.method}: ${req.path}`);
});
app.use(errorHandler);

export { app };