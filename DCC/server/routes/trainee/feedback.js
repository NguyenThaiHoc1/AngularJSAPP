var router = require('express').Router();
var models = require('../../models');
var log = require('../../../config/logConfig');

router.post ('/getMyFeedbackByClass', function(req, res){
    var query = {
        where: {
            userEmail: req.user.email,
            classId: req.body.classId
        }
    };
    models.ClassRecord.findOne(query).then(function(feedback) {
        if(!feedback){
            models.Feedback.create({
                comments: '',
                rating: '',
                userEmail: req.user.email,
                classId: req.body.classId

            }).then(function() {
                var datasend = {
                    success: true,
                    msg:'for test: create done',
                    feedback: {
                        comments: 'test',
                        rating: '5',
                        userEmail: req.user.email,
                        classId: req.body.classId
                    }
                };
                res.send(datasend);
            });
        }
        else{
            var datasend = {
                success: true,
                msg:'give feedback success',
                feedback: feedback
            };
            res.send(datasend);
        }
    });
});

router.post ('/sendFeedback', function(req, res){
    // this function check if the user used comment for class
    models.Feedback.getFeedbackByClassIDByUserID(req.body.classId, req.body.userEmail, function(feedback){
        models.Feedback.update({
            comments: req.body.comments,
            rating: req.body.rating
        }, {
            where: {
                userEmail: req.user.email,
                classId: req.body.classId
            }
        }).then(function() {
            res.send({
                feedback:feedback,
                success: true,
                msg: 'update Feedback success!'
            });
        });

    });
});

module.exports = router;
