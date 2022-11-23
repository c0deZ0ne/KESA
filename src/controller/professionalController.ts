import { Request, Response } from "express";

export const proDoctorController = async (req: Request, res: Response) => {
  let proPath = req.url.split("/");
  let endPoint = proPath[proPath.length - 1];
  let method = req.method;
  if (endPoint == "dashboard" && method == "GET") {
    res.render("doctor-dashboard");
    // res.render("doctor-register");
  } else if (endPoint == "register" && method == "post") {
    // handle registeration from doctor
    try {
      console.log("register a doctor");
    } catch (error) {
      res.status(400).json({ code: 400, message: "error occured" });
    }
  }
};

export const proPhamacyController = async (req: Request, res: Response) => {};
