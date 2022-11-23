import express from "express";
import { auth } from "../middleware/authorization";
//import { AdminRegister,SuperAdmin } from "../controller/adminController";

const router = express.Router();

router.get("/", (req, res) => {
  res.render("search-doctors");
});
//router.post('/create-admin', auth, AdminRegister)
//router.post('/create-super-admin',SuperAdmin)

export default router;
