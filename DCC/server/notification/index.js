var email = require('./email');
var desktop = require('./desktop');
var models = require('../models');

function send(receivers, subject, content, link) {
    models.User.getAllUsers(listUser => {
        var arr_desktop = [];
        hashTable = new Object();
        for (i = 0; i < listUser.length; i++) {
            hashTable[listUser[i].email] = {
                isNotificationEmail: listUser[i].isNotificationEmail,
                isNotificationDesktop: listUser[i].isNotificationDesktop
            }
        }

        for (i = 0; i < receivers.length; i++) {
            if (hashTable[receivers[i]] && hashTable[receivers[i]].isNotificationDesktop === true) {
                arr_desktop.push(receivers[i]);
            }
            models.Notifications.create({
                email: receivers[i],
                title: subject,
                content: content,
                time: new Date(),
                status: 1,
                reference: link
            });
        }



        if (arr_desktop.length > 0)
            desktop(arr_desktop, subject, content, link);

    });

}



module.exports = send;
