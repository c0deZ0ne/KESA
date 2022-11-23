import express from "express";
import {
  proDoctorController,
  proPhamacyController,
} from "../controller/professionalController";
const router = express.Router();
// doctor
router.get("/doctor/dashboard", proDoctorController);

// phamacy
router.get("/pharmacy/dashboard", proPhamacyController);

// router.get('/*',errorHandler)

export default router;
