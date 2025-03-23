import Contribution from "../models/contributions";
import { User } from "../models/user";
import Wallet from '../models/wallet'
import { Request, Response } from "express";
export const register = async (req: Request, res: Response | any) => {
    try {
        const { amount, type } = req.body
        let { phone_number } = await User.findOne({ _id: req.user._id })

        let phone
        if (!req.body.payment_phone_number) {
            phone = phone_number
        }

        // await Mpesa_stk(
        //     phone,
        //     req.body.amount,
        //     req.user._id,
        // );

        let walet = await Wallet.findOne({ user_id: req.user._id })
        let contribution = await new Contribution({ user_id: req.user._id, amount: req.body.amount, type: req.body.type }).save()
        let new_wallet_ammount = 0
        if (walet) {
            if (type === "withdrawal") {
                new_wallet_ammount = parseInt(walet.total_amount) - parseInt(req.body.amount)
            } else {
                new_wallet_ammount = parseInt(walet.total_amount) + parseInt(req.body.amount)
            }

            const Update = await Wallet.findOneAndUpdate({ user_id: req.user._id }, { total_amount: new_wallet_ammount }, { new: true, useFindAndModify: false })
            return res
                .status(200)
                .json(Update);
        } else {
            new_wallet_ammount = amount
            await new Wallet({ user_id: req.user._id, total_amount: new_wallet_ammount, contibution_id: contribution._id }).save()
            return res
                .status(200)
                .json({ message: "User Saved Successfully !!", contribution });
        }
    } catch (error) {
        console.log(error);
        return res
            .status(400)
            .json({ success: false, message: "operation failed ", error });
    }

};