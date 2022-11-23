"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const professionalController_1 = require("../controller/professionalController");
const router = express_1.default.Router();
// doctor
router.get("/doctor/dashboard", professionalController_1.proDoctorController);
// phamacy
router.get("/pharmacy/dashboard", professionalController_1.proPhamacyController);
// router.get('/*',errorHandler)
exports.default = router;
