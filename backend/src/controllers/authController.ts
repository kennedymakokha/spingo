import { Request, Response } from "express";
import { User } from "../models/user";
import { hashPassword, verifyPassword, generateToken } from "../services/authService";
import { getSocketIo } from "../config/socket";
import { Format_phone_number } from "../utils/simplefunctions";
import { SendMessage } from "../utils/sms_sender";
import bcrypt from "bcryptjs";
import generateTokens from "../utils/generateToken";
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
        // await SendMessage(textbody)
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
        const { phone_number, password } = req.body;
        let phone = await Format_phone_number(phone_number); //format the phone number
        const userExists = await User.findOne({
            $or: [
                { username: phone_number },
                { phone_number: phone }
            ]
        });

        if (!userExists) {
            res.status(400).json({ message: "Invalid credentials" })
            return
        };

        const isMatch = await bcrypt.compare(password, userExists.password);
        if (!isMatch) {
            res.status(400).json({ message: "Invalid credentials" })
            return
        };

        const { accessToken, refreshToken } = generateTokens(userExists);
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true, // Set to true in production
            sameSite: "strict"
        });

        res.json({ accessToken });
        return
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
 
};
