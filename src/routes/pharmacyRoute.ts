import express, { Request, Response } from "express";
const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  try {
    res.render("pharmacy-search");
  } catch (error) {
    console.log("error occured");
  }
});

router.get("/details/:id", (req, res) => {
  res.render("pharmacy-details");
});
export default router;
