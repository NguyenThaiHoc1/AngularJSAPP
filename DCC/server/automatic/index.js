var noti_class = require('./notification_class')

module.exports = {
    job_sendNoti: function (date, receivers, noti) {
        var j = schedule.scheduleJob(date, function () {
            console.log('send noti');
            notification(receivers, noti);

            j.cancel();
        });
    },
    job_sendnoti_ClassStart: noti_class.job_sendnoti_ClassStart,
}
