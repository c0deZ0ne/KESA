"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
//import { AdminRegister,SuperAdmin } from "../controller/adminController";
const router = express_1.default.Router();
router.get("/", (req, res) => {
    res.render("search-doctors");
});
//router.post('/create-admin', auth, AdminRegister)
//router.post('/create-super-admin',SuperAdmin)
exports.default = router;
