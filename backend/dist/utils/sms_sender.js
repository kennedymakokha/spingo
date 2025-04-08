"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendTextMessage = exports.SendMessage = void 0;
// import Logs from './../models/logsmodel.js'
const africastalking_1 = __importDefault(require("africastalking"));
const smsLogs_1 = __importDefault(require("../models/smsLogs"));
const africastalking = (0, africastalking_1.default)({
    apiKey: 'atsk_2bbe561ddcf7ff5e3b8f0061862c10b9939bc5105c67be917b39fe41d3dccbfb0cdbd763', // use your sandbox app API key for development in the test environment
    username: 'kenate',
});
// africastalking(credentials);
// Initialize a service e.g. SMS
const sms = africastalking.SMS;
const SendMessage = async (data) => {
    try {
        const options = {
            to: [`${data.address}`],
            message: `${data.Body}`,
            from: "",
        };
        // console.log(options)
        let response = await sms.send({
            to: '+254716017221',
            message: 'Hey AT Ninja! Wassup...',
            from: ''
        });
        if (response.SMSMessageData && response.SMSMessageData.Message) {
            console.log(response);
        }
        else {
            console.log('Error or no message data returned');
        }
        let body = { target: data.id, success: true, subject: data.subject, sent_to: data.address };
        // console.log(r)
        // await Logs.create(body)
    }
    catch (error) {
        let body = { target: data.id, success: false, subject: data.subject, sent_to: data.address, failure_reason: error };
        // await Logs.create(body)
        console.log(error);
    }
};
exports.SendMessage = SendMessage;
const sendTextMessage = async (message, phone, reciever) => {
    let sender_id = "Champ_Int";
    let api_key = "9b41859b01914a75a2a899b9f61dec93";
    // const body = {
    //     reciever,
    //     message,
    //     message_id: "",
    //     status_code: "",
    //     status_desc: "",
    //     state: "success"
    // }
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
        };
        const message = new smsLogs_1.default(body);
        // await message.save();
        if (data.status_code !== "1000") {
            body.status_code = data.status_code;
            body.status_desc = data.status_desc;
            const message = new smsLogs_1.default(body);
            return {
                success: false,
                data
            };
        }
        else {
            body.status_code = data[0].status_code;
            body.status_desc = data[0].status_desc;
            body.message_id = data[0].message_id;
            return {
                success: true,
                data
            };
        }
        // }
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
