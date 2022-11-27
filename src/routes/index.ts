import express, { Request, Response } from "express";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.render("index");
});

router.get("/products", (req, res) => {
  res.render("product-list");
});

// router.get("/booking", (req, res) => {
//   res.render("boo");
// });

router.get("/phamacy/pharmacy-search", (req: Request, res: Response) => {
  try {
    console.log("index");
    res.render("pharmacy-search");
  } catch (error) {
    console.log("error occured");
  }
});

router.get("/phamacy/details/:id", (req, res) => {
  console.log("index");
  res.render("pharmacy-details");
});

router.get("/register", (req, res) => {
  // console.log("registration");
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

router.get("/contact-us", (req, res) => {
  res.render("contact-us");
});

router.get("doctors/dashboard", (req, res) => {
  res.render("doctor-dashboard");
});

router.get("/doctor-profile-settings", (req, res) => {
  res.render("doctor-profile-settings");
});

export default router;
