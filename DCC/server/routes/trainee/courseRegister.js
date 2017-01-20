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
    console.log(userEmail);
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
    console.log(userEmail);
    console.log(courseId);
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

router.get('/createTest', function(req, res){
    models.TrainingProgram.bulkCreate([
        {id: '7', name: 'General Orientation test', description: 'description of trainning program 1 ', imgLink: '/img/courses/training-icon-1.svg'},
        {id: '8', name: 'Linux Programming test', description: 'Description of Linux Programming ', imgLink: '/img/courses/training-icon-2.svg'}
    ])
    .then(function(){
        
    });
    // models.Course.bulkCreate([
    //     {id: '50', name: 'General Orientation test', description: 'description of trainning program 1 ', imgLink: '/img/courses/training-icon-1.svg', trainingProgramId: '7'},
    //     {id: '51', name: 'Linux Programming test', description: 'Description of Linux Programming ', imgLink: '/img/courses/training-icon-2.svg', trainingProgramId: '8'},
    //     {id: '52', name: 'Course for test', description: 'Description of test Programming ', imgLink: '/img/courses/training-icon-2.svg', trainingProgramId: '8'}
    // ]);
    // models.Class.bulkCreate([
    //     {id: '50', courseId: '50', startTime: '2017-02-28 00:00:00'},
    //     {id: '51', courseId: '51', startTime: '2017-01-15 00:00:00'}
    // ]);
    // models.ClassRecord.bulkCreate([
    //     {id: '50', classId: '50', status: 'Learned', traineeEmail: 'qwe@gmail.com'},
    //     {id: '51', classId: '51', status: 'Learned', traineeEmail: 'qwe@gmail.com'}
    // ]);
    // models.RequestOpening.create(
    //     {id: '50', courseId: '52', requestType: 'Join', userEmail: 'qwe@gmail.com'}
    // );


});

router.get('/destroyTest', function(req, res){
    models.TrainingProgram.destroy({where: {id: [7, 8]}});
    models.Course.destroy({where: {id: [50, 51, 52]}});
    models.Class.destroy({where: {id: [50, 51]}});
    models.ClassRecord.destroy({where: {id: [50, 51]}});
    models.RequestOpening.destroy({where: {id: [50]}});
});

module.exports = router;
