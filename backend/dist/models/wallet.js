"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
var mongoose = require('mongoose');
const WalletSchema = new mongoose.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "user",
    },
    contibution_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "contribution",
    },
    total_amount: {
        type: Number,
        default: 0
    },
}, { timestamps: true });
const Wallet = mongoose.model('wallet', WalletSchema);
exports.default = Wallet;
