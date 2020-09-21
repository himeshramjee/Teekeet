import express from "express";

import { signUpRouter } from "./routes/sign-up";
import { signInRouter } from "./routes/sign-in";
import { signOutRouter } from "./routes/sign-out";
import { currentUserRouter } from "./routes/current-users";
import { errorHandler } from "./middlewares/error-handler";

const app = express();
app.use(express.json());

app.use(errorHandler);

app.use(signInRouter);
app.use(signOutRouter);
app.use(currentUserRouter);
app.use(signUpRouter);

app.listen("7000", () => {
  console.log("Auth-wala v0.00 listening on port 7000...");
});
