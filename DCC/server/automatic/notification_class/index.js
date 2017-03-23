var schedule = require('node-schedule');
var notification = require('../../notification');

var automatic = {
    job_sendnoti: function (date, receivers, noti) {

        var j = schedule.scheduleJob(date, function () {
            console.log('send noti');
            notification(receivers, noti);
        });
    }
}
module.exports = automatic;