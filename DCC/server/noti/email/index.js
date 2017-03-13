var email_config = require('./email_config.json');
var request = require('request');
var email = {
    send: function (receivers, subject, content) {

        const nodemailer = require('nodemailer');
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: email_config.USER_EMAIL,
                clientId: email_config.USER_CLIENT_ID,
                clientSecret: email_config.USER_CLIENT_SECRET,
                refreshToken: email_config.USER_REFRESH_TOKEN,
                accessToken: email_config.USER_ACCESS_TOKEN,
            }
        });
        var mailOptions = {
            from: '"DEK Notification System" <dektech@dekemail.com>',
            to: receivers.toString(),
            subject: subject,
            text: content,
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
        });
    }
}
module.exports = email.send;
