"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_single_conversation = void 0;
const messages_1 = __importDefault(require("../models/messages"));
const get_single_conversation = async (req, res) => {
    const { user } = req.query;
    try {
        const messages = await messages_1.default.find({
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
    }
    catch (err) {
        console.error("Error fetching conversation history:", err);
        res.status(500).json({ message: "Error fetching conversation history" });
    }
};
exports.get_single_conversation = get_single_conversation;
