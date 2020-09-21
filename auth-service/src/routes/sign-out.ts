import express from "express";

const router = express.Router();

router.post("/api/users/sign-out", (req, res) => {
  res.status(200).send("G'bye you.");
});

export { router as signOutRouter };
