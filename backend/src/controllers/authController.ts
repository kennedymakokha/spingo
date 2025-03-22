import { Request, Response } from "express";
import { User } from "../models/user";
import { hashPassword, verifyPassword, generateToken } from "../services/authService";
import { getSocketIo } from "../config/socket";

// User Registration
export const register = async (req: Request, res: Response) => {
    try {
        const { name, password, phone_number } = req.body;
        // let io = getSocketIo()
        // io?.emit('')
        // io?.to(`${req.uid}`).emit("unread-notifications", count);
        // Check if user exists
        if (await User.findOne({ phone_number })) {
            res.status(400).json({ message: "User already exists" });
        }

        // Create new user
        const hashedPassword = await hashPassword(password);
        const newUser = new User({ name, phone_number, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server error", error });
    }
};

// User Login
export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        const user: any = await User.findOne({ username });
        if (!user) {
            res.status(400).json({ message: "Invalid username or password" });
        }

        const isValid = await verifyPassword(password, user.password);
        if (!isValid) {
            res.status(400).json({ message: "Invalid username or password" });
        }

        const token = generateToken(user._id.toString());
        res.json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
