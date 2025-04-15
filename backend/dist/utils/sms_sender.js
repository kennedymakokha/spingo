"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendTextMessage = void 0;
const smsLogs_1 = __importDefault(require("../models/smsLogs"));
const sendTextMessage = async (message, phone, reciever, ref) => {
    let sender_id = "Champ_Int";
    let api_key = "9b41859b01914a75a2a899b9f61dec93";
    let dataIn = {
        api_key,
        sender_id,
        message,
        phone
    };
    try {
        const response = await fetch('https://sms.blessedtexts.com/api/sms/v1/sendsms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(dataIn)
        });
        const data = await response.json();
        let body = {
            reciever: reciever,
            message: dataIn.message,
            message_id: "",
            status_code: "",
            status_desc: "",
            ref: ref
        };
        if (Array.isArray(data) && data[0].status_code === "1000") {
            body.status_code = data[0].status_code;
            body.status_desc = data[0].status_desc;
            body.message_id = data[0].message_id;
            const message = new smsLogs_1.default(body);
            await message.save();
            return {
                success: true,
                data
            };
        }
        else {
            body.status_code = data.status_code;
            body.status_desc = data.status_desc;
            const message = new smsLogs_1.default(body);
            await message.save();
            return {
                success: false,
                data
            };
        }
    }
    catch (error) {
        console.error('Error:', error);
        return {
            success: false,
            // error: error.message
        };
    }
};
exports.sendTextMessage = sendTextMessage;
