var router = require('express').Router();
var models = require('../../models');
var log = require('../../config/config')["log"];
var notification = require('../../notification');
var Job = require('../../automatic');
// add course to database
router.post('/addCourse', function (req, res) {
    models.Course.sync({
        force: false
    }).then(function () {
        // this function check if the courseName is already existed
        models.Course.getByName(req.body.name, function (result) {
            if (result) {
                res.send({
                    success: false,
                    msg: 'Name already existed. Add fail!'
                });
            } else {
                models.Course.add(
                    req.body.name,
                    req.body.description,
                    req.body.duration,
                    req.body.test,
                    req.body.documents,
                    req.body.trainingProgramId,
                    function () {
                        res.send({
                            success: true,
                            msg: "Add Course Success"
                        });
                    });
            }
        });
    });
});

// update course in database
router.post('/updateCourse', function (req, res) {
    models.Course.sync({
        force: false
    }).then(function () {
        models.Course.getByName(req.body.name, function (result) {
            if (result) {
                res.send({
                    success: false,
                    msg: 'Name already existed. Update failed!'
                });
            } else {
                models.Course.edit(
                    req.body.id,
                    req.body.name,
                    req.body.description,
                    req.body.duration,
                    req.body.test,
                    req.body.documents,
                    req.body.trainingProgramId,
                    function () {
                        res.send({
                            success: true,
                            msg: 'Edit course success!'
                        });
                    });
            }
        });
    });
});

// destroy Course
router.post('/deleteCourse', function (req, res) {
    models.Class.deleteClassByCourseID(req.body.id, function () {
        models.Course.deleteCourseByID(req.body.id, function () {
            res.send({
                success: true,
                msg: 'Delete Course success'
            });
        });
    })
});

//getCourseTypeList
router.get('/getCourseTypeList', function (req, res) {
    models.CourseType.getAll(courseTypes => {
        var datasend = {
            success: true,
            msg: 'send list success',
            courseType: courseTypes
        };
        res.send(datasend);
    });
});

router.get('/getTrainingProgramList', function (req, res) {

    var query =
        {
            include: [
                {
                    model: models.CourseType,
                },
                {
                    model: models.Course,
                    include: [
                        {
                            model: models.Class,
                            include: [
                                {
                                    model: models.ClassRecord,
                                }
                            ]
                        }
                    ]
                }
            ]
        };
    models.TrainingProgram.findAll(query).then(function (trainingProgram) {
        var datasend = {
            success: true,
            msg: 'send list success',
            trainingProgram: trainingProgram
        };
        res.send(datasend);
    });
});

//Add Training programs
router.post('/addTrainingProgram', function (req, res) {
    log.info('/admin/courses/addTrainingProgram: Add Training Program :' + req.body.name);
    // this function check if the courseName is already existed
    models.TrainingProgram.getTrainingByName(req.body.name, function (result) {
        if (result) {
            res.send({
                success: false,
                msg: 'Name already existed. Add fail!'
            });
        } else {
            models.TrainingProgram.add(
                req.body.name,
                req.body.description,
                req.body.courseTypeId.id,
                function () {
                    res.send({
                        success: true,
                        msg: "Add Training Program Success"
                    });
                });
        }
    });

});

//Updtae Training Program
router.post('/updateTrainingProgram', function (req, res) {
    log.info('/admin/updateTrainingProgram: Update Training Program :' + req.body.name);
    models.TrainingProgram.getTrainingByName(req.body.name, function (result) {
        if (result) {
            res.send({
                success: false,
                msg: 'Name already existed. Updating Training Program Failed!'
            });
        } else {
            models.TrainingProgram.edit(
                req.body.id,
                req.body.name,
                req.body.description,
                req.body.courseTypeId.id,
                cb => {
                    res.send({
                        success: true,
                        msg: "Updating Training Program Successes"
                    });
                });
        }
    });
});

//delete Training Program
router.post('/deleteTrainingProgram', function (req, res) {
    log.info('Get Delete Command');
    models.Course.deleteCourseByTPID(req.body.id, function () {
        models.TrainingProgram.deleteTrainingProgramByID(req.body.id, function () {
            res.send({
                success: true,
                msg: 'Delete Course success'
            });
        });
    })
});

//Get Class
router.post('/getClass', function (req, res) {

    var query =
        {
            include: [
                {
                    model: models.Course
                }
            ],
            where: {
                courseId: req.body.courseId
            }
        };
    models.Class.findAll(query).then(function (Class) {
        var datasend = {
            success: true,
            msg: 'send list success',
            Class: Class
        };
        res.send(datasend);
    });
});



router.post('/addClass', function (req, res) {
    var dataSend = {};
    models.Class.getOpeningClassByCourseID(req.body.courseId,
        function (result) {
            if (result) {
                dataSend = {
                    success: false,
                    msg: "Class is already opening!"
                }
            }
            else {
                var courseName;
                models.Class.add(
                    req.body.courseId,
                    req.body.location,
                    // trainerId: req.body.trainerId.id,
                    req.body.startTime,
                    req.body.endTime,
                    req.body.maxAttendant,
                    cb => {
                        models.Course.getByID(
                            req.body.courseId,
                            function (course) {
                                var date = new Date(req.body.startTime);
                                date.setDate(date.getDate() - 1);
                                courseName = course.name;
                                var noti = {
                                    subject: course.name,
                                    content: "Your " + req.body.courseId + " class has been openned and scheduled to start tomorrow at location: " + req.body.location + ". Please be on time, thank you.",
                                    link: 'courseDetail/' + course.name
                                };
                                Job.job_sendnoti_ClassStart(date, cb.id, noti);

                                models.RequestOpening.getByCourseID(req.body.courseId, function (reqOpns) {
                                    reqOpns.forEach(reqOpn => {
                                        var receivers = [];
                                        models.User.getByUserID(reqOpn.userId,
                                            function (dataResults) {
                                                if (dataResults.email)
                                                    receivers.push(dataResults.email);
                                            }).then(function () {
                                                var noti = {
                                                    subject: courseName,
                                                    content: "A new " + courseName + "'s class has been opened",
                                                    link: 'trainee_dashboard/requestCourse'
                                                }
                                                notification(receivers, noti);
                                            });
                                    })

                                });

                            });

                    });
                //.then(function (ClassDetail) {
                dataSend = {
                    success: true,
                    msg: "Add class successfully",
                }

                // });
            }
            res.send(dataSend);
        })
});

//Update Class
router.post('/updateClass', function (req, res) {
    log.info('/admin/updateClass: update Class :' + req.body.id);
    //  need add trainee to class record
    models.Class.sync({
        force: false
    }).then(function () {
        models.Class.edit(
            req.body.id,
            req.body.location,
            // trainerId: req.body.trainerId,
            req.body.startTime,
            req.body.endTime,
            req.body.maxAttendant,
            function () {
                res.send({
                    success: true,
                    msg: 'Edit Class Info success!'
                });
            });
    });
});

// Delete Class
router.post('/deleteClass', function (req, res) {
    log.info('Get Delete Command');
    models.Class.getOpeningClassByID(
        req.body.id,
        cb => {
            if (cb && cb != null) {
                var TraineeList = [];
                req.body.traineeList.forEach(trainee => {
                    TraineeList.push(trainee.traineeMail);
                });
                var noti = {
                    subject: 'Class canceled',
                    content: 'The ' + req.body.courseName + "'s class has been canceled",
                    link: 'trainee_courseRegister/CourseRegister'
                };
                notification(TraineeList, noti);
                models.Class.deleteClassByID(
                    req.body.id,
                    function () {
                        res.send({
                            success: true,
                            msg: 'Delete Class success'
                        });
                    });
            } else {
                models.Class.deleteClassByID(
                    req.body.id,
                    function () {
                        res.send({
                            success: true,
                            msg: 'Delete Class success'
                        });
                    });
            }
        });

});


router.get('/getAllCourse', function (req, res) {
    models.Course.getAll(data => {
        var datasend = {
            success: true,
            msg: "get all courses done",
            data: data
        };
        res.send(datasend);
    });
});

router.get('/getAllTP', function (req, res) {
    models.TrainingProgram.getAll(data => {
        var datasend = {
            success: true,
            msg: "get all training programs done",
            data: data
        };
        res.send(datasend);
    });
});

module.exports = router;
