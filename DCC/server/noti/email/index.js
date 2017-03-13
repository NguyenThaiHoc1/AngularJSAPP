var email_config = require('./email_config.json');
var request = require('request');
var email = {
    send: function (receivers, subject, content, callback) {
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
            from: '"DEK Notification System" <namfsone@gmail.com>', // sender address
            to: receivers.toString(), // list of receivers
            subject: subject, // Subject line
            text: content, // plain text body
            // html: '<b>Something was here, nobody knows</b>' // html body
        };
        transporter.sendMail(mailOptions, (error, info) => {
            callback(error, info);
        });
    }
}
module.exports = email.send;
