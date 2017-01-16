var models = require("../models");
var express = require('express');
var router = express.Router();
var log = require('../../config/logConfig');

models.Feedback.sync({
    force: false
});
router.post('/comment', function(req, res) {
    log.info('/route/comment : comment for course that its id is ' + req.body.classId);

    var queryFeedback = {
        where: {
            userId: req.body.userId,
            classId: req.body.classId
        }
    };

    models.Feedback.findOne(queryFeedback).then(function(feedback) {
        if (feedback === null) {
            models.Feedback.create({
                userId: req.body.userId,
                comment: req.body.comment,
                classId: req.body.classId,
            }).then(function() {
                res.send({
                    msg: 'create successfully'
                });
            });
        } else {
            models.Feedback.update({
                comment: req.body.comment,
            }, {
                where: {
                    userId: req.body.userId,
                    classId: req.body.classId
                }
            }).then(function() {
                res.send({
                    msg: 'update successfully'
                });
            });
        }
    })
});

router.post('/rating', function(req, res) {
    log.info('/route/feedback : rating for course that its id is ' + req.body.classId);
    var queryFeedback = {
        where: {
            userId: req.body.userId,
            classId: req.body.classId
        }
    };
    models.Feedback.findOne(queryFeedback).then(function(feedback) {
        if (feedback === null) {
            models.Feedback.create({
                userId: req.body.userId,
                classId: req.body.classId,
                rating: req.body.rating

            }).then(function() {
                res.send({
                    msg: 'create successfully'
                });
            });
        } else {
            models.Feedback.update({
                rating: req.body.rating
            }, {
                where: {
                    userId: req.body.userId,
                    classId: req.body.classId,
                }
            }).then(function() {
                res.send({
                    msg: 'update successfully'
                });
            });
        }
    })
});

router.post('/getClassFeedbacks', function(req, res) {
    log.info('/route/getClassFeedbacks : show all feedbacks for class that its id is ' + req.body.classId);
    models.Feedback.getFeedbackByClassID(req.body.classId, function(feedback) {
        res.send(feedback);
    })
});

router.post('/get1Feedback', function(req, res) {
    log.info('/route/get1Feedback : get a feedback of a course belongs to a user ');
    models.Feedback.findOne({
        where: {
            userId: req.body.userId,
            classId: req.body.classId
        }
    }).then(function(feedback) {
        res.send(feedback);
    })
});

router.post('/getAverageRating',function(req,res){
    log.info('/route feedback : show average rating for a course');
    models.Feedback.findAll({
        where:{
            classId : req.body.classId
        }
    }).then(function(feedback){
        var sumRating = 0;
        for( var i = 0; i < feedback.length; i++){
            sumRating = sumRating + feedback[i].dataValues.rating;
        }
        var avg = sumRating/feedback.length;
        res.send({result:avg.toString()});
    })
})

module.exports = router;
