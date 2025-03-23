import { Schema } from "mongoose";

var mongoose = require('mongoose');
const WalletSchema = new mongoose.Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "user",
    },
    contibution_id: {
        type: Schema.Types.ObjectId,
        ref: "contribution",
    },
    total_amount: {
        type: Number,
        default: 0
    },

}, { timestamps: true });



const Wallet = mongoose.model('wallet', WalletSchema);
export default Wallet