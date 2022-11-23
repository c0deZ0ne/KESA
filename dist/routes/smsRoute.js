"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const SmsController_1 = require("../controller/SmsController");
const router = express_1.default.Router();
router.post("/", SmsController_1.smsManager);
exports.default = router;
