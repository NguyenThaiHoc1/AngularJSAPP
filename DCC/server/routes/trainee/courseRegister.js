var router = require('express').Router();
var models = require('../../models');
var log = require('../../config/logConfig');
var sequelize = require("sequelize");

router.get('/getTrainingProgram', function (req, res) {
    var query = { include: [models.Course] };
    models.TrainingProgram.findAll(query).then(function (trainingProgram) {
        var datasend = {
            success: true,
            msg: 'send list success',
            data: trainingProgram
        };
        res.send(datasend);
    });
});

router.get('/getOpeningClass', function (req, res) {
    var query = {
        where:
        {
            startTime:
            {
                $lt: Date.now()
            }
        },
        include: [models.Course]
    }
    models.Class.findAll(query).then(function (openingClass) {
        var datasend = {
            success: true,
            msg: 'Get Opening Class Success',
            openingClass: openingClass
        };
        res.send(datasend);
    });
});

router.post('/getRequestedOpeningCourse', function (req, res) {
    var userId = req.body.userId;
    models.RequestOpening.getRequestedOpeningCourse(userId, function (requestedOpeningCourse) {
        var datasend = {
            success: true,
            msg: 'Get Requested Opening Course Success',
            requestedOpeningCourse: requestedOpeningCourse
        };
        res.send(datasend);
    });
});

router.post('/sendRegisterRequest', function (req, res) {
    var courseId = req.body.courseId;
    var userId = req.body.userId;
    //If request is already existed, don't add request to request_course table
    //If not, add request to request_course table
    models.RequestOpening.findOne({ where: { userId: userId, courseId: courseId } }).then(function (requestOpening) {
        if (requestOpening) {
            var datasend = {
                success: false,
                msg: 'You Have Already Requested'
            };
            res.send(datasend);
        } else {
            models.Class.getOpeningClassByCourseID(courseId, function (openingClass) {
                //If class is opening, add user request to request_course table with requestType = "enroll"
                //If not, add user request to request_course table with requestType = "register"
                if (openingClass) {
                    models.RequestOpening.addRequestEnroll(userId, courseId, function () {
                        var datasend = {
                            success: true,
                            msg: 'Send Request Successfully'
                        };
                        res.send(datasend);
                    });
                } else {
                    models.RequestOpening.addRequestRegister(userId, courseId, function () {
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

router.post('/deleteRequestOpening', function (req, res) {
    var courseId = req.body.courseId;
    var userId = req.body.userId;
    models.RequestOpening.deleteRequestOpening(userId, courseId, function () {
        var datasend = {
            success: true,
            msg: 'Delete Request Opening Success'
        }
        res.send(datasend);
    });
});

router.post('/unEnrollCourse', function (req, res) {
    var classId = req.body.classId;
    var traineeId = req.body.traineeId;
    models.ClassRecord.unEnrollCourse(traineeId, classId, function () {
        var datasend = {
            success: true,
            msg: 'Un-enroll Course Success'
        }
        res.send(datasend);
    });
});


router.post('/getMyEnrolledClass', function (req, res) {
    var query = {
        include: [
            {
                model: models.Class,
                include: [models.Course]
            },
            {
                model: models.User,
                where: { email: req.body.userEmail }
            }
        ]
    };
    models.ClassRecord.findAll(query).then(function (classRecord) {
        var datasend = {
            success: true,
            msg: 'Get Class Record By User Email Success',
            classRecord: classRecord
        }
        res.send(datasend);
    });
});

module.exports = router;
