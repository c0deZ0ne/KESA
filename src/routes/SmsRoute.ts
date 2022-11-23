import express from "express";
import { smsManager } from "../controller/SmsController";

const router = express.Router();
router.post("/", smsManager);
export default router;
