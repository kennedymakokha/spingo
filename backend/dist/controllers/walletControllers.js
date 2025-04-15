"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makePayment = exports.mpesa_callback = exports.get_contributions = exports.get_wallet = exports.Load_wallet = void 0;
const contributions_1 = __importDefault(require("../models/contributions"));
const user_1 = require("../models/user");
const wallet_1 = __importDefault(require("../models/wallet"));
const stk_helper_1 = __importDefault(require("../utils/stk.helper"));
const socket_1 = require("../config/socket");
const mpesa_logs_1 = __importDefault(require("../models/mpesa_logs"));
const createOrUpdate_1 = __importDefault(require("../utils/createOrUpdate"));
let io = (0, socket_1.getSocketIo)();
// export const Load_wallet = async (req: Request | any, res: Response | any) => {
//     try {
//         const { amount, type, payment_phone_number } = req.body
//         let AuthUser: any = await User.findOne({ _id: req.user.userId })
//         let phone = AuthUser.phone_number
//         if (type === "deposit") {
//             let response = await Mpesa_stk(
//                 phone,
//                 req.body.amount,
//                 req?.user?._id,
//             );
//             let Logs: any = await MpesaLogs.findOne({ MerchantRequestID: response.MerchantRequestID })
//             // Poll for Logs until logs are not empty or max retries reached
//             let retryCount = 0;
//             const maxRetries = 10;  // Maximum number of attempts
//             const retryInterval = 5000;  // 5 seconds between retries
//             // Wait for Logs to be updated
//             while (Logs?.log === '' && retryCount < maxRetries) {
//                 retryCount++;
//                 console.log(`Retry attempt ${retryCount}: Waiting for logs to be updated...`);
//                 // Wait for 5 seconds before checking again
//                 await new Promise(resolve => setTimeout(resolve, retryInterval));
//                 // Fetch updated Logs
//                 Logs = await MpesaLogs.findOne({ MerchantRequestID: response.MerchantRequestID });
//             }
//             if (Logs?.log !== '') {
//                 console.log("Logs have been updated:", Logs);
//                 // Proceed with the rest of the flow
//                 if (Logs.ResponseCode !== 0) {
//                     res.status(400).json(`${Logs.ResultDesc}`)
//                     return
//                 }
//                 let walet = await Wallet.findOne({ user_id: req.user.userId })
//                 let contribution = await new Contribution({ user_id: req.user.userId, amount: req.body.amount, type: req.body.type }).save()
//                 let new_wallet_ammount = 0
//                 if (walet) {
//                     new_wallet_ammount = parseInt(walet.total_amount) + parseInt(req.body.amount)
//                     const Update = await Wallet.findOneAndUpdate({ user_id: req.user.userId }, { total_amount: new_wallet_ammount }, { new: true, useFindAndModify: false })
//                     res
//                         .status(200)
//                         .json(Update);
//                     return
//                 } else {
//                     new_wallet_ammount = amount
//                     await new Wallet({ user_id: req.user.userId, total_amount: new_wallet_ammount, contibution_id: contribution._id }).save()
//                     res
//                         .status(200)
//                         .json({ message: "User Saved Successfully !!", contribution });
//                     return
//                 }
//             } else {
//                 // If max retries reached and logs are still empty, handle accordingly
//                 console.error("Failed to get valid logs after max retries.");
//                 res.status(500).json("Failed to process payment. Try again later.");
//             }
//         } else {
//             let walet = await Wallet.findOne({ user_id: req.user.userId })
//             let contribution = await new Contribution({ user_id: req.user.userId, amount: req.body.amount, type: req.body.type }).save()
//             let new_wallet_ammount = 0
//             if (walet) {
//                 if (type === "withdraw" || type === "stake-lost") {
//                     new_wallet_ammount = parseInt(walet.total_amount) - parseInt(req.body.amount)
//                 } else {
//                     new_wallet_ammount = parseInt(walet.total_amount) + parseInt(req.body.amount)
//                 }
//                 const Update = await Wallet.findOneAndUpdate({ user_id: req.user.userId }, { total_amount: new_wallet_ammount }, { new: true, useFindAndModify: false })
//                 io?.emit('update-cash')
//                 res
//                     .status(200)
//                     .json(Update);
//                 // io?.to(`${req.uid}`).emit("unread-notifications", count);
//                 return
//             } else {
//                 new_wallet_ammount = amount
//                 await new Wallet({ user_id: req.user.userId, total_amount: new_wallet_ammount, contibution_id: contribution._id }).save()
//                 io?.emit('update-cash')
//                 res
//                     .status(200)
//                     .json({ message: "User Saved Successfully !!", contribution });
//                 return
//             }
//         }
//     } catch (error) {
//         console.log(error);
//         res
//             .status(400)
//             .json({ success: false, message: "operation failed ", error });
//         return
//     }
// };
const Load_wallet = async (req, res) => {
    try {
        const { amount, type } = req.body;
        const userId = req.user.userId;
        const authUser = await user_1.User.findById(userId);
        if (!authUser)
            return res.status(404).json({ message: "User not found" });
        const phone = authUser.phone_number;
        const amountNum = Number(amount);
        const contribution = await new contributions_1.default({
            user_id: userId,
            amount: amountNum,
            type
        }).save();
        if (type === "deposit") {
            const response = await (0, stk_helper_1.default)(phone, amountNum, userId);
            const merchantRequestId = response.MerchantRequestID;
            let logs = await mpesa_logs_1.default.findOne({ MerchantRequestID: merchantRequestId });
            const maxRetries = 10;
            const retryInterval = 5000;
            let retryCount = 0;
            while ((logs === null || logs === void 0 ? void 0 : logs.log) === '' && retryCount < maxRetries) {
                retryCount++;
                console.log(`Retrying log fetch: attempt ${retryCount}`);
                await new Promise(resolve => setTimeout(resolve, retryInterval));
                logs = await mpesa_logs_1.default.findOne({ MerchantRequestID: merchantRequestId });
            }
            if (!logs || logs.log === '') {
                return res.status(500).json({ message: "Payment not verified. Please try again later." });
            }
            if (logs.ResponseCode !== 0) {
                return res.status(400).json({ message: logs.ResultDesc });
            }
            const updatedWallet = await (0, createOrUpdate_1.default)({
                userId,
                amount: amountNum,
                contributionId: contribution._id
            });
            return res.status(200).json({ message: "Deposit successful", wallet: updatedWallet });
        }
        // Other transaction types
        const isSubtract = (type === "withdraw" || type === "stake-lost");
        const updatedWallet = await (0, createOrUpdate_1.default)({
            userId,
            amount: amountNum,
            contributionId: contribution._id,
            isSubtract
        });
        io === null || io === void 0 ? void 0 : io.emit("update-cash");
        return res.status(200).json({
            message: `${type} successful`,
            wallet: updatedWallet
        });
    }
    catch (error) {
        console.error("Wallet operation error:", error);
        return res.status(400).json({
            success: false,
            message: "Operation failed",
            error: (error === null || error === void 0 ? void 0 : error.message) || error
        });
    }
};
exports.Load_wallet = Load_wallet;
const get_wallet = async (req, res) => {
    try {
        let walet = await wallet_1.default.findOne({ user_id: req.user.userId });
        res.status(200)
            .json(walet);
        return;
    }
    catch (error) {
        console.log(error);
        res
            .status(400)
            .json({ success: false, message: "operation failed ", error });
        return;
    }
};
exports.get_wallet = get_wallet;
const get_contributions = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        let Cont = await contributions_1.default.find({ user_id: req.user.userId });
        let contributions = await contributions_1.default.find({ user_id: req.user.userId })
            .skip((page - 1) * limit) // Skips (page - 1) * limit documents
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });
        const summedData = Object.entries(Cont.reduce((acc, transaction) => {
            if (acc[transaction.type]) {
                acc[transaction.type] += transaction.amount;
            }
            else {
                acc[transaction.type] = transaction.amount;
            }
            return acc;
        }, {})).map(([type, amount]) => ({
            type,
            amount
        }));
        const total = await contributions_1.default.countDocuments();
        res
            .status(200)
            .json({
            contributions, summedData, page: parseInt(page),
            totalPages: Math.ceil(total / limit),
        });
        return;
    }
    catch (error) {
        console.log(error);
        res
            .status(400)
            .json({ success: false, message: "operation failed ", error });
        return;
    }
};
exports.get_contributions = get_contributions;
const mpesa_callback = async (req, res) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    try {
        const Logs = await mpesa_logs_1.default.find({
            MerchantRequestID: (_b = (_a = req.body.Body) === null || _a === void 0 ? void 0 : _a.stkCallback) === null || _b === void 0 ? void 0 : _b.MerchantRequestID
        });
        for (let i = 0; i < Logs.length; i++) {
            await mpesa_logs_1.default.findOneAndUpdate({
                _id: Logs[i]._id
            }, {
                log: JSON.stringify(req.body), ResultDesc: (_d = (_c = req.body.Body) === null || _c === void 0 ? void 0 : _c.stkCallback) === null || _d === void 0 ? void 0 : _d.ResultDesc,
                ResponseCode: (_f = (_e = req.body.Body) === null || _e === void 0 ? void 0 : _e.stkCallback) === null || _f === void 0 ? void 0 : _f.ResultCode,
                MpesaReceiptNumber: (_k = (_j = (_h = (_g = req.body.Body) === null || _g === void 0 ? void 0 : _g.stkCallback) === null || _h === void 0 ? void 0 : _h.CallbackMetadata) === null || _j === void 0 ? void 0 : _j.Item[1]) === null || _k === void 0 ? void 0 : _k.Value
            }, { new: true, useFindAndModify: false });
            if (((_m = (_l = req.body.Body) === null || _l === void 0 ? void 0 : _l.stkCallback) === null || _m === void 0 ? void 0 : _m.ResultCode) === 0) {
            }
        }
    }
    catch (error) {
        console.log(error);
        res
            .status(400)
            .json({ success: false, message: "operation failed ", error });
        return;
    }
};
exports.mpesa_callback = mpesa_callback;
const makePayment = async (req, res) => {
    try {
        const { amount, phone_number } = req.body;
        const response = await (0, stk_helper_1.default)(phone_number, Number(amount), "679b1598af402f031e2da84c");
        const merchantRequestId = response.MerchantRequestID;
        let logs = await mpesa_logs_1.default.findOne({ MerchantRequestID: merchantRequestId });
        const maxRetries = 10;
        const retryInterval = 5000;
        let retryCount = 0;
        while ((logs === null || logs === void 0 ? void 0 : logs.log) === '' && retryCount < maxRetries) {
            retryCount++;
            console.log(`Retrying log fetch: attempt ${retryCount}`);
            await new Promise(resolve => setTimeout(resolve, retryInterval));
            logs = await mpesa_logs_1.default.findOne({ MerchantRequestID: merchantRequestId });
        }
        if (!logs || logs.log === '') {
            return res.status(500).json({ message: "Payment not verified. Please try again later." });
        }
        if (logs.ResponseCode !== 0) {
            return res.status(400).json({ message: logs.ResultDesc });
        }
        return res.status(200).json({ message: "Deposit successful" });
    }
    catch (error) {
        console.error("Wallet operation error:", error);
        return res.status(400).json({
            success: false,
            message: "Operation failed",
            error: (error === null || error === void 0 ? void 0 : error.message) || error
        });
    }
};
exports.makePayment = makePayment;
