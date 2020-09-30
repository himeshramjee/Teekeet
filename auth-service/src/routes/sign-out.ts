import express from "express";

const router = express.Router();

router.post("/api/users/sign-out", (req, res) => {
  req.session = null;

  res.status(200).send({ redirectTo: "/" });
});

export { router as signOutRouter };
