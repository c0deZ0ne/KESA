import express from "express";
import { Request, Response } from "express";

const router = express.Router();
router.get("/dashboard", (req: Request, res: Response) => {
  res.render("admin");
});

export default router;
