import express from "express";

const router = express.Router();

router.get("/api/users/currentuser", (req, res) => {
  res.status(200).send("Howzit you.");
});

export { router as currentUserRouter };
