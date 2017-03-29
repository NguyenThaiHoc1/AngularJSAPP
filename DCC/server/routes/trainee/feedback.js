var router = require('express').Router();
var models = require('../../models');
var log = require('../../config/config')["log"];

router.post ('/getMyFeedbackByClass', function(req, res){
    models.ClassRecord.getTraineeClassbyId(req.body.traineeId, req.body.classId, feedback => {
        if(!feedback){
            var datasend = {
                success: true,
                msg: 'There is no feedback of traineeId = ' + req.body.traineeId + ' for class with id = ' + req.body.classId,
                feedback: {
                    comments: 'No comments',
                    rating: '0',
                }
            };
            res.send(datasend);
        }
        else{
            var datasend2 = {
                success: true,
                msg:'Get feedback success',
                feedback: {
                    comments: feedback.comments,
                    rating: feedback.rating
                }
            };
            res.send(datasend2);
        }
    });
});

router.post ('/sendFeedback', function(req, res){
    // this function check if the user used comment for class
    models.ClassRecord.update({
        comments: req.body.comments,
        rating: req.body.rating
    }, {
        where: {
            traineeId: req.body.traineeId,
            classId: req.body.classId
        }
    }).then(function() {
        res.send({
            success: true,
            msg: 'update Feedback success!'
        });
    });
});

module.exports = router;
