import Contribution from "../models/contributions";
import { User } from "../models/user";
import Wallet from '../models/wallet'
import { Request, Response } from "express";
import Mpesa_stk from "../utils/stk.helper";
import { getSocketIo } from "../config/socket";
import MpesaLogs from "../models/mpesa_logs";
import createOrUpdateWallet from "../utils/createOrUpdate";
import { toLocalPhoneNumber } from "../utils/simplefunctions";
let io = getSocketIo()
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
export const Load_wallet = async (req: Request | any, res: Response | any) => {
    try {
        const { amount, type } = req.body;
        const userId = req.user.userId;

        const authUser = await User.findById(userId);
        if (!authUser) return res.status(404).json({ message: "User not found" });

        const phone = authUser.phone_number;
        const amountNum = Number(amount);

        const contribution = await new Contribution({
            user_id: userId,
            amount: amountNum,
            type
        }).save();

        if (type === "deposit") {
            const response = await Mpesa_stk(phone, amountNum, userId);
            const merchantRequestId = response.MerchantRequestID;

            let logs = await MpesaLogs.findOne({ MerchantRequestID: merchantRequestId });
            const maxRetries = 10;
            const retryInterval = 5000;
            let retryCount = 0;

            while (logs?.log === '' && retryCount < maxRetries) {
                retryCount++;
                console.log(`Retrying log fetch: attempt ${retryCount}`);
                await new Promise(resolve => setTimeout(resolve, retryInterval));
                logs = await MpesaLogs.findOne({ MerchantRequestID: merchantRequestId });
            }

            if (!logs || logs.log === '') {
                return res.status(500).json({ message: "Payment not verified. Please try again later." });
            }

            if (logs.ResponseCode !== 0) {
                return res.status(400).json({ message: logs.ResultDesc });
            }

            const updatedWallet = await createOrUpdateWallet({
                userId,
                amount: amountNum,
                contributionId: contribution._id
            });

            return res.status(200).json({ message: "Deposit successful", wallet: updatedWallet });
        }

        // Other transaction types
        const isSubtract = (type === "withdraw" || type === "stake-lost");

        const updatedWallet = await createOrUpdateWallet({
            userId,
            amount: amountNum,
            contributionId: contribution._id,
            isSubtract
        });

        io?.emit("update-cash");

        return res.status(200).json({
            message: `${type} successful`,
            wallet: updatedWallet
        });

    } catch (error: any) {
        console.error("Wallet operation error:", error);
        return res.status(400).json({
            success: false,
            message: "Operation failed",
            error: error?.message || error
        });
    }
};



export const get_wallet = async (req: Request | any, res: Response | any) => {
    try {

        let walet = await Wallet.findOne({ user_id: req.user.userId })
        res.status(200)
            .json(walet);
        return
    } catch (error) {
        console.log(error);
        res
            .status(400)
            .json({ success: false, message: "operation failed ", error });
        return
    }
}
export const get_Mpesa_logs = async (req: Request | any, res: Response | any) => {
    try {
        let user: any = await User.findOne({ _id: req.user.userId })
        console.log(user)
        let phone = toLocalPhoneNumber(user.phone_number)
        let Logs = await MpesaLogs.find({ phone_number: phone })
        res.status(200)
            .json(Logs);
        return
    } catch (error) {
        console.log(error);
        res
            .status(400)
            .json({ success: false, message: "operation failed ", error });
        return
    }
}
export const get_contributions = async (req: Request | any, res: Response | any) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        let Cont = await Contribution.find({ user_id: req.user.userId })
        let contributions: any = await Contribution.find({ user_id: req.user.userId })
            .skip((page - 1) * limit)  // Skips (page - 1) * limit documents
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });
        const summedData = Object.entries(
            Cont.reduce((acc: any, transaction: any) => {
                if (acc[transaction.type]) {
                    acc[transaction.type] += transaction.amount;
                } else {
                    acc[transaction.type] = transaction.amount;
                }
                return acc;
            }, {})
        ).map(([type, amount]) => ({
            type,
            amount
        }));
        const total = await Contribution.countDocuments();
        res
            .status(200)
            .json({
                contributions, summedData, page: parseInt(page),
                totalPages: Math.ceil(total / limit),
            });
        return
    } catch (error) {
        console.log(error);
        res
            .status(400)
            .json({ success: false, message: "operation failed ", error });
        return
    }
}



export const mpesa_callback = async (req: Request | any, res: Response | any) => {
    try {

        const Logs = await MpesaLogs.find({
            MerchantRequestID: req.body.Body?.stkCallback?.MerchantRequestID
        })


        for (let i = 0; i < Logs.length; i++) {

            await MpesaLogs.findOneAndUpdate(
                {
                    _id: Logs[i]._id
                }, {
                log: JSON.stringify(req.body), ResultDesc: req.body.Body?.stkCallback?.ResultDesc,
                ResponseCode: req.body.Body?.stkCallback?.ResultCode,
                MpesaReceiptNumber: req.body.Body?.stkCallback?.CallbackMetadata?.Item[1]?.Value
            }, { new: true, useFindAndModify: false })

            if (req.body.Body?.stkCallback?.ResultCode === 0) {


            }
        }
    } catch (error) {
        console.log(error);
        res
            .status(400)
            .json({ success: false, message: "operation failed ", error });
        return
    }
}
export const makePayment = async (req: Request | any, res: Response | any) => {
    try {
        const { amount, phone_number } = req.body;
        const user: any = await User.findById(req.user.userId)
        let number
        if (phone_number) {
            number = phone_number
        }
        else {
            const user = await User.findById(req.user.userId)
            number = user?.phone_number
        }
        const response = await Mpesa_stk(number, Number(amount), user._id);
        const merchantRequestId = response.MerchantRequestID;

        let logs = await MpesaLogs.findOne({ MerchantRequestID: merchantRequestId });
        const maxRetries = 10;
        const retryInterval = 5000;
        let retryCount = 0;

        while (logs?.log === '' && retryCount < maxRetries) {
            retryCount++;
            console.log(`Retrying log fetch: attempt ${retryCount}`);
            await new Promise(resolve => setTimeout(resolve, retryInterval));
            logs = await MpesaLogs.findOne({ MerchantRequestID: merchantRequestId });
        }

        if (!logs || logs.log === '') {
            return res.status(500).json({ message: "Payment not verified. Please try again later." });
        }

        if (logs.ResponseCode !== 0) {
            return res.status(400).json({ message: logs.ResultDesc });
        }



        return res.status(200).json({ message: "Deposit successful" });


    } catch (error: any) {
        console.error("Wallet operation error:", error);
        return res.status(400).json({
            success: false,
            message: "Operation failed",
            error: error?.message || error
        });
    }
};


