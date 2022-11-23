"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.proPhamacyController = exports.proDoctorController = void 0;
const proDoctorController = async (req, res) => {
    let proPath = req.url.split("/");
    let endPoint = proPath[proPath.length - 1];
    let method = req.method;
    if (endPoint == "dashboard" && method == "GET") {
        res.render("doctor-dashboard");
        // res.render("doctor-register");
    }
    else if (endPoint == "register" && method == "post") {
        // handle registeration from doctor
        try {
            console.log("register a doctor");
        }
        catch (error) {
            res.status(400).json({ code: 400, message: "error occured" });
        }
    }
};
exports.proDoctorController = proDoctorController;
const proPhamacyController = async (req, res) => { };
exports.proPhamacyController = proPhamacyController;
