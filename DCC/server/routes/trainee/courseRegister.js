var router = require('express').Router();
var models = require('../../models');
var log = require('../../config/config')["log"];
var sequelize = require("sequelize");

router.get('/getTrainingProgram', function (req, res) {
    var query = { include: [models.Course] };
    models.TrainingProgram.getNestedTPBy(query, function (trainingProgram) {
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
                $gt: Date.now()
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

router.post('/getByUserID', function (req, res) {
    var userId = req.body.userId;
    models.RequestOpening.getByUserID(userId, function (requestedOpeningCourse) {
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
    models.RequestOpening.findRequestOpenningCourse(userId, courseId, requestOpening => {
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
                    models.ClassRecord.findTraineeEnrolledClass(userId, openingClass.id, result => {
                        if (result) {
                            var datasend = {
                                success: false,
                                msg: 'You Have Already Enrolled'
                            };
                            res.send(datasend);
                        }
                        else {
                            models.ClassRecord.enrollCourse(userId, openingClass.id, function () {
                                var datasend = {
                                    success: true,
                                    msg: 'Enroll Successfully'
                                };
                                res.send(datasend);
                            });
                        }
                    })
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
                where: { email: req.body.email }
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




router.post('/updateClassRecordStatus', function (req, res) {
    // this function check if the user used comment for class
    models.ClassRecord.update({
        status: 'Learned'
    }, {
            where: {
                traineeId: req.body.traineeId,
                classId: req.body.classId
            }
        }).then(function () {
            res.send({
                success: true,
                msg: 'update status success!'
            });
        });
});

router.post('/getCoursebyName', function (req, res) {
    models.Course.getByName(req.body.name, function (result) {
        res.send({
            course: result
        })
    });
});



module.exports = router;
