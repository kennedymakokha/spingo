import { Schema } from "mongoose";

var mongoose = require('mongoose');

const ContributionSchema = new mongoose.Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "user",
    },
    type: {
        type: String,

    },
    amount: {
        type: Number,
        default: 0
    },

}, { timestamps: true });



const Contribution = mongoose.model('contribution', ContributionSchema);
export default Contribution
