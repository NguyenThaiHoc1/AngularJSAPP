var router = require('express').Router();
var models = require('../../models');
var config = require('../../config/config.json');
var noti = require('../../noti');

router.post('/noti_email', function (req, res) {
    var subject = req.body.subject;
    var content = req.body.content;
    var listOfReceiver = req.body.listOfReceiver;
    noti.email(listOfReceiver, subject, content);
    var datasend = {
        success: true,
        msg: 'sent email successfully'
    };
    res.send(datasend);
});

module.exports = router;