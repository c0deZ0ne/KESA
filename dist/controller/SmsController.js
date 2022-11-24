"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.smsManager = void 0;
const axios_1 = __importDefault(require("axios"));
const smsManager = async (req, res) => {
    const { sessionId, serviceCode, phoneNumber, text } = req.body;
    console.log(text, sessionId, serviceCode, phoneNumber);
    let entry = `CON Welcome to the KESA SMS service
  1. Register Account
  2. Account Details
  3. Request for a professional
  4. Exit 
  `;
    try {
        let response = entry;
        if (req.method === "POST") {
            var pattern = /^[1][\*]([\a-z\s]){2,}\s\+\s([\a-z\s\w]){2,}?$/gim;
            //manager registration
            let response = entry;
            res.send(response);
            if (text == "") {
                // This is the first request. Note how we start the response with CON
                res.send(response);
            }
            else if (text == "1") {
                // Business logic for first level response
                response = `CON 
          Enter your full name + your location
        `;
            }
            else if (text == "2") {
                // Business logic for first level response
                response = `END
          your account details
          name: abc
          location: xyz
          confirmed: true
        `;
            }
            else if (text == "3") {
                // Business logic for first level response
                // This is a terminal request. Note how we start the response with END
                response = `CON 
        Please Select professional category
        1: Doctor
        2: Nurse
        3: Pharmacist
        4: Lab Technician
        5: Other
        `;
            }
            else if (text.match(pattern)) {
                try {
                    let userData = text.split("*")[1].split("+");
                    let name = userData[0];
                    let location = userData[1];
                    let user = {
                        email: `${phoneNumber}@kesapp.com`,
                        password: phoneNumber,
                        fullname: name,
                        confirm_password: phoneNumber,
                        address: location,
                        accountType: "user",
                        phone: phoneNumber,
                    };
                    console.log(req.path);
                    const regData = await axios_1.default.post(`${process.env.base_url}/users/signup`, user);
                    // console.log(regData.data);
                    // This is a second level response where the user selected 1 in the first instance
                    const status = `${name} Account Created Sucessfully`;
                    // This is a terminal request. Note how we start the response with END
                    res.send(`END 
          ${status}
            please wait for a professional to contact you or 
            login to your account to request for a professional
            https://kesapp.herokuapp.com/login 
            username: ${name}
            password: ${phoneNumber}
          `);
                }
                catch (error) {
                    // console.log(error);
                    const { Error } = error.response.data;
                    if (Error == "User already exist") {
                        res.send(`END 
             Account already created
            `);
                    }
                    res.send(`END
           An error occured
          `);
                }
            }
            else if (text == "3*1") {
                // This is a second level response where the user selected 1 in the first instance
                const status = `Please wait for a doctor to contact you`;
                // This is a terminal request. Note how we start the response with END
                res.send(`END 
        ${status}
        `);
            }
            else if (text == "3*2") {
                // This is a second level response where the user selected 1 in the first instance
                const status = `Please wait for a nurse to contact you`;
                // This is a terminal request. Note how we start the response with END
                res.send(`END 
        ${status}
        `);
            }
            else if (text == "3*3") {
                // This is a second level response where the user selected 1 in the first instance
                const status = `Please wait for a pharmacist to contact you`;
                // This is a terminal request. Note how we start the response with END
                res.send(`END 
        ${status}
        `);
            }
            else if (text == "3*4") {
                // This is a second level response where the user selected 1 in the first instance
                const status = `Please wait for a lab technician to contact you`;
                // This is a terminal request. Note how we start the response with END
                res.send(`END 
        ${status}
        `);
            }
            else if (text == "3*5") {
                // This is a second level response where the user selected 1 in the first instance
                const status = `Please wait for a professional to contact you`;
                // This is a terminal request. Note how we start the response with END
                res.send(`END 
        ${status}
        `);
            }
            else if (text == "4") {
                response = `END 
        Thank you for using KESA
        `;
            }
            else {
                console.log(text);
                response = `END Invalid Input`;
            }
            // Send the response back to the API
            res.set("Content-Type: text/plain");
            res.send(response);
        }
        else if (req.method === "GET") {
            console.log("get");
            res.send(response);
        }
    }
    catch (error) {
        console.log(error);
        res.send("END error");
    }
};
exports.smsManager = smsManager;
