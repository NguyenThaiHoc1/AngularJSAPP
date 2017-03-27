var email = require('./email');
var desktop = require('./desktop');
var models = require('../models');

function send(receivers, notification, callback) {
    models.User.getAllUsers(listUser => {
        var arr_email = [];
        var arr_desktop = [];
        hashTable = new Object();
        for (i = 0; i < listUser.length; i++) {
            hashTable[listUser[i].email] = {
                isNotificationEmail: listUser[i].isNotificationEmail,
                isNotificationDesktop: listUser[i].isNotificationDesktop
            }
        }

        for (i = 0; i < receivers.length; i++) {
            if (hashTable[receivers[i]].isNotificationEmail === true) {
                arr_email.push(receivers[i]);
            }
            if (hashTable[receivers[i]].isNotificationDesktop === true) {
                arr_desktop.push(receivers[i]);
            }
        }
        if (arr_desktop.length > 0)
            desktop(arr_desktop, notification.subject, notification.content);
        if (arr_email.length > 0)
            email(arr_email, notification.subject, notification.content);
    });

}



module.exports = send;
