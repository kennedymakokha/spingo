import { Request, Response } from "express";
import { User } from "../models/user";

import { Format_phone_number } from "../utils/simplefunctions";
import jwt from "jsonwebtoken";

import { sendTextMessage } from "../utils/sms_sender";
import { serialize } from "cookie";
import bcrypt from "bcryptjs";
import generateTokens from "../utils/generateToken";
import { parse } from "cookie";
import { jwtDecode } from "jwt-decode";
import { MakeActivationCode } from "../utils/generate_activation";
import { Admin } from "../models/admin";


// User Registration

export const register = async (req: Request, res: Response) => {
    try {
        const { username, password, phone_number } = req.body;

        let phone = await Format_phone_number(phone_number); //format the phone number
        const userExists: any = await User.findOne(
            {
                $or: [
                    { username: phone_number },
                    { phone_number: phone }
                ],

            }
        );

        if (userExists) {
            res.status(400).json("User already exists")
            return
        }

        let activationcode = MakeActivationCode(4)
        req.body.phone_number = phone
        req.body.activationCode = activationcode
        const user: any = new User(req.body);
        const newUser = await user.save();

        await sendTextMessage(
            `Hi ${newUser.username} \nWelcome to Marapesa\nYour your activation Code is ${activationcode}`,
            `${phone}`,
            newUser._id,
            "account-activation"
        )
        res.status(201).json({ ok: true, message: "User registered successfully", newUser });
        return;

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server error", error });
        return;

    }
};

export const updatePassword = async (req: Request, res: Response) => {
    try {
        const { newPassword, phone_number } = req.body
        let phone = await Format_phone_number(phone_number);
        const user: any = await User.findOne({ phone_number: phone });  // Find the user by ID
        if (!user) {
            res.status(400).json("user not found");
            return
        }
        user.password = newPassword
        await user.save();
        res.status(200).json({ success: true, message: "Password updated successfully" });
        return;
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server error", error });
        return;

    }
}
export const activateuser = async (req: Request, res: Response) => {
    try {
        const { phone_number, code } = req.body
        let phone = await Format_phone_number(phone_number);
        const user = await User.findOne({ phone_number: phone });
        if (!user) {
            res.status(400).json("user not found");
            return
        }

        if (user.activationCode === code) {
            user.activationCode = ""
            user.activated = true
            await user.save();
            res.status(200).json({ ok: true, message: "user activated " });
            return;
        }
        else {
            res.status(400).json("wrong Activation code ");
            return
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server error", error });
        return;

    }
}
export const verifyuser = async (req: Request, res: Response) => {
    try {
        const { phone_number, code } = req.body
        let phone = await Format_phone_number(phone_number);
        const user = await User.findOne({ phone_number: phone });
        if (!user) {
            res.status(400).json("user not found");
            return
        }
        if (user.activationCode === code) {
            res.status(200).json("code-is correct");
            return
        }
        else {
            res.status(400).json("wrong Activation code ");
            return
        }

    } catch (error) {
        console.log(error)
        res.status(500).json("Server error try again");
        return;

    }
}
export const requestToken = async (req: Request, res: Response) => {
    try {

        const { phone_number } = req.body
        let phone = await Format_phone_number(phone_number);
        const user: any = await User.findOne({ phone_number: phone });  // Find the user by ID
        if (!user) {
            res.status(400).json("user not found");
            return
        }
        let activationcode = MakeActivationCode(4)
        user.activationCode = activationcode
        await user.save();
        await sendTextMessage(
            `Hi ${user.username} \nSorry for the inconvinience\nYour Marapesa password-reset Code is ${activationcode}`,
            `${phone}`,
            user._id,
            "password-reset"
        )
        res.status(200).json(`Token sent to ***********${phone.slice(-3)}`);
        return;
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server error", error });
        return;

    }
}


// User Login
export const login = async (req: Request, res: Response) => {

    try {
        if (req.method !== "POST") {
            res.status(405).json("Method Not Allowed")
            return
        };
        const { phone_number, password } = req.body;
        let phone = await Format_phone_number(phone_number); //format the phone number

        const userExists: any = await User.findOne({
            $or: [
                { username: phone_number },
                { phone_number: phone }
            ]
        });

        if (!userExists.activated) {
            res.status(400).json("Kindly activate your account to continue")
            return
        }
        if (!userExists || !(await bcrypt.compare(password, userExists.password))) {
            res.status(401).json("Invalid credentials");
            return
        } else {

            const { accessToken, refreshToken } = generateTokens(userExists);
            const decoded = jwtDecode(accessToken);
            res.setHeader("Set-Cookie", serialize("sessionToken", accessToken, {
                httpOnly: false,
                secure: process.env.NODE_ENV === "production", // Enable in production
                sameSite: "lax",
                path: "/",
                maxAge: 3600, // 1 hour
            }));
            res.status(200).json({ ok: true, message: "Logged in", token: accessToken, exp: decoded?.exp });
            return
        }

    } catch (error) {
        console.log(error)
    }


};

// session check
export const session_Check = async (req: Request, res: Response) => {
    const cookies = parse(req.headers.cookie || "");
    const token = cookies.sessionToken;

    if (!token) {
        // NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        res.status(401).json({ message: "Unauthorized" })
        return
    };

    try {

        const user: any = jwt.verify(token, process.env.JWT_SECRET ? process.env.JWT_SECRET : "your_secret_key");
        // NextResponse.json(user);
        res.status(200).json(user);
        return
    } catch (error) {
        res.status(401).json({ ok: "false", message: "Invalid token" });
    }
}

export const refresh = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        res.status(401).json({ message: "Unauthorized" })
        return
    };
    jwt.verify(refreshToken, process.env.REFRESH_SECRET ? process.env.REFRESH_SECRET : "my_secret_key", (err: any, decoded: any) => {
        if (err) {
            res.status(403).json({ message: "Forbidden" })
            return
        };
        const newAccessToken = jwt.sign(
            { userId: decoded.userId },
            process.env.JWT_SECRET ? process.env.JWT_SECRET : "your_secret_key",
            { expiresIn: "15m" }
        );

        res.json({ accessToken: newAccessToken });
        return
    });
};
export const logout = async (req: Request, res: Response) => {
    res.setHeader("Set-Cookie", serialize("sessionToken", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 0, // Expire immediately
    }));

    res.status(200).json({ message: "Logged out" });
    return
};


//admin 


export const registerAdmin = async (req: Request, res: Response) => {
    try {
        const { username, password, phone_number } = req.body;
        let newID = ` ${Date()}-${MakeActivationCode(4)}`

        req.body.username = "Admin"
        let phone = await Format_phone_number(phone_number); //format the phone number
        const userExists: any = await Admin.findOne(
            {
                $or: [

                    { phone_number: phone }
                ],

            }
        );

        if (userExists) {
            res.status(400).json("User already exists")
            return
        }
        req.body.phone_number = phone
        const user: any = new Admin(req.body);
        const newAdmin = await user.save();

        res.status(201).json({ message: "admin added  successfully", newAdmin });
        return;

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server error", error });
        return;

    }
};
export const admin_login = async (req: Request, res: Response) => {

    try {
        if (req.method !== "POST") {
            res.status(405).json("Method Not Allowed")
            return
        };
        const { phone_number, password } = req.body;
        let phone = await Format_phone_number(phone_number); //format the phone number
        const userExists: any = await Admin.findOne({ phone_number: phone });
        if (!userExists || !(await bcrypt.compare(password, userExists.password))) {
            res.status(401).json("Invalid credentials");
            return
        } else {

            const { accessToken, refreshToken } = generateTokens(userExists);
            const decoded = jwtDecode(accessToken);
            res.setHeader("Set-Cookie", serialize("admin-sessionToken", accessToken, {
                httpOnly: false,
                secure: process.env.NODE_ENV === "production", // Enable in production
                sameSite: "lax",
                path: "/",
                maxAge: 3600, // 1 hour
            }));
            res.status(200).json({ ok: true, message: "Logged in", token: accessToken, exp: decoded?.exp });
            return
        }

    } catch (error) {

    }


};
export const get_Users = async (req: Request | any, res: Response | any) => {
    try {
        const { page = 1, limit = 10, sendId } = req.query;
        // let Cont = await Contribution.find({ user_id: req.user.userId })
        let users: any = await User.find().select(`-password ${sendId ? "" : "-_id"} -updatedAt -__v`)
            .skip((page - 1) * limit)  // Skips (page - 1) * limit documents
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const total = await User.countDocuments();
        res
            .status(200)
            .json({
                users, page: parseInt(page),
                totalPages: Math.ceil(total / limit),
            });
        return
    } catch (error) {
        console.log(error);
        res
            .status(400)
            .json({ success: false, message: "operation failed ", error });
        return
    }
}
export const get_Admins = async (req: Request | any, res: Response | any) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        // let Cont = await Contribution.find({ user_id: req.user.userId })
        let users: any = await Admin.find().select('-password -_id -updatedAt -__v -activated')
            .skip((page - 1) * limit)  // Skips (page - 1) * limit documents
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const total = await Admin.countDocuments();
        res
            .status(200)
            .json({
                users, page: parseInt(page),
                totalPages: Math.ceil(total / limit),
            });
        return
    } catch (error) {
        console.log(error);
        res
            .status(400)
            .json({ success: false, message: "operation failed ", error });
        return
    }
}

