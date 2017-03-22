var schedule = require('node-schedule');
var notification = require('../../notification');
var automatic = {
    start_class: function (hour, minute, Before_day) {

        var Job = schedule.scheduleJob({ hour: hour, minute: minute }, function () {
            console.log('send email');
            var noti = {
                subject: 'test automatic',
                content: 'hi im heo u'
            }
            notification(['1351010018danh@ou.edu.vn'], noti);
        });
    }
}
module.exports = automatic;