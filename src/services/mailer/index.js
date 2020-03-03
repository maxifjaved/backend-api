import fs from 'fs';
import path from 'path';

import nodemailer from "nodemailer";
import handlebars from "handlebars";

import config from '../../config/config';

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
