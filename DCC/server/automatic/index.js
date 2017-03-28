var noti_class = require('./notification_class')
var jobSendMail = require('./job_send_email')
module.exports = {
    job_sendNoti: function (date, receivers, noti) {
        var j = schedule.scheduleJob(date, function () {
            notification(receivers, noti);

            j.cancel();
        });
    },
    job_sendnoti_ClassStart: noti_class.job_sendnoti_ClassStart,
    job_sendEmail: {
        createJobSendEmail: jobSendMail.createJobSendEmail,
        updateJobs: jobSendMail.updateJobs,
    },
}
