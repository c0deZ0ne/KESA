"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get("/", (req, res) => {
    res.render("index");
});
router.get("/products", (req, res) => {
    res.render("product-list");
});
router.get("/phamacy/pharmacy-search", (req, res) => {
    try {
        console.log("index");
        res.render("pharmacy-search");
    }
    catch (error) {
        console.log("error occured");
    }
});
router.get("/phamacy/details/:id", (req, res) => {
    console.log("index");
    res.render("pharmacy-details");
});
router.get("/register", (req, res) => {
    console.log("registration");
    res.render("register-form");
});
router.get("/login", (req, res) => {
    console.log("login-form");
    res.render("login-form");
});
router.get("/doctor-profile/:id", (req, res) => {
    res.render("doctor-profile");
});
router.get("/forgot-password", (req, res) => {
    res.render("forgot-password");
});
router.get("/booking", (req, res) => {
    res.render("booking");
});
//otp
router.get("/otp", (req, res) => {
    res.render("otp-verification");
});
exports.default = router;
