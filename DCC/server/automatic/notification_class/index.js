var schedule = require('node-schedule');
var notification = require('../../notification');
var models = require('../../models')

var automatic = {
    job_sendnoti_ClassStart: function (date, classID, noti) {
        var j = schedule.scheduleJob(date, function () {
            models.Class.getUserInClass(classID, user => {
                var receivers = [];
                for (var i = 0; i < user.length; i++)
                    receivers.push(user[i].email);
                if (receivers.length > 0)
                    notification(receivers, noti);
            });

            j.cancel();
        });
    }
}
module.exports = automatic;