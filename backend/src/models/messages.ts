
import mongoose, { Schema, Document } from "mongoose";
import { IMessage } from "../types";


const MessageSchema = new Schema<IMessage>({
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    socketId: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    type: { type: String, enum: ["user", "system"], default: "user" },
});
MessageSchema.index({ sender: 1, receiver: 1, timestamp: 1 });
const Message = mongoose.model<IMessage>("Message", MessageSchema);

export default Message;