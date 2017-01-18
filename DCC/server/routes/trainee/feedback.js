var router = require('express').Router();
var models = require('../../models');
var log = require('../../../config/logConfig');

router.get ('/getFeedback', function(req, res){
    var query = {
        where: {
            userEmail: req.user.email,
            classId: req.body.classId
        }
        // include:[
        //     {
        //         model: models.Class,
        //         include: [
        //             {
        //                 model: models.Course,
        //                 where: {id: }
        //             }
        //         ]
        //     }
        // ]
    };
    models.Feedback.findAll(query).then(function(feedback) {
        var datasend = {
            msg:'send feedback success',
            data: feedback
        };
        res.send(datasend);
    });
});

router.post ('/giveFeedback', function(req, res){
    models.Course.sync({
        force: false
    }).then(function() {
        // this function check if the courseName is already existed
        models.Feedback.findAll(req.body.name, function(result) {
            if (result) {
                res.send({
                    success: false,
                    msg: 'Name already existed. Add fail!'
                });
            } else {
                models.Course.create({
                    name: req.body.name,
                    description: req.body.description,
                    duration: req.body.duration,
                    test: req.body.test,
                    documents: req.body.documents,
                    isDeleted:  0,
                    courseTypeId: req.body.courseTypeId.id,
                    trainingProgramId: req.body.trainingProgramId.id,
                    imgLink: '/img/courses/training-icon-1.svg',
                }).then(function() {
                    res.send({
                        success: true,
                        msg: "Add Course Success"
                    });
                });
            }
        });
    });
});

module.exports = router;
