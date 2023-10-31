import 'dotenv/config';
import nodemailer from 'nodemailer';
import { __dirname } from '../path.js';

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'testing.alanari@gmail.com',
        pass: process.env.PASSWORD,
        authMethod: 'LOGIN'
    }
});

const sendEmail  = async (body, adress, subject, attachments) => 
await transporter.sendMail({
    from: 'maildepruebiña@gmail.com',
    to: adress,
    subject: subject,
    html: body,
    attachments: attachments
})


const mailSender = { sendEmail };

export default mailSender;