import Contribution from "../models/contributions";
import { User } from "../models/user";
import Wallet from '../models/wallet'
import { Request, Response } from "express";
import Mpesa_stk from "../utils/stk.helper";
export const Load_wallet = async (req: Request | any, res: Response | any) => {
    try {
        const { amount, type, payment_phone_number } = req.body
        let AuthUser: any = await User.findOne({ _id: req.user.userId })
        let phone = AuthUser.phone_number
        // if (!req.body.payment_phone_number) {
        //     phone = AuthUser.phone_number
        // }
        // console.log(AuthUser)
        // return
        if (type === "deposit") {
            await Mpesa_stk(
                phone,
                req.body.amount,
                req?.user?._id,
            );
        }
        let walet = await Wallet.findOne({ user_id: req.user.userId })
        let contribution = await new Contribution({ user_id: req.user.userId, amount: req.body.amount, type: req.body.type }).save()
        let new_wallet_ammount = 0
        if (walet) {
            if (type === "withdraw" || type === "stake-lost") {
                new_wallet_ammount = parseInt(walet.total_amount) - parseInt(req.body.amount)
            } else {
                new_wallet_ammount = parseInt(walet.total_amount) + parseInt(req.body.amount)
            }
            const Update = await Wallet.findOneAndUpdate({ user_id: req.user.userId }, { total_amount: new_wallet_ammount }, { new: true, useFindAndModify: false })
            res
                .status(200)
                .json(Update);
            return
        } else {
            new_wallet_ammount = amount
            await new Wallet({ user_id: req.user.userId, total_amount: new_wallet_ammount, contibution_id: contribution._id }).save()
            res
                .status(200)
                .json({ message: "User Saved Successfully !!", contribution });
            return
        }
    } catch (error) {
        console.log(error);
        res
            .status(400)
            .json({ success: false, message: "operation failed ", error });
        return
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

