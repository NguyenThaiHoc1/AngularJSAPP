var router = require('express').Router();
var models = require('../../models');

router.post('/getNotifications', function (req, res) {
    models.Notifications.getAllNotificationByEmail(req.body.email, notifications => {
        res.send({
            data: notifications,
            msg: 'got ' + notifications.length + ' notifications'
        });
    });
});

router.post('/getNumberofNewNotification', function (req, res) {
    models.Notifications.getNumberofNewNotification(req.body.email, notifications => {
        res.send({
            data: notifications.count,
            success: true,
            msg: 'got ' + notifications.count + ' new notifications'
        });
    });
});

router.post('/updateNotificationStatus', function(req, res) {
    models.Notifications.update(
        {
            status: 0
        },
        {
            where: {
                email: req.body.email,
                status: 1,
                id: req.body.id
            }
        }
    ).then(function() {
        res.send({
            msg: "Status updated",
        });
    });
});

router.post('/getAllNewNotificationsAndUpdateStatus', function(req, res) {
    models.Notifications.getAllNewNotifications(req.body.email, notifications => {
        models.Notifications.update(
            {
                status: 0
            },
            {
                where: {
                    email: req.body.email,
                    status: 1,
                }
            }
        ).then(function() {
            res.send({
                data: notifications,
                msg: "All status updated"
            });
        });
    });
});

module.exports = router;
