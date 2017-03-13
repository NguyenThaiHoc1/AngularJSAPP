var router = require('express').Router();
var noti = require('../../noti');

router.post('/noti_email', function (req, res) {
    var subject = req.body.subject;
    var content = req.body.content;
    var listOfReceiver = req.body.listOfReceiver;
    console.log(req.body);
    console.log(listOfReceiver);
    noti.email(listOfReceiver, subject, content, function (error, info) {
        datasend = {
            success: true,
            msg: 'sent email successfully'
        };
        res.send(datasend);
    });
});

module.exports = router;