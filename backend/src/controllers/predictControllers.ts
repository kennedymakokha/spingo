
import { Request, Response } from "express";
import { Predict } from "../models/prections";
import Wallet from "../models/wallet";
import Contribution from "../models/contributions";


export const place_bet = async (req: Request | any, res: Response | any) => {
    try {
        console.log(req.body)
        req.body.user_id = req.user.userId
        let walet = await Wallet.findOne({ user_id: req.user.userId })
        req.body.state = req.body.outcome === req.body.prediction
        let new_wallet_ammount
        let type
        if (!req.body.state) {
            type = "stake-lost"
            new_wallet_ammount = parseInt(walet.total_amount) - parseInt(req.body.stake)
        } else {
            type = "stake-won"
            new_wallet_ammount = parseInt(walet.total_amount) + parseInt(req.body.stake)
        }
        await Wallet.findOneAndUpdate({ user_id: req.user.userId }, { total_amount: new_wallet_ammount }, { new: true, useFindAndModify: false })
        await new Contribution({ user_id: req.user.userId, amount: req.body.stake, type }).save()
        let prections = await new Predict(req.body).save()
        res
            .status(200)
            .json(prections);
        return
    } catch (error) {
        console.log(error);
        res
            .status(400)
            .json({ success: false, message: "operation failed ", error });
        return
    }
}
export const get_bets = async (req: Request | any, res: Response | any) => {
    try {
        let prections = await Predict.find({ user_id: req.user.userId })
        res
            .status(200)
            .json(prections);
        return
    } catch (error) {
        console.log(error);
        res
            .status(400)
            .json({ success: false, message: "operation failed ", error });
        return
    }
}