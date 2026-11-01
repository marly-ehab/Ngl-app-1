import {Mailjetprovider} from "../../pkg/email/mailjet.js";
import {env} from "../config/env.js";


export const mailjetProvider = new Mailjetprovider({
    apiKey:env.mailjet.apiKey,
    apiSecret:env.mailjet.apiSecret,
    fromEmail:env.mailjet.fromEmail,
    fromName:env.mailjet.fromName,
})