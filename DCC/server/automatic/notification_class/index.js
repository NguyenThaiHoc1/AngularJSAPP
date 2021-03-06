var schedule = require('node-schedule');
var notification = require('../../notification');
var models = require('../../models')

var automatic = {
    job_sendnoti_ClassStart: function (date, classID, subject, content, link) {
        var j = schedule.scheduleJob(date, function (_subject, _content, _link) {
            models.Class.getUserInClass(classID, user => {
                var receivers = [];
                for (var i = 0; i < user.length; i++)
                    receivers.push(user[i].email);
                if (receivers.length > 0)
                    notification(receivers, _subject, _content, _link);
            });

            j.cancel();
        }.bind(null, subject, content, link));
    }
}
module.exports = automatic;