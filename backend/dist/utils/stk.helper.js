"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendB2C = exports.Mpesa_stk = void 0;
const node_fetch_1 = __importStar(require("node-fetch"));
const axios_1 = __importDefault(require("axios"));
const moment_1 = __importDefault(require("moment"));
const mpesa_logs_1 = __importDefault(require("../models/mpesa_logs"));
const validatePhone = (phone) => {
    let raw_phone_number = phone.trim();
    let valid_phone_number = "";
    if (raw_phone_number.startsWith("+254")) {
        valid_phone_number = raw_phone_number.replace("+254", "254");
    }
    else if (raw_phone_number.startsWith("0")) {
        valid_phone_number = raw_phone_number.replace("0", "254");
    }
    else {
        valid_phone_number = raw_phone_number;
    }
    return valid_phone_number.replace(/\s+/g, ""); // Remove any spaces
};
const Mpesa_stk = async (No, amount, user) => {
    const consumer_key = "lG11Q8UCBBeg1GyoXCoASRSZCqofhBIf";
    const consumer_secret = "yR8U0rfCBqk2NSxC";
    const passkey = "ed593cbe53d156b8ce4646ab2ff989220db0424c2f7602eab549ef753496f9f6";
    const short_code = parseInt("4115395", 10);
    const timestamp = (0, moment_1.default)().format("YYYYMMDDHHmmss");
    const phone = validatePhone(No);
    const new_amount = parseInt(amount.toString(), 10);
    const Authorization = `Bearer ${Buffer.from(`${consumer_key}:${consumer_secret}`).toString("base64")}`;
    const response = await axios_1.default.get(`https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials`, {
        headers: {
            Authorization: `Basic ${Buffer.from(`${consumer_key}:${consumer_secret}`).toString("base64")}`,
        },
    });
    const token = response.data.access_token;
    const headers = new node_fetch_1.Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", `Bearer ${token}`);
    const fetch_response = await (0, node_fetch_1.default)(`https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest`, {
        method: "POST",
        headers,
        body: JSON.stringify({
            BusinessShortCode: short_code,
            Password: Buffer.from(`${short_code}${passkey}${timestamp}`).toString("base64"),
            Timestamp: timestamp,
            TransactionType: "CustomerPayBillOnline",
            Amount: new_amount,
            PartyA: phone,
            PartyB: 4115395,
            PhoneNumber: phone,
            CallBackURL: "https://api.marapesa.com/api/wallet/mpesa-callback",
            AccountReference: "Mtadao Pack Ltd",
            TransactionDesc: "Payment delivery of *",
        }),
    });
    const data = await fetch_response.json();
    await new mpesa_logs_1.default({
        MerchantRequestID: data.MerchantRequestID,
        CheckoutRequestID: data.CheckoutRequestID,
        phone_number: phone,
        amount: new_amount,
        ResponseCode: data.ResponseCode,
        user: user,
        log: "",
    }).save();
    return {
        MerchantRequestID: data.MerchantRequestID,
        CheckoutRequestID: data.CheckoutRequestID,
        phone_number: phone,
        amount: new_amount,
        ResponseCode: data.ResponseCode,
        user: user,
        log: "",
    };
};
exports.Mpesa_stk = Mpesa_stk;
exports.default = exports.Mpesa_stk;
const getAccessToken = async () => {
    const auth = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString("base64");
    const response = await axios_1.default.get(`${process.env.MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
        headers: {
            Authorization: `Basic ${auth}`,
        },
    });
    return response.data.access_token;
};
const sendB2C = async (req, res) => {
    var _a;
    try {
        const token = await getAccessToken();
        const payload = {
            InitiatorName: process.env.MPESA_INITIATOR_NAME,
            SecurityCredential: process.env.MPESA_SECURITY_CREDENTIAL,
            CommandID: "BusinessPayment", // can also be "SalaryPayment", "PromotionPayment"
            Amount: req.body.amount,
            PartyA: process.env.MPESA_SHORTCODE,
            PartyB: req.body.phone, // 2547XXXXXXXX
            Remarks: "Payment from Mtadao",
            QueueTimeOutURL: process.env.MPESA_B2C_CALLBACK,
            ResultURL: process.env.MPESA_B2C_CALLBACK,
            Occasion: "Payout",
        };
        const response = await axios_1.default.post(`${process.env.MPESA_BASE_URL}/mpesa/b2c/v1/paymentrequest`, payload, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        console.log("B2C Response:", response.data);
        res.json(response.data);
    }
    catch (error) {
        console.error("B2C Error:", ((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
        res.status(500).json({ error: "B2C payment failed" });
    }
};
exports.sendB2C = sendB2C;
// import fetch, { Headers } from "node-fetch";
// import axios from "axios";
// import moment from "moment";
// const validatePhone = (phone: string): string => {
//     let raw_phone_number = phone.trim();
//     let valid_phone_number = "";
//     if (raw_phone_number.startsWith("+254")) {
//         valid_phone_number = raw_phone_number.replace("+254", "254");
//     } else if (raw_phone_number.startsWith("0")) {
//         valid_phone_number = raw_phone_number.replace("0", "254");
//     } else {
//         valid_phone_number = raw_phone_number;
//     }
//     return valid_phone_number.replace(/\s+/g, ""); // Remove any spaces
// };
// interface MpesaStkResponse {
//     MerchantRequestID: string;
//     CheckoutRequestID: string;
//     phone_number: string;
//     amount: number;
//     ResponseCode: string;
//     user: string;
//     log: string;
// }
// export const Mpesa_stk = async (
//     No: string,
//     amount: number,
//     user: string
// ): Promise<MpesaStkResponse> => {
//     const consumer_key = process.env.MPESA_CONSUMER_KEY as string;
//     const consumer_secret = process.env.MPESA_CONSUMER_SECRETE as string;
//     const passkey = process.env.MPESA_CONSUMER_PASSKEY as string;
//     const short_code = parseInt(process.env.MPESA_SHORT_CODE as string, 10);
//     const timestamp = moment().format("YYYYMMDDHHmmss");
//     const phone = validatePhone(No);
//     const new_amount = parseInt(amount.toString(), 10);
//     const Authorization = `Bearer ${Buffer.from(
//         `${consumer_key}:${consumer_secret}`
//     ).toString("base64")}`;
//     const response = await axios.get<{ access_token: string }>(
//         `${process.env.MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
//         {
//             headers: {
//                 Authorization: `Basic ${Buffer.from(
//                     `${consumer_key}:${consumer_secret}`
//                 ).toString("base64")}`,
//             },
//         }
//     );
//     const token = response.data.access_token;
//     console.log(`token: ${token}`);
//     const headers = new Headers();
//     headers.append("Content-Type", "application/json");
//     headers.append("Authorization", `Bearer ${token}`);
//     const fetch_response = await fetch(
//         `${process.env.MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
//         {
//             method: "POST",
//             headers,
//             body: JSON.stringify({
//                 BusinessShortCode: short_code,
//                 Password: Buffer.from(
//                     `${short_code}${passkey}${timestamp}`
//                 ).toString("base64"),
//                 Timestamp: timestamp,
//                 TransactionType: "CustomerPayBillOnline",
//                 Amount: new_amount,
//                 PartyA: phone,
//                 PartyB: 4115395,
//                 PhoneNumber: phone,
//                 CallBackURL: process.env.MPESA_CALLbACK,
//                 AccountReference: "Mtadao Pack Ltd",
//                 TransactionDesc: "Payment delivery of *",
//             }),
//         }
//     );
//     const data: any = await fetch_response.json();
//     return {
//         MerchantRequestID: data.MerchantRequestID,
//         CheckoutRequestID: data.CheckoutRequestID,
//         phone_number: phone,
//         amount: new_amount,
//         ResponseCode: data.ResponseCode,
//         user: user,
//         log: "",
//     };
// };
// export default Mpesa_stk;
