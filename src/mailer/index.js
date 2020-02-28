import fs from 'fs';
import path from 'path';

import nodemailer from "nodemailer";
import handlebars from "handlebars";

import config from '../config/config';

const EMAIL_TEMPLATE_BASE = path.join(__dirname, './templates');

// load template file & inject data => return content with injected data.
const template = (fileName, data) => {
    const content = fs.readFileSync(EMAIL_TEMPLATE_BASE + fileName).toString();
    const inject = handlebars.compile(content);
    return inject(data);
};

// --------- Email Templates --------- //

export function verificationEmail({ name, email, verificationUrl }) {
    return {
        from: `Muhammad Asif Javed - <axif.javed@gmail.com>`,
        to: email,
        subject: `√√ Confirm Your Email. √√`,
        text: template('/verify-email/email.txt', { name, email, verificationUrl }),
        html: template('/verify-email/email.html', { name, email, verificationUrl })
    };
}

export function forgotPasswordEmail({ name, email, resetUrl }) {
    return {
        from: `Muhammad Asif Javed - <axif.javed@gmail.com>`,
        to: email,
        subject: `√√ Reset Password Request. √√`,
        text: template('/forgot-password/email.txt', { name, email, resetUrl }),
        html: template('/forgot-password/email.html', { name, email, resetUrl })
    };
}



const emailClient = nodemailer.createTransport({
    host: config.emailHost,
    port: config.emailPort,
    // secure: config.emailSecure,
    auth: {
        user: config.emailUser,
        pass: config.emailPass
    }
});

export function sendEmail(data) {
    if (!emailClient) {
        return;
    }

    return emailClient.sendMail(data);
}



async function main() {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();
    console.log("TCL: main -> testAccount", testAccount)

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass // generated ethereal password
        }
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <' + testAccount.user + '>', // sender address
        to: "axif.javed@gmail.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "", // plain text body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

main().catch(console.error);