import express, { Request, response, Response } from "express";
import axios from "axios";
import { GenerateOTP } from "../utils";
import { UserInstance } from "../model/userModel";

export const smsManager = async (req: Request, res: Response) => {
  var response;

  try {
    res.set("Content-Type: text/plain");
    let { sessionId, serviceCode, phoneNumber, text } = req.body;
    console.log(req.body);
    console.log(text, sessionId, serviceCode, phoneNumber);

    let entry = `CON Welcome to the KESA SMS service
    1. Register Account
    2. Account Details
    3. Request for a professional
    4. Exit 
    `;
    response = entry;
    var pattern = /^[1][\*]([\a-z\s]){2,}\s\+\s([\a-z\s\w]){2,}?$/gim;
    //manager registration

    if (text == null || text == "" || text == undefined) {
      let userIfo: any = await UserInstance.findOne({
        where: { phone: phoneNumber },
      });
      if (userIfo) {
        const { fullname } = userIfo;
        entry = `CON  Welcome ${fullname} to the KESA SMS service 
        10. Request for a professional
        11. Account Details
        12. Exit
         `;
        res.send(entry);
      } else {
        entry = `CON  Welcome to the KESA SMS service 
        1. Register Account
        2. Account Details
        3. Request for a professional
        4. Exit
         `;
        res.send(entry);
      }
      // This is the first request. Note how we start the response with CON
    } else if (text == "1") {
      // Business logic for first level response
      response = `CON 
          Enter your fullname + your location
        `;
      res.send(response);
    } else if (text == "2" || text == "11") {
      try {
        // res.send("CON Wait while we fetch your details");

        const user: any = await UserInstance.findOne({
          where: { phone: phoneNumber },
        });
        if (user) {
          const status = `END KESA Account details are
          Name: ${user.fullname}
          Email: ${user.email}
          password: ${user.otp}
          Location: ${user.address}
          Phone: ${user.phone}
          `;
          res.send(status);
        } else {
          const status = `END You are not registered`;
          res.send(status);
        }
      } catch (error) {
        console.log(error);
      }
    } else if (text == "3" || text == "10") {
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
      res.send(response);
    } else if (text == "4" || text == "12") {
      const status = `END Thank you for using KESA SMS service`;
      res.send(status);
    } else if (text.match(pattern)) {
      try {
        let userData = text.split("*")[1].split("+");
        let name = userData[0];
        let location = userData[1];

        let { otp } = await GenerateOTP();
        let user = {
          email: `${phoneNumber}@kesapp.com`,
          password: String(otp),
          fullname: name,
          confirm_password: String(otp),
          address: location,
          accountType: "Patient",
          phone: phoneNumber,
        };
        // console.log(req.path);
        const regData: any = await axios.post(
          `${process.env.BASE_URL}/users/signup`,
          user
        );
        const { code, message, email } = regData?.data;
        if (code == 201) {
          console.log(regData.data);
          // This is a second level response where the user selected 1 in the first instance
          const status = `${name} Account Created Sucessfully`;
          // This is a terminal request. Note how we start the response with END
          res.send(`END 
          ${status}
            please wait for a professional to contact you or 
            login to your account to request for a professional
            https://kesapp.herokuapp.com/login 
            email: ${phoneNumber}@kessapp.com
            password: ${otp}
          `);
        } else {
          res.send(`END 
            ${message}
            `);
        }
      } catch (error: any) {
        console.log(error);
        const { Error } = error?.response?.data;
        if (Error == "User already exist") {
          response = `END 
             Account already created
            `;
        } else {
          response = `END 
             ${Error}
            `;
        }
        res.send(response);
      }
    } else if (text == "3*1" || text == "10*1") {
      // This is a second level response where the user selected 1 in the first instance
      const status = `
      Please wait for a doctor to contact you
      You have Matched here are the details
      name: Dr. John Doe,
      location: Edo Tech Hospital,
      phone number is 07000000000
      `;
      // This is a terminal request. Note how we start the response with END
      res.send(`END 
        ${status}
        `);
    } else if (text == "3*2" || text == "10*2") {
      // This is a second level response where the user selected 1 in the first instance
      const status = `Congrats! You have Matched here are the details
      name: Nurse Mary Doe,
      location: Edo Tech Hospital,
      phone number is +2347000000000
      `;
      // This is a terminal request. Note how we start the response with END
      res.send(`END 
        ${status}
        `);
    } else if (text == "3*3" || text == "10*3") {
      // This is a second level response where the user selected 1 in the first instance
      const status = `
      Congrats! You have Matched here are the details
      name: Pharmacist Priase Doe,
      location: Edo phamacitical,
      phone number is +2347000000000
      `;
      // This is a terminal request. Note how we start the response with END
      res.send(`END 
        ${status}
        `);
    } else if (text == "3*4" || text == "10*4") {
      // This is a second level response where the user selected 1 in the first instance
      const status = `Please wait for a lab technician to contact you`;
      // This is a terminal request. Note how we start the response with END
      res.send(`END 
        ${status}
        `);
    } else if (text == "3*5" || text == "10*5") {
      // This is a second level response where the user selected 1 in the first instance
      const status = `Please wait for a professional to contact you`;
      // This is a terminal request. Note how we start the response with END
      res.send(`END 
        ${status}
        `);
    }
  } catch (error) {
    console.log(error);
    res.send("END error");
  }
};
