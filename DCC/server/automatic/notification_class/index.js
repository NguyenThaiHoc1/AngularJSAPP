var schedule = require('node-schedule');
var notification = require('../../notification');
var models = require('../../models')

var automatic = {
    job_sendnoti_ClassStart: function (date, classID, noti) {
        console.log('create job');
        var j = schedule.scheduleJob(date, function () {
            console.log('send noti classStart');
            models.Class.getUserInClass(classID, user => {
                var receivers = [];
                for (var i = 0; i < user.length; i++)
                    receivers.push(user[i].email);
                console.log(receivers);
                notification(receivers, noti);
            });

            j.cancel();
        });
    }
}
module.exports = automatic;