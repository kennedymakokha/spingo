
import { Request, Response } from "express";
import { Predict } from "../models/prections";
import Wallet from "../models/wallet";
import Contribution from "../models/contributions";
import Message from "../models/messages";
import { decryptMessage } from "../config/encrypt";



export const get_single_conversation = async (req: Request | any, res: Response | any) => {
    const { user } = req.query;

    try {
        const messages = await Message.find({
            $or: [
                { sender: req.user.userId, receiver: user },
                { sender: user, receiver: req.user.userId },
            ],
        }).sort({ timestamp: 1 }); // Sort messages by timestamp (ascending)
        // const decryptedMessages = messages.map((m) => ({
        //     ...m.toObject(),
        //     message: decryptMessage(m.message),
        // }));
        res.json(messages);
    } catch (err) {
        console.error("Error fetching conversation history:", err);
        res.status(500).json({ message: "Error fetching conversation history" });
    }
}
