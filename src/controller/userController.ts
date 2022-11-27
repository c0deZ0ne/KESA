import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import {
  registerSchema,
  option,
  GeneratePassword,
  GenerateSalt,
  GenerateOTP,
  onRequestOTP,
  sendmail,
  emailHtml,
  Generatesignature,
  verifySignature,
  loginSchema,
  validatePassword,
  updateSchema,
  sendOtp,
} from "../utils";
import { FromAdminMail, userSubject } from "../config";
import { UserAttributes, UserInstance } from "../model/userModel";
import { v4 as uuidv4 } from "uuid";

/** ================= Register ===================== **/
export const Register = async (req: Request, res: Response) => {
  try {
    const {
      address,
      fullname,
      accountType,
      email,
      phone,
      password,
      confirm_password,
    } = req.body;
    const uuiduser = uuidv4();
    const validateResult = registerSchema.validate(req.body, option);
    if (validateResult.error) {
      return res.status(400).json({
        Error: validateResult.error.details[0].message,
      });
    }

    // Generate salt
    const salt: string = await GenerateSalt();
    const userPassword: string = await GeneratePassword(password, salt);

    // Generate OTP
    const { otp, expiry } = await GenerateOTP();

    // check if the user exist
    const User = await UserInstance.findOne({ where: { email: email } });

    //Create User
    if (!User) {
      try {
        let status = await sendOtp(phone, otp, "sms");
        console.log(status);
        if (status) {
          await UserInstance.create({
            id: uuiduser,
            email,
            fullname: fullname,
            accountType,
            password: userPassword,
            salt,
            address: address ? address : "",
            phone,
            otp,
            otp_expiry: expiry,
            lng: 0,
            lat: 0,
            verified: false,
            role: "user",
          });
          // check if the user exist
          const User = (await UserInstance.findOne({
            where: { email: email },
          })) as unknown as UserAttributes;

          //Generate signature for user
          let signature = await Generatesignature({
            id: User.id,
            email: User.email,
            verified: User.verified,
          });

          return res.status(201).json({
            code: 201,
            message:
              "User created successfully check your email or phone for OTP verification",
            signature,
            verified: User.verified,
          });
        }
        return res.status(400).json({
          Error: "Phone number is not valid",
          code: 400,
        });
      } catch (error) {
        console.log(error);
        return res.status(500).json({
          Error: "Please retry with valid credentials",
          code: 500,
        });
      }
    }
    return res.status(400).json({
      Error: "User already exist",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      Error: "Internal server error",
      code: 500,
    });
  }
};

/** ================= Verify Users ===================== **/
export const verifyUser = async (req: Request, res: Response) => {
  try {
    const token = req.params.signature;
    const decode = await verifySignature(token);
    const { digit_1, digit_2, digit_3, digit_4 } = req.body;
    let first, second, third, fourth;
    first = String(digit_1);
    second = String(digit_2);
    third = String(digit_3);
    fourth = String(digit_4);
    let otp = first.concat(second, third, fourth);

    // check if the user is a registered user
    const User = (await UserInstance.findOne({
      where: { email: decode.email },
    })) as unknown as UserAttributes;

    // console.log(User);
    if (User) {
      if (User.otp === parseInt(otp) && User.otp_expiry >= new Date()) {
        console.log(otp);
        const updatedUser = (await UserInstance.update(
          {
            verified: true,
          },
          { where: { email: decode.email } }
        )) as unknown as UserAttributes;

        // Regenerate a new signature
        let signature = await Generatesignature({
          id: updatedUser.id,
          email: updatedUser.email,
          verified: updatedUser.verified,
        });
        if (updatedUser) {
          const User = (await UserInstance.findOne({
            where: { email: decode.email },
          })) as unknown as UserAttributes;

          return res.status(200).json({
            message: "You have successfully verified your account",
            signature,
            verified: User.verified,
          });
        }
      }
    }
    return res.status(400).json({
      Error: "Invalid credential or OTP already expired",
    });
  } catch (err) {
    res.status(500).json({
      Error: "Internal server Error",
      route: "/users/verify",
    });
  }
};

/** ================= Login Users ===================== **/
export const Login = async (req: Request, res: Response) => {
  console.log("login");
  try {
    const { email, password } = req.body;
    const validateResult = loginSchema.validate(req.body, option);
    console.log(validateResult);
    if (validateResult.error) {
      throw new Error(validateResult.error.details[0].message);
    }

    // check if the user exist
    const User = (await UserInstance.findOne({
      where: { email: email },
    })) as unknown as UserAttributes;

    if (User.verified === true) {
      const validation = await validatePassword(
        password,
        User.password,
        User.salt
      );
      if (validation) {
        //Generate signature for user
        let signature = await Generatesignature({
          id: User.id,
          email: User.email,
          verified: User.verified,
          accountType: User.accountType,
        });

        return res.status(200).json({
          message: "You have successfully logged in",
          signature,
          email: User.email,
          verified: User.verified,
          role: User.role,
          accountType: User.accountType,
        });
      }
    }
    return res.status(400).json({
      Error: "Wrong Username or password or not a verified user ",
    });
  } catch (err: any) {
    res.status(400).json({
      Error: "Email or password is incorrect",
      route: "/users/login",
    });
  }
};

/** ================= Resend OTP ===================== **/

export const resendOTP = async (req: Request, res: Response) => {
  try {
    const token = req.params.signature;
    const decode = await verifySignature(token);
    // check if the user is a registered user
    const User = (await UserInstance.findOne({
      where: { email: decode.email },
    })) as unknown as UserAttributes;

    if (User) {
      // Generate OTP
      const { otp, expiry } = await GenerateOTP();
      const updatedUser = (await UserInstance.update(
        {
          otp,
          otp_expiry: expiry,
        },
        { where: { email: decode.email } }
      )) as unknown as UserAttributes;

      if (updatedUser) {
        const User = (await UserInstance.findOne({
          where: { email: decode.email },
        })) as unknown as UserAttributes;
        // Send Otp to user
        await onRequestOTP(otp, User.phone);

        //Send Mail to user
        const html = emailHtml(otp);
        await sendmail(FromAdminMail, User.email, userSubject, html);

        return res.status(200).json({
          message: "OTP resend to registered phone number and email",
        });
      }
    }
    return res.status(400).json({
      Error: "Error sending OTP",
    });
  } catch (err) {
    res.status(500).json({
      Error: "Internal server Error",
      route: "/users/resend-otp/:signature",
    });
  }
};

/** ================= PROFILE ===================== **/

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit as number | undefined;
    const users = await UserInstance.findAndCountAll({
      limit: limit,
    });
    return res.status(200).json({
      message: "You have successfully retrieved all users",
      Count: users.count,
      Users: users.rows,
    });
  } catch (err) {
    return res.status(500).json({
      Error: "Internal server Error",
      route: "/users/get-all-users",
    });
  }
};

export const getSingleUser = async (req: JwtPayload, res: Response) => {
  try {
    const id = req.user.id;

    // find the user by id
    const User = (await UserInstance.findOne({
      where: { id: id },
    })) as unknown as UserAttributes;

    if (User) {
      return res.status(200).json({
        User,
      });
    }
    return res.status(400).json({
      message: "User not found",
    });
  } catch (err) {
    return res.status(500).json({
      Error: "Internal server Error",
      route: "/users/get-user",
    });
  }
};

export const updateUserProfile = async (req: JwtPayload, res: Response) => {
  try {
    const id = req.user.id;
    const { firstName, lastName, fullname, address, phone } = req.body;
    //Joi validation
    const validateResult = updateSchema.validate(req.body, option);
    if (validateResult.error) {
      return res.status(400).json({
        Error: validateResult.error.details[0].message,
      });
    }

    // check if the user is a registered user
    const User = (await UserInstance.findOne({
      where: { id: id },
    })) as unknown as UserAttributes;

    if (!User) {
      return res.status(400).json({
        Error: "You are not authorised to update your profile",
      });
    }

    const updatedUser = (await UserInstance.update(
      {
        fullname,
        address,
        phone,
      },
      { where: { id: id } }
    )) as unknown as UserAttributes;

    if (updatedUser) {
      const User = (await UserInstance.findOne({
        where: { id: id },
      })) as unknown as UserAttributes;
      return res.status(200).json({
        message: "You have successfully updated your profile",
        User,
      });
    }
    return res.status(400).json({
      message: "Error occured",
    });
  } catch (err) {
    return res.status(500).json({
      Error: "Internal server Error",
      route: "/users/update-profile",
    });
  }
};
