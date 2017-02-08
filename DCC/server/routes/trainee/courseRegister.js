var router = require('express').Router();
var models = require('../../models');
var log = require('../../../config/logConfig');
var sequelize = require("sequelize");

router.get('/getTrainingProgram', function(req, res){
    var query = { include: [ models.Course ]};
    models.TrainingProgram.findAll(query).then(function(trainingProgram) {
        var datasend = {
            success: true,
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
            success: true,
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
            success: true,
            msg: 'Get Requested Opening Course Success',
            requestedOpeningCourse: requestedOpeningCourse
        };
        res.send(datasend);
    });
});

router.post('/sendRegisterRequest', function(req, res){
    var courseId = req.body.courseId;
    var userEmail = req.body.userEmail;
    //If request is already existed, don't add request to request_course table
    //If not, add request to request_course table
    models.RequestOpening.findOne({where:{userEmail:userEmail,courseId:courseId}}).then(function(requestOpening){
        if(requestOpening){
            var datasend = {
                success: false,
                msg: 'You Have Already Requested'
            };
            res.send(datasend);
        }else{
            models.Class.getOpeningClassByCourseID(courseId, function(openingClass){
                //If class is opening, add user request to request_course table with requestType = "join"
                //If not, add user request to request_course table with requestType = "register"
                if(openingClass){
                    models.RequestOpening.addRequestJoin(userEmail, courseId, function(){
                        var datasend = {
                            success: true,
                            msg: 'Send Request Successfully'
                        };
                        res.send(datasend);
                    });
                }else{
                    models.RequestOpening.addRequestRegister(userEmail, courseId, function(){
                        var datasend = {
                            success: true,
                            msg: 'Send Request Successfully'
                        };
                        res.send(datasend);
                    });
                }
            });
        }
    });
});

router.post('/deleteRequestOpening', function(req, res){
    var courseId = req.body.courseId;
    var userEmail = req.body.userEmail;
    models.RequestOpening.deleteRequestOpening(userEmail, courseId, function(){
        var datasend = {
            success: true,
            msg: 'Delete Request Opening Success'
        }
        res.send(datasend);
    });
});

router.post('/unEnrollCourse', function(req, res){
    var classId = req.body.classId;
    var traineeEmail = req.body.traineeEmail;
    models.ClassRecord.unEnrollCourse(traineeEmail, classId, function(){
        var datasend = {
            success: true,
            msg: 'Un-enroll Course Success'
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
            success: true,
            msg: 'Get Class Record By User Email Success',
            classRecord: classRecord
        }
        res.send(datasend);
    });
});

module.exports = router;
