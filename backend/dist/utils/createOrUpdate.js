"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const wallet_1 = __importDefault(require("../models/wallet"));
const createOrUpdateWallet = async ({ userId, amount, contributionId, isSubtract = false }) => {
    const wallet = await wallet_1.default.findOne({ user_id: userId });
    const amountNum = Number(amount);
    if (wallet) {
        const updatedAmount = isSubtract
            ? Number(wallet.total_amount) - amountNum
            : Number(wallet.total_amount) + amountNum;
        const updatedWallet = await wallet_1.default.findOneAndUpdate({ user_id: userId }, { total_amount: updatedAmount }, { new: true });
        return updatedWallet;
    }
    else {
        const newWallet = await new wallet_1.default({
            user_id: userId,
            total_amount: amountNum,
            contibution_id: contributionId
        }).save();
        return newWallet;
    }
};
exports.default = createOrUpdateWallet;
