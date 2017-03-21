var email = require('./email');
var desktop = require('./desktop');
var models = require('../models');
var arr_email = [];
var arr_desktop = [];
function init(receivers) {
    for (var i = 0; i < receivers.length; i++) {
        models.User.getUserByEmail(receivers[i], function (user) {
            if (user.isNotificationDesktop === true)
                desktop([user.email], notification.subject, notification.content);
            //arr_desktop.push(user.email);

            if (user.isNotificationEmail === true)
                email([user.email], notification.subject, notification.content);
            //arr_email.push(user.email);

        });
    }
}


function send(receivers, notification, callback) {
    // var arr_email = [];
    // var arr_desktop = [];
    // var arr_sms = [];
    for (var i = 0; i < receivers.length; i++) {
        models.User.getUserByEmail(receivers[i], function (user) {
            if (user.isNotificationDesktop === true)
                desktop([user.email], notification.subject, notification.content);
            //arr_desktop.push(user.email);

            if (user.isNotificationEmail === true)
                email([user.email], notification.subject, notification.content);
            //arr_email.push(user.email);

        });
    }
    // if (arr_email.length > 0)
    //     email(arr_email, notification.subject, notification.content);
    // if (arr_desktop.length > 0)
    //     desktop(arr_desktop, notification.subject, notification.content);



}



module.exports = send;
