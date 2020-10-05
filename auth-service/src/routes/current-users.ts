import express from "express";

import { setCurrentUser } from "@chaiwala/common";

const router = express.Router();

router.get("/api/users/current-user", setCurrentUser, (req, res) => {
  res.status(200).send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
