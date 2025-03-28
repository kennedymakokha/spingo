import mongoose from 'mongoose'



const Schema = mongoose.Schema;
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



export const Predict = mongoose.model('tb_prediction', predictionSchema);

