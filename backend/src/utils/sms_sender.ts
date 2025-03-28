// import Logs from './../models/logsmodel.js'
import Africastalking from 'africastalking';

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

