"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
var mongoose = require('mongoose');
const ContributionSchema = new mongoose.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "user",
    },
    type: {
        type: String,
        enum: ["deposit", "withdraw", "stake-lost", "stake-won",],
        default: "deposit"
    },
    amount: {
        type: Number,
        default: 0
    },
}, { timestamps: true });
const Contribution = mongoose.model('contribution', ContributionSchema);
exports.default = Contribution;
