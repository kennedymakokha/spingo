"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Predict = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const predictionSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "user",
    },
    spin_id: {
        type: String,
    },
    stake: {
        type: Number,
        default: 0
    },
    outcome: {
        enum: ["heads", "tails",],
    },
    prediction: {
        enum: ["heads", "tails",],
    },
    state: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });
exports.Predict = mongoose_1.default.model('tb_prediction', predictionSchema);
