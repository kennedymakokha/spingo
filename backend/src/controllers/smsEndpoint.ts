
import { Request, Response } from "express";
import { Predict } from "../models/prections";
import Wallet from "../models/wallet";
import Contribution from "../models/contributions";
import Sms from "../models/smsLogs";
import { sendTextMessage } from "../utils/sms_sender";


export const sendSms = async (req: Request | any, res: Response | any) => {

    const { message, phone, reciever, ref } = req.body;
    try {
        let response = await sendTextMessage(message, phone, reciever, ref)

        if (response.success) {
            res.status(200).json(response.data);
            return
        }
        else {
            res.status(400).json(response.data);
            return
        }
    } catch (error) {
        res.status(400).json({
            success: false,
            data: error
        });
        return
    }
    // let sender_id = "Champ_Int"
    // let api_key = "9b41859b01914a75a2a899b9f61dec93"

    // // receiver: {
    // //     type: Schema.Types.ObjectId,
    // //     ref: 'user'
    // // },
    // // message: { type: String, required: true },
    // // status_code: { type: String, required: true },
    // // status_desc: { type: String, required: true },
    // // timestamp: { type: Date, default: Date.now },
    // // state: { 
    // const body = {
    //     reciever,
    //     message,
    //     message_id: "",
    //     status_code: "",
    //     status_desc: "",
    //     state: "success"
    // }
    // try {
    //     const response = await fetch('https://sms.blessedtexts.com/api/sms/v1/sendsms', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Accept': 'application/json'
    //         },
    //         body: JSON.stringify({
    //             api_key,
    //             sender_id,
    //             message,
    //             phone
    //         })
    //     });

    //     const data = await response.json();

    //     body.status_code = data[0].status_code
    //     body.status_desc = data[0].status_desc
    //     body.message_id = data[0].message_id
    //     console.log(body)
    //     if (!response.ok) {
    //         console.log("Data1", data)
    //         body.state = "fail"
    //         const message = new Sms(body);

    //         await message.save();
    //         // socket.broadcast.emit("message", msg);
    //         throw new Error(data.message || 'Failed to send SMS');
    //         return
    //     }
    //     else {
    //         const message = new Sms(body);
    //         await message.save();
    //         res.status(200).json({
    //             success: true,
    //             data
    //         });
    //         // return
    //     }

    // } catch (error: any) {
    //     console.error('Error:', error);
    //     res.status(500).json({
    //         success: false,
    //         error: error.message
    //     });
    // }
}