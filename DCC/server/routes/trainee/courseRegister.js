var router = require('express').Router();
var models = require('../../models');
var log = require('../../../config/logConfig');

router.get('/getTrainingProgram', function(req, res){
    var query = { include: [ models.Course ]};
    models.TrainingProgram.findAll(query).then(
        function(trainingProgram) {
            var datasend = {
                msg:'send list success',
                data: trainingProgram
            };
            res.send(datasend);
        });
    });

    router.get('/getOpeningClass', function(req, res){
        var query = {
            where:
            {
                startTime:
                {
                    $gt: Date.now()
                }
            },
            include: [ models.Course ]
        }
        models.Class.findAll(query).then(function(openingClass){
            var datasend = {
                msg:'Get Opening Class Success',
                openingClass: openingClass
            };
            res.send(datasend);
        });
    });

    router.post('/getRequestedOpeningCourse', function(req, res){
        var userEmail = req.body.userEmail;
        models.RequestOpening.getRequestedOpeningCourse(userEmail, function(requestedOpeningCourse){
            var datasend = {
                msg: 'Get Requested Opening Course Success',
                requestedOpeningCourse: requestedOpeningCourse
            };
            res.send(datasend);
        });
    });

    router.post('/requestOpening', function(req, res){
        var courseId = req.body.courseId;
        var userEmail = req.body.userEmail;
        models.Class.getOpeningClassByCourseID(courseId,
            function(openingClass){
                if(!openingClass){
                    models.RequestOpening.addRequestOpeningCourse(userEmail,courseId);
                    var datasend = {
                        msg:'send request opening success'
                    };
                    res.send(datasend);
                }
                else{
                    //dua userid, classid vao class record
                    models.ClassRecord.addTraineeToClass(userEmail,openingClass.id);
                    var datasend = {
                        msg:'send register course success'
                    };
                    res.send(datasend);
                }
            }
        )
    });

    router.post('/deleteRequestOpening', function(req, res){
        var courseId = req.body.courseId;
        var userEmail = req.body.userEmail;
        models.RequestOpening.deleteRequestOpening(userEmail,courseId, function(){
            var datasend = {
                success: true,
                msg: 'Delete Request Opening Success'
            }
            res.send(datasend);
        });
    });

    router.post('/getMyEnrolledClass', function(req, res){
        var query = {
            where:
            {
                traineeEmail: req.body.userEmail
            },
            include: [
                {
                    model: models.Class,
                    include: [models.Course]
                }
            ]
        }
        models.ClassRecord.findAll(query).then(function(classRecord){
            var datasend = {
                msg: 'Get Class Record By User Email Success',
                classRecord: classRecord
            }
            res.send(datasend);
        });
    });


    module.exports = router;
