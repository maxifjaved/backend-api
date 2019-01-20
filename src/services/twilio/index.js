import twilio from "twilio";
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_ACCOUNT_TOKEN);

export function sendPhoneVeficationCode(phonenumber, code) {
    return client.messages.create({
        body: `Your mobile verification code is  ${code}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phonenumber
    })
}