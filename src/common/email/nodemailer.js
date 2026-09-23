//create transporter
import nodemailer from "nodemailer";
import {config} from "dotenv";

config();
console.log('USER:', process.env.EMAIL_USER);
console.log('PASS LENGTH:', process.env.EMAIL_PASSWORD?.length);

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});


export async function sendEmail(to, subject, html) {


    await transporter.sendMail({
        from: `"NGL-APP" <${process.env.EMAIL_USER}>`,
        to: to,
        subject: subject,
        html: html,
    });
}


