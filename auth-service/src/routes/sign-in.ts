import express from "express";

const router = express.Router();

router.post("/api/users/sign-in", (req, res) => {
  res.status(200).send("Who are you?");
});

export { router as signInRouter };
