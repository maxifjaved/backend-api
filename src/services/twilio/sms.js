import twilio from "twilio";

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_ACCOUNT_TOKEN);

client.messages.create({
    body: 'Test twillio sms configutation. is it working ?',
    from: process.env.TWILIO_PHONE_NUMBER,
    to: '+923324647331'
}).then(message => console.log(message.sid)).done();