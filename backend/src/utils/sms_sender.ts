// import Logs from './../models/logsmodel.js'
import Africastalking from 'africastalking';
import Sms from '../models/smsLogs';
import { ISms } from '../types';

const africastalking = Africastalking({

    apiKey: 'atsk_2bbe561ddcf7ff5e3b8f0061862c10b9939bc5105c67be917b39fe41d3dccbfb0cdbd763',         // use your sandbox app API key for development in the test environment
    username: 'kenate',
});
// africastalking(credentials);

// Initialize a service e.g. SMS
const sms = africastalking.SMS
export const SendMessage = async (data: any) => {

    try {
        const options = {
            to: [`${data.address}`],
            message: `${data.Body}`,
            from: "",
        }
        // console.log(options)
        let response: any = await sms.send({
            to: '+254716017221',
            message: 'Hey AT Ninja! Wassup...',
            from: ''
        })
        if (response.SMSMessageData && response.SMSMessageData.Message) {
            console.log(response);
        } else {
            console.log('Error or no message data returned');
        }
        let body = { target: data.id, success: true, subject: data.subject, sent_to: data.address }
        // console.log(r)
        // await Logs.create(body)
    } catch (error) {
        let body = { target: data.id, success: false, subject: data.subject, sent_to: data.address, failure_reason: error }
        // await Logs.create(body)
        console.log(error)

    }
}
export const sendTextMessage = async (message: string, phone: string, reciever: string) => {

    let sender_id = "Champ_Int"
    let api_key = "9b41859b01914a75a2a899b9f61dec93"

    // const body = {
    //     reciever,
    //     message,
    //     message_id: "",
    //     status_code: "",
    //     status_desc: "",
    //     state: "success"
    // }
    let dataIn = {
        api_key,
        sender_id,
        message,
        phone
    }
    try {
        const response: any = await fetch('https://sms.blessedtexts.com/api/sms/v1/sendsms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(dataIn)
        });


        const data = await response.json();

        let body: ISms | any = {
            reciever: reciever,
            message: dataIn.message,
            message_id: "",
            status_code: "",
            status_desc: "",
          
        }

        const message = new Sms(body);
        // await message.save();
        if (data.status_code !== "1000") {
            body.status_code = data.status_code
            body.status_desc = data.status_desc
          
            const message = new Sms(body);
            return {
                success: false,
                data
            }
        }
        else {
            body.status_code = data[0].status_code
            body.status_desc = data[0].status_desc
            body.message_id = data[0].message_id
            
            return {
                success: true,
                data
            }
        }

        // }

    } catch (error: any) {
        console.error('Error:', error);
        return {
            success: false,
            // error: error.message
        }

    }
}
