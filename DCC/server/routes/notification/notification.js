var router = require('express').Router();
var models = require('../../models');

router.post('/getNotifications', function (req, res) {
    models.Notifications.getAllNotificationByEmail(req.body.email, notifications => {
        res.send({
            data: notifications,
            success: true,
            msg: 'got ' + notifications.length + ' notifications'
        });
    });
    models.Notifications.update(
        {
            status: 0
        },
        {
            where: {
                email: req.body.email,
                status: 1
            }
        }
    );

});

router.post('/getNumberofNewNotification', function (req, res) {
    models.Notifications.getNumberofNewNotification(req.body.email, notifications => {
        res.send({
            data: notifications.count,
            success: true,
            msg: 'got ' + notifications.length + ' new notifications'
        });
    });
});

module.exports = router;
