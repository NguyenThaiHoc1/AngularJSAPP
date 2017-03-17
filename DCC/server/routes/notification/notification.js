var router = require('express').Router();
var models = require('../../models');

router.post('/getNotifications', function(req, res) {
    models.Notifications.getAllNotificationByEmail(req.body.email, function(notifications) {
        res.send({
            data: notifications,
            success: true,
            msg: 'get ' + notifications.length + 'notifications'
        });        
    });
});

module.exports = router;
