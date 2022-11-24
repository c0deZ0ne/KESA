"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserProfile = exports.getSingleUser = exports.getAllUsers = exports.resendOTP = exports.Login = exports.verifyUser = exports.Register = void 0;
const utils_1 = require("../utils");
const config_1 = require("../config");
const userModel_1 = require("../model/userModel");
const uuid_1 = require("uuid");
/** ================= Register ===================== **/
const Register = async (req, res) => {
    try {
        const { address, fullname, accountType, email, phone, password, confirm_password } = req.body;
        const uuiduser = (0, uuid_1.v4)();
        console.log(uuiduser);
        const validateResult = utils_1.registerSchema.validate(req.body, utils_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        }
        // Generate salt
        const salt = await (0, utils_1.GenerateSalt)();
        const userPassword = await (0, utils_1.GeneratePassword)(password, salt);
        // Generate OTP
        const { otp, expiry } = await (0, utils_1.GenerateOTP)();
        // check if the user exist
        const User = await userModel_1.UserInstance.findOne({ where: { email: email } });
        //Create User
        if (!User) {
            await userModel_1.UserInstance.create({
                id: uuiduser,
                email,
                fullname: fullname,
                accountType,
                password: userPassword,
                salt,
                address: address,
                phone,
                otp,
                otp_expiry: expiry,
                lng: 0,
                lat: 0,
                verified: false,
                role: "user",
            });
            // Send Otp to user
            // try {
            //   await onRequestOTP(otp, phone);
            // } catch (error) {
            //   console.log(error);
            // }
            //Send Mail to user
            // const html = emailHtml(otp);
            // await sendmail(FromAdminMail, email, userSubject, html);
            // check if the user exist
            const User = (await userModel_1.UserInstance.findOne({
                where: { email: email },
            }));
            //Generate signature for user
            let signature = await (0, utils_1.Generatesignature)({
                id: User.id,
                email: User.email,
                verified: User.verified,
            });
            return res.status(201).json({
                code: 201,
                message: "User created successfully check your email or phone for OTP verification",
                signature,
                verified: User.verified,
            });
        }
        return res.status(400).json({
            Error: "User already exist",
            code: 400,
        });
    }
    catch (err) {
        console.log(err.message);
        res.status(500).json({
            Error: "Internal server Error",
            route: "/users/signup",
        });
    }
};
exports.Register = Register;
/** ================= Verify Users ===================== **/
const verifyUser = async (req, res) => {
    try {
        const token = req.params.signature;
        const decode = await (0, utils_1.verifySignature)(token);
        const { digit_1, digit_2, digit_3, digit_4 } = req.body;
        let first, second, third, fourth;
        first = String(digit_1);
        second = String(digit_2);
        third = String(digit_3);
        fourth = String(digit_4);
        let otp = first.concat(second, third, fourth);
        // check if the user is a registered user
        const User = (await userModel_1.UserInstance.findOne({
            where: { email: decode.email },
        }));
        // console.log(User);
        if (User) {
            if (User.otp === parseInt(otp) && User.otp_expiry >= new Date()) {
                console.log(otp);
                const updatedUser = (await userModel_1.UserInstance.update({
                    verified: true,
                }, { where: { email: decode.email } }));
                // Regenerate a new signature
                let signature = await (0, utils_1.Generatesignature)({
                    id: updatedUser.id,
                    email: updatedUser.email,
                    verified: updatedUser.verified,
                });
                if (updatedUser) {
                    const User = (await userModel_1.UserInstance.findOne({
                        where: { email: decode.email },
                    }));
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
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/users/verify",
        });
    }
};
exports.verifyUser = verifyUser;
/** ================= Login Users ===================== **/
const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const validateResult = utils_1.loginSchema.validate(req.body, utils_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        }
        // check if the user exist
        const User = (await userModel_1.UserInstance.findOne({
            where: { email: email },
        }));
        if (User.verified === true) {
            const validation = await (0, utils_1.validatePassword)(password, User.password, User.salt);
            if (validation) {
                //Generate signature for user
                let signature = await (0, utils_1.Generatesignature)({
                    id: User.id,
                    email: User.email,
                    verified: User.verified,
                });
                return res.status(200).json({
                    message: "You have successfully logged in",
                    signature,
                    email: User.email,
                    verified: User.verified,
                    role: User.role,
                });
            }
        }
        return res.status(400).json({
            Error: "Wrong Username or password or not a verified user ",
        });
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/users/login",
        });
    }
};
exports.Login = Login;
/** ================= Resend OTP ===================== **/
const resendOTP = async (req, res) => {
    try {
        const token = req.params.signature;
        const decode = await (0, utils_1.verifySignature)(token);
        // check if the user is a registered user
        const User = (await userModel_1.UserInstance.findOne({
            where: { email: decode.email },
        }));
        if (User) {
            // Generate OTP
            const { otp, expiry } = await (0, utils_1.GenerateOTP)();
            const updatedUser = (await userModel_1.UserInstance.update({
                otp,
                otp_expiry: expiry,
            }, { where: { email: decode.email } }));
            if (updatedUser) {
                const User = (await userModel_1.UserInstance.findOne({
                    where: { email: decode.email },
                }));
                // Send Otp to user
                await (0, utils_1.onRequestOTP)(otp, User.phone);
                //Send Mail to user
                const html = (0, utils_1.emailHtml)(otp);
                await (0, utils_1.sendmail)(config_1.FromAdminMail, User.email, config_1.userSubject, html);
                return res.status(200).json({
                    message: "OTP resend to registered phone number and email",
                });
            }
        }
        return res.status(400).json({
            Error: "Error sending OTP",
        });
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/users/resend-otp/:signature",
        });
    }
};
exports.resendOTP = resendOTP;
/** ================= PROFILE ===================== **/
const getAllUsers = async (req, res) => {
    try {
        const limit = req.query.limit;
        const users = await userModel_1.UserInstance.findAndCountAll({
            limit: limit,
        });
        return res.status(200).json({
            message: "You have successfully retrieved all users",
            Count: users.count,
            Users: users.rows,
        });
    }
    catch (err) {
        return res.status(500).json({
            Error: "Internal server Error",
            route: "/users/get-all-users",
        });
    }
};
exports.getAllUsers = getAllUsers;
const getSingleUser = async (req, res) => {
    try {
        const id = req.user.id;
        // find the user by id
        const User = (await userModel_1.UserInstance.findOne({
            where: { id: id },
        }));
        if (User) {
            return res.status(200).json({
                User,
            });
        }
        return res.status(400).json({
            message: "User not found",
        });
    }
    catch (err) {
        return res.status(500).json({
            Error: "Internal server Error",
            route: "/users/get-user",
        });
    }
};
exports.getSingleUser = getSingleUser;
const updateUserProfile = async (req, res) => {
    try {
        const id = req.user.id;
        const { firstName, lastName, fullname, address, phone } = req.body;
        //Joi validation
        const validateResult = utils_1.updateSchema.validate(req.body, utils_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        }
        // check if the user is a registered user
        const User = (await userModel_1.UserInstance.findOne({
            where: { id: id },
        }));
        if (!User) {
            return res.status(400).json({
                Error: "You are not authorised to update your profile",
            });
        }
        const updatedUser = (await userModel_1.UserInstance.update({
            fullname,
            address,
            phone,
        }, { where: { id: id } }));
        if (updatedUser) {
            const User = (await userModel_1.UserInstance.findOne({
                where: { id: id },
            }));
            return res.status(200).json({
                message: "You have successfully updated your profile",
                User,
            });
        }
        return res.status(400).json({
            message: "Error occured",
        });
    }
    catch (err) {
        return res.status(500).json({
            Error: "Internal server Error",
            route: "/users/update-profile",
        });
    }
};
exports.updateUserProfile = updateUserProfile;
