"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_Admins = exports.get_Users = exports.admin_login = exports.registerAdmin = exports.logout = exports.refresh = exports.session_Check = exports.login = exports.requestToken = exports.verifyuser = exports.activateuser = exports.updatePassword = exports.register = void 0;
const user_1 = require("../models/user");
const simplefunctions_1 = require("../utils/simplefunctions");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sms_sender_1 = require("../utils/sms_sender");
const cookie_1 = require("cookie");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const cookie_2 = require("cookie");
const jwt_decode_1 = require("jwt-decode");
const generate_activation_1 = require("../utils/generate_activation");
const admin_1 = require("../models/admin");
// User Registration
const register = async (req, res) => {
    try {
        const { username, password, phone_number } = req.body;
        let phone = await (0, simplefunctions_1.Format_phone_number)(phone_number); //format the phone number
        const userExists = await user_1.User.findOne({
            $or: [
                { username: phone_number },
                { phone_number: phone }
            ],
        });
        if (userExists) {
            res.status(400).json("User already exists");
            return;
        }
        let activationcode = (0, generate_activation_1.MakeActivationCode)(4);
        req.body.phone_number = phone;
        req.body.activationCode = activationcode;
        const user = new user_1.User(req.body);
        const newUser = await user.save();
        await (0, sms_sender_1.sendTextMessage)(`Hi ${newUser.username} \nWelcome to Marapesa\nYour your activation Code is ${activationcode}`, `${phone}`, newUser._id, "account-activation");
        res.status(201).json({ message: "User registered successfully", newUser });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error });
        return;
    }
};
exports.register = register;
const updatePassword = async (req, res) => {
    try {
        const { newPassword, phone_number } = req.body;
        let phone = await (0, simplefunctions_1.Format_phone_number)(phone_number);
        const user = await user_1.User.findOne({ phone_number: phone }); // Find the user by ID
        if (!user) {
            res.status(400).json("user not found");
            return;
        }
        user.password = newPassword;
        await user.save();
        res.status(200).json({ success: true, message: "Password updated successfully" });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error });
        return;
    }
};
exports.updatePassword = updatePassword;
const activateuser = async (req, res) => {
    try {
        const { phone_number, code } = req.body;
        let phone = await (0, simplefunctions_1.Format_phone_number)(phone_number);
        const user = await user_1.User.findOne({ phone_number: phone });
        if (!user) {
            res.status(400).json("user not found");
            return;
        }
        if (user.activationCode === code) {
            user.activationCode = "";
            user.activated = true;
            await user.save();
            res.status(200).json({ message: "user activated " });
            return;
        }
        else {
            res.status(400).json("wrong Activation code ");
            return;
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error });
        return;
    }
};
exports.activateuser = activateuser;
const verifyuser = async (req, res) => {
    try {
        const { phone_number, code } = req.body;
        let phone = await (0, simplefunctions_1.Format_phone_number)(phone_number);
        const user = await user_1.User.findOne({ phone_number: phone });
        if (!user) {
            res.status(400).json("user not found");
            return;
        }
        if (user.activationCode === code) {
            res.status(200).json("code-is correct");
            return;
        }
        else {
            res.status(400).json("wrong Activation code ");
            return;
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json("Server error try again");
        return;
    }
};
exports.verifyuser = verifyuser;
const requestToken = async (req, res) => {
    try {
        const { phone_number } = req.body;
        let phone = await (0, simplefunctions_1.Format_phone_number)(phone_number);
        const user = await user_1.User.findOne({ phone_number: phone }); // Find the user by ID
        if (!user) {
            res.status(400).json("user not found");
            return;
        }
        let activationcode = (0, generate_activation_1.MakeActivationCode)(4);
        user.activationCode = activationcode;
        await user.save();
        await (0, sms_sender_1.sendTextMessage)(`Hi ${user.username} \nSorry for the inconvinience\nYour Marapesa password-reset Code is ${activationcode}`, `${phone}`, user._id, "password-reset");
        res.status(200).json(`Token sent to ***********${phone.slice(-3)}`);
        return;
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error });
        return;
    }
};
exports.requestToken = requestToken;
// User Login
const login = async (req, res) => {
    try {
        if (req.method !== "POST") {
            res.status(405).json("Method Not Allowed");
            return;
        }
        ;
        const { phone_number, password } = req.body;
        let phone = await (0, simplefunctions_1.Format_phone_number)(phone_number); //format the phone number
        const userExists = await user_1.User.findOne({
            $or: [
                { username: phone_number },
                { phone_number: phone }
            ]
        });
        if (!userExists.activated) {
            res.status(400).json("Kindly activate your account to continue");
            return;
        }
        if (!userExists || !(await bcryptjs_1.default.compare(password, userExists.password))) {
            res.status(401).json("Invalid credentials");
            return;
        }
        else {
            const { accessToken, refreshToken } = (0, generateToken_1.default)(userExists);
            const decoded = (0, jwt_decode_1.jwtDecode)(accessToken);
            res.setHeader("Set-Cookie", (0, cookie_1.serialize)("sessionToken", accessToken, {
                httpOnly: false,
                secure: process.env.NODE_ENV === "production", // Enable in production
                sameSite: "lax",
                path: "/",
                maxAge: 3600, // 1 hour
            }));
            res.status(200).json({ ok: true, message: "Logged in", token: accessToken, exp: decoded === null || decoded === void 0 ? void 0 : decoded.exp });
            return;
        }
    }
    catch (error) {
    }
};
exports.login = login;
// session check
const session_Check = async (req, res) => {
    const cookies = (0, cookie_2.parse)(req.headers.cookie || "");
    const token = cookies.sessionToken;
    if (!token) {
        // NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    ;
    try {
        const user = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET ? process.env.JWT_SECRET : "your_secret_key");
        // NextResponse.json(user);
        res.status(200).json(user);
        return;
    }
    catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};
exports.session_Check = session_Check;
const refresh = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    ;
    jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_SECRET ? process.env.REFRESH_SECRET : "my_secret_key", (err, decoded) => {
        if (err) {
            res.status(403).json({ message: "Forbidden" });
            return;
        }
        ;
        const newAccessToken = jsonwebtoken_1.default.sign({ userId: decoded.userId }, process.env.JWT_SECRET ? process.env.JWT_SECRET : "your_secret_key", { expiresIn: "15m" });
        res.json({ accessToken: newAccessToken });
        return;
    });
};
exports.refresh = refresh;
const logout = async (req, res) => {
    res.setHeader("Set-Cookie", (0, cookie_1.serialize)("sessionToken", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 0, // Expire immediately
    }));
    res.status(200).json({ message: "Logged out" });
    return;
};
exports.logout = logout;
//admin 
const registerAdmin = async (req, res) => {
    try {
        const { username, password, phone_number } = req.body;
        let newID = ` ${Date()}-${(0, generate_activation_1.MakeActivationCode)(4)}`;
        req.body.username = "Admin";
        let phone = await (0, simplefunctions_1.Format_phone_number)(phone_number); //format the phone number
        const userExists = await admin_1.Admin.findOne({
            $or: [
                { phone_number: phone }
            ],
        });
        if (userExists) {
            res.status(400).json("User already exists");
            return;
        }
        req.body.phone_number = phone;
        const user = new admin_1.Admin(req.body);
        const newAdmin = await user.save();
        res.status(201).json({ message: "admin added  successfully", newAdmin });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error });
        return;
    }
};
exports.registerAdmin = registerAdmin;
const admin_login = async (req, res) => {
    try {
        if (req.method !== "POST") {
            res.status(405).json("Method Not Allowed");
            return;
        }
        ;
        const { phone_number, password } = req.body;
        let phone = await (0, simplefunctions_1.Format_phone_number)(phone_number); //format the phone number
        const userExists = await admin_1.Admin.findOne({ phone_number: phone });
        if (!userExists || !(await bcryptjs_1.default.compare(password, userExists.password))) {
            res.status(401).json("Invalid credentials");
            return;
        }
        else {
            const { accessToken, refreshToken } = (0, generateToken_1.default)(userExists);
            const decoded = (0, jwt_decode_1.jwtDecode)(accessToken);
            res.setHeader("Set-Cookie", (0, cookie_1.serialize)("admin-sessionToken", accessToken, {
                httpOnly: false,
                secure: process.env.NODE_ENV === "production", // Enable in production
                sameSite: "lax",
                path: "/",
                maxAge: 3600, // 1 hour
            }));
            res.status(200).json({ ok: true, message: "Logged in", token: accessToken, exp: decoded === null || decoded === void 0 ? void 0 : decoded.exp });
            return;
        }
    }
    catch (error) {
    }
};
exports.admin_login = admin_login;
const get_Users = async (req, res) => {
    try {
        const { page = 1, limit = 10, sendId } = req.query;
        // let Cont = await Contribution.find({ user_id: req.user.userId })
        let users = await user_1.User.find().select(`-password ${sendId ? "" : "-_id"} -updatedAt -__v`)
            .skip((page - 1) * limit) // Skips (page - 1) * limit documents
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });
        const total = await user_1.User.countDocuments();
        res
            .status(200)
            .json({
            users, page: parseInt(page),
            totalPages: Math.ceil(total / limit),
        });
        return;
    }
    catch (error) {
        console.log(error);
        res
            .status(400)
            .json({ success: false, message: "operation failed ", error });
        return;
    }
};
exports.get_Users = get_Users;
const get_Admins = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        // let Cont = await Contribution.find({ user_id: req.user.userId })
        let users = await admin_1.Admin.find().select('-password -_id -updatedAt -__v -activated')
            .skip((page - 1) * limit) // Skips (page - 1) * limit documents
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });
        const total = await admin_1.Admin.countDocuments();
        res
            .status(200)
            .json({
            users, page: parseInt(page),
            totalPages: Math.ceil(total / limit),
        });
        return;
    }
    catch (error) {
        console.log(error);
        res
            .status(400)
            .json({ success: false, message: "operation failed ", error });
        return;
    }
};
exports.get_Admins = get_Admins;
