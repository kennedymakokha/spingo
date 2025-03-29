
import { Request, Response } from "express";
import { Predict } from "../models/prections";
import Wallet from "../models/wallet";
import Contribution from "../models/contributions";


export const place_bet = async (req: Request | any, res: Response | any) => {
    try {
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
export const get_all_bets = async (req: Request | any, res: Response | any) => {
    try {
        // const startDate = '2025-03-01'; // Start of the month
        // const endDate = '2025-03-31'; // End of the month
        const { startDate, endDate, page, pageSize } = req.query
        // const result = await Predict.aggregate([
        //     {
        //         $group: {
        //             _id: "$spin_id",
        //             won: { $sum: { $cond: [{ $eq: ["$state", true] }, 1, 0] } },
        //             falseCount: { $sum: { $cond: [{ $eq: ["$state", false] }, 1, 0] } },
        //             trueSum: { $sum: { $cond: [{ $eq: ["$state", true] }, "$stake", 0] } },
        //             falseSum: { $sum: { $cond: [{ $eq: ["$state", false] }, "$stake", 0] } }
        //         }
        //     }
        // ]);
        const pipeline = [
            // Filter records based on the provided date range
            // {
            //     $match: {
            //         createdAt: {
            //             $gte: new Date(startDate),
            //             $lte: new Date(endDate)
            //         }
            //     }
            // },
            {
                $group: {
                    _id: "$spin_id",
                    won: { $sum: { $cond: [{ $eq: ["$state", true] }, 1, 0] } },
                    lost: { $sum: { $cond: [{ $eq: ["$state", false] }, 1, 0] } },
                    won_amount: { $sum: { $cond: [{ $eq: ["$state", true] }, "$stake", 0] } },
                    lost_amount: { $sum: { $cond: [{ $eq: ["$state", false] }, "$stake", 0] } },
                    createdAt: { $first: "$createdAt" } // Keep the createdAt from the first document in the group
                }
            },
            // Add pagination: skip for the current page and limit the page size
            {
                $skip: (page - 1) * parseInt(pageSize)
            },
            {
                $limit: parseInt(pageSize)
            },
            {
                $project: {
                    _id: 1,
                    won: 1,
                    lost: 1,
                    won_amount: 1,
                    lost_amount: 1,
                    createdAt: 1
                }
            }
        ];

        const result = await Predict.aggregate(pipeline);

        // let prections = await Predict.find().select('-outcome -prediction')
        res
            .status(200)
            .json(result);
        return
    } catch (error) {
        console.log(error);
        res
            .status(400)
            .json({ success: false, message: "operation failed ", error });
        return
    }
}