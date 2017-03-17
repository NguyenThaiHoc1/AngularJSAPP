var router = require('express').Router();
var models = require('../../models');

router.post('/getNotifications', function(req, res) {
    models.Notifications.getAllNotificationByEmail(req.body.email, notifications => {
        res.send({
            data: notifications,
            success: true,
            msg: 'got ' + notifications.length + ' notifications'
        });        
    });
});

router.post('/getNewNotifications', function(req, res) {
    models.Notifications.getNewNotificationByEmail(req.body.email, notifications => {
        res.send({
            data: notifications,
            success: true,
            msg: 'got ' + notifications.length + ' notifications'
        });
    });
});

module.exports = router;
