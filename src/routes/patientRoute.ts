import express from "express";
const router = express.Router();

router.get("/dashboard", (req, res) => {
  res.render("patient-dashboard");
});
export default router;
