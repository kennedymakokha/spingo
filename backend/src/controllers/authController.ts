import { Request, Response } from "express";
import { User } from "../models/user";

import { Format_phone_number } from "../utils/simplefunctions";
import jwt from "jsonwebtoken";

import { SendMessage } from "../utils/sms_sender";
import { serialize } from "cookie";
import bcrypt from "bcryptjs";
import generateTokens from "../utils/generateToken";
import { parse } from "cookie";
import { jwtDecode } from "jwt-decode";


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
                ]
            }
        );

        if (userExists) {
            res.status(400).json({ message: "User already exists" })
            return
        }
        const user = new User({ username, phone_number: phone, password });
        const newUser = await user.save();
        let textbody = { subject: "affiliate Link", id: newUser._id, address: `${phone}`, Body: `Hi \nYour referal link is http://localhost:3000?affiliate=${1245}  ` }
        await SendMessage(textbody)
        res.status(201).json({ message: "User registered successfully" });
        return;

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server error", error });
        return;

    }
};

// User Login
export const login = async (req: Request, res: Response) => {

    try {
        if (req.method !== "POST") {
            res.status(405).json({ message: "Method Not Allowed" })
            return
        };
        const { phone_number, password } = req.body;
        let phone = await Format_phone_number(phone_number); //format the phone number

        const userExists = await User.findOne({
            $or: [
                { username: phone_number },
                { phone_number: phone }
            ]
        });

        if (!userExists || !(await bcrypt.compare(password, userExists.password))) {
            res.status(401).json({ message: "Invalid credentials" });
            return
        }
        const { accessToken, refreshToken } = generateTokens(userExists);

        const decoded = jwtDecode(accessToken);

        let user =
            // Set HTTP-Only Cookie
            // res.cookie("accessToken", accessToken, {
            //     httpOnly: true,
            //     secure: false, // Set `true` in production with HTTPS
            //     sameSite: "lax",
            //   });
            res.setHeader("Set-Cookie", serialize("sessionToken", accessToken, {
                httpOnly: false,
                secure: process.env.NODE_ENV === "production", // Enable in production
                sameSite: "lax",
                path: "/",
                maxAge: 3600, // 1 hour
            }));
        res.status(200).json({ ok: true, message: "Logged in", token: accessToken, exp: decoded?.exp });
        return
    } catch (error) {

    }
    // try {
    //     const { phone_number, password } = req.body;
    //     let phone = await Format_phone_number(phone_number); //format the phone number
    //     const userExists = await User.findOne({
    //         $or: [
    //             { username: phone_number },
    //             { phone_number: phone }
    //         ]
    //     });

    //     if (!userExists) {
    //         res.status(400).json({ message: "Invalid credentials" })
    //         return
    //     };

    //     const isMatch = await bcrypt.compare(password, userExists.password);
    //     if (!isMatch) {
    //         res.status(400).json({ message: "Invalid credentials" })
    //         return
    //     };

    //     const { accessToken, refreshToken } = generateTokens(userExists);
    //     res.cookie("refreshToken", refreshToken, {
    //         httpOnly: true,
    //         secure: true, // Set to true in production
    //         sameSite: "strict"
    //     });

    //     res.json({ accessToken });
    //     return
    // } catch (error) {
    //     res.status(500).json({ message: "Server error" });
    // }

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

        const user = jwt.verify(token, process.env.JWT_SECRET ? process.env.JWT_SECRET : "your_secret_key");
        // NextResponse.json(user);
        res.status(200).json(user);
        return
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
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
