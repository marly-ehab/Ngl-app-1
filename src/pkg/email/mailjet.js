import Mailjet from "node-mailjet";

export class Mailjetprovider{
    client;
    fromEmail;
    fromName;
    constructor (config) {
        this.client =  new Mailjet({
            apiKey: config.apiKey,
            apiSecret: config.apiSecret,
        });
        this.fromName = config.fromName;
        this.fromEmail = config.fromEmail;
    }
    async sendMail(email, subject, html){
        try {
            const result = await this.client.post('send', { version: 'v3.1' }).request({
                Messages: [
                    {
                        From: {
                            Email: this.fromEmail,
                            Name: this.fromName,
                        },
                        To: [
                            {
                                Email: email,
                            },
                        ],
                        Subject: subject,
                        HTMLPart: html,
                    },
                ],
            });
            const msg = result.body?.Messages?.[0];
            if (msg?.Status === 'success') {
                console.log('mailjet: email accepted for', email);
            } else {
                console.log('mailjet error:', JSON.stringify(msg?.Errors ?? result.body));
            }
        } catch (err) {
            console.log('mailjet failed:', err.statusCode, err.message, JSON.stringify(err.response?.data ?? ''));
        }
    }
}