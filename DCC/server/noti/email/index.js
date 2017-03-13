var email_config = require('./email_config.json');
var request = require('request');
var email = {
    send: function (receivers, subject, content) {

        const nodemailer = require('nodemailer');
        //get a new access token from reresh token
        request.post(
            'https://www.googleapis.com/oauth2/v4/token',
            {
                form: {
                    client_secret : email_config.USER_CLIENT_SECRET,
                    grant_type: "refresh_token",
                    refresh_token: email_config.USER_REFRESH_TOKEN,
                    client_id: email_config.USER_CLIENT_ID,
                 }
            },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log(body);
                    console.log((JSON.parse(body)).access_token);
                }
                else
                {
                console.log(error);
                console.log(response.body);
                console.log(response.statusCode);}
            }
        );

        // create reusable transporter object using the default SMTP transport
        //3 leg
        console.log(email_config.USER_EMAIL);
        console.log(email_config.USER_CLIENT_ID);
        console.log(email_config.USER_CLIENT_SECRET);
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: email_config.USER_EMAIL,
                clientId: email_config.USER_CLIENT_ID,
                clientSecret: email_config.USER_CLIENT_SECRET,
                refreshToken: email_config.USER_REFRESH_TOKEN,
                accessToken: email_config.USER_ACCESS_TOKEN,
                // redirect_uris: "https://developers.google.com/oauthplayground/",
                // timeout: 60
            }
        });
        console.log('done transporter');
        // transporter.on('log',console.log);
        // setup email data with unicode symbols
        var mailOptions = {
            from: '"DEK Notification System" <namfsone@gmail.com>', // sender address
            to: receivers.toString(), // list of receivers
            subject: subject, // Subject line
            text: content, // plain text body
            // html: '<b>Something was here, nobody knows</b>' // html body
        };
        console.log('it got here');
        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
        });
    }
}
module.exports = email.send;
