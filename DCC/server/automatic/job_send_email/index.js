
var schedule = require('node-schedule');
var sendEmail = require('../../notification/email');
var models = require('../../models');
var Jobs;
var os = require('os');
var settings = require('../../../settings.js');

var sendNewNotificationToEmail = function (email, EmailPeriod) {
    models.Notifications.getAllNewNotifications(email, notifications => {
        if (notifications.length > 0) {
            models.Notifications.update(
                {
                    status: 0
                },
                {
                    where: {
                        email: email,
                        status: {$ne: 0},
                    }
                }
            );
            var noti = {
                subject: '[DEK] In this ' + EmailPeriod + 'new notifications ',
                content: '[DEK] In this ' + EmailPeriod + 'new notifications ' + os.EOL
            }
            for (var i = 0; i < notifications.length; i++) {
                noti.content += (i + 1) + '. ' + notifications[i].content + os.EOL;
            }
            noti.content += 'Regards,';
            sendEmail([email], noti.subject, noti.content);
        }
    });
}
var sortJobByEmail = function () {
    Jobs.sort(function (prev, next) {
        var upper_prev = prev.email.toUpperCase();
        var upper_next = next.email.toUpperCase();
        return upper_prev < upper_next ? -1 :
            upper_prev > upper_next ? 1 : 0;
    });
}
function binarySearch(email) {
    email = email.toUpperCase();
    var mid, first, last;
    first = 0;
    last = Jobs.length - 1;
    while (first <= last) {
        mid = Math.floor((last + first) / 2);
        if (email === Jobs[mid].email)
            return mid;
        if (email > Jobs[mid].email)
            first = mid + 1;
        if (email < Jobs[mid].email)
            last = mid - 1;
    }
    return - 1;
}
function insertItem(item) {
    var i = 0;
    while (Jobs[i].email < item.email)
        i++;
    Jobs.splice(i, 0, item);
}

function createRule(date, EmailPeriod) {
    var rule = new schedule.RecurrenceRule();
    var EmailTime = settings.NotificationEmailTime.split(':');
    rule.hour = parseInt(EmailTime[0]);
    rule.minute = parseInt(EmailTime[1]);
    switch (EmailPeriod) {
        case 'Daily':
            break;
        case 'Weekly':
            rule.dayOfWeek = [date.getDay()];
            break;
        case 'Monthly':
            rule.date = date.getDate();
            break;
        default:
    }
    return rule;
}
var automatic = {
    createJobSendEmail: function () {
        Jobs = [];
        models.User.getEmailUsers(users => {
            for (var i = 0; i < users.length; i++) {
                var date = new Date(users[i].TimeOption);
                var rule = createRule(date, users[i].EmailPeriod);
                var j = schedule.scheduleJob(rule, function () {
                    sendNewNotificationToEmail(users[i].email, users[i].EmailPeriod);
                });
                var item = {
                    email: users[i].email.toUpperCase(),
                    job: j,
                    EmailPeriod: users[i].EmailPeriod
                }
                Jobs.push(item);
            }
        });
    },
    updateJobs: function (email) {
        var index = binarySearch(email);
        if (index !== -1) {
            models.User.getUserByEmail(email, user => {
                if (user.isNotificationEmail === 0) {
                    Jobs[index].job.cancel();
                    Jobs.splice(index, 1);
                } else {
                    var date = new Date(user.TimeOption);
                    var rule = createRule(date, user.EmailPeriod);

                    Jobs[index].job.cancel();
                    Jobs[index].job = schedule.scheduleJob(rule, function () {
                        sendNewNotificationToEmail(user.email, user.EmailPeriod);
                    });
                }
            });
        } else {
            models.User.getUserByEmail(email, user => {
                if (user.isNotificationEmail === 1) {
                    var date = new Date(user.TimeOption);
                    var rule = createRule(date, user.EmailPeriod);
                    var j = schedule.scheduleJob(rule, function () {
                        sendNewNotificationToEmail(user.email, user.EmailPeriod);
                    });
                    var item = {
                        email: user.email.toUpperCase(),
                        job: j,
                        EmailPeriod: user.EmailPeriod
                    }
                    insertItem(item);

                }
            });
        }
    },


}
module.exports = automatic;