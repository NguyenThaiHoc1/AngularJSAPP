var router = require('express').Router();
var models = require('../../models');
var log = require('../../../config/logConfig');

// add course to database
router.post('/addCourse', function(req, res) {
    log.info('/admin/courses/addCourse: Add course :' + req.body.name);
    models.Course.sync({
        force: false
    }).then(function() {
        // this function check if the courseName is already existed
        models.Course.getByName(req.body.name, function(result) {
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
                    trainingProgramId: req.body.trainingProgramId,
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

// update course in database
router.post('/updateCourse', function(req, res) {
    log.info('/admin/updateCourse: Add course :' + req.body.name);
    models.Course.sync({
        force: false
    }).then(function() {
        models.Course.update({
            name: req.body.name,
            description: req.body.description,
            duration: req.body.duration,
            test: req.body.test,
            documents: req.body.documents,

            trainingProgramId: req.body.trainingProgramId,
            imgLink: '/img/courses/training-icon-1.svg',
        }, {
            where: {
                id: req.body.id
            }
        }).then(function() {
            res.send({
                success: true,
                msg: 'Edit course success!'
            });
        });
    });
});

// destroy Course
router.post('/deleteCourse', function(req, res) {
    log.info('Get Delete Command');
    models.Course.destroy({
        where:{
            id: req.body.id
        }
    });
    res.send({
        success: true,
        msg: 'Delete Course success'
    });
});

//getCourseTypeList
router.get('/getCourseTypeList', function(req, res) {
    log.info('/admin/getCourseTypeList: get course type list data');
    var query = { include: [ models.TrainingProgram ]};
    models.CourseType.findAll(query).then(function(courseType) {
        var datasend = {
            success: true,
            msg:'send list success',
            courseType: courseType
        };
        res.send(datasend);
    });
});

router.get('/getTrainingProgramList', function(req, res){

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
    models.TrainingProgram.findAll(query).then(function(trainingProgram) {
        var datasend = {
            success : true,
            msg:'send list success',
            trainingProgram: trainingProgram
        };
        res.send(datasend);
    });
});

//Add Training programs
router.post('/addTrainingProgram', function(req, res) {
    log.info('/admin/courses/addTrainingProgram: Add Training Program :' + req.body.name);
        // this function check if the courseName is already existed
        models.TrainingProgram.getTrainingByName(req.body.name, function(result) {
            if (result) {
                res.send({
                    success: false,
                    msg: 'Name already existed. Add fail!'
                });
            } else {
                models.TrainingProgram.create({
                    name: req.body.name,
                    description: req.body.description,
                    courseTypeId: req.body.courseTypeId.id,
                    imgLink: '/img/trainingProgram/training-icon-1.svg',
                }).then(function() {
                    res.send({
                        success: true,
                        msg: "Add Training Program Success"
                    });
                });
            }
        });

});

//Updtae Training Program
router.post('/updateTrainingProgram', function(req, res) {
    log.info('/admin/updateTrainingProgram: Update Training Program :' + req.body.name);
    models.TrainingProgram.sync({
        force: false
    }).then(function() {
        models.TrainingProgram.update({
            name: req.body.name,
            description: req.body.description,
            duration: req.body.duration,
            courseTypeId: req.body.courseTypeId.id,
            imgLink: '/img/trainingProgram/training-icon-1.svg',
        }, {
            where: {
                id: req.body.id
            }
        }).then(function() {
            res.send({
                success: true,
                msg: 'Edit Training Program success!'
            });
        });
    });
});

//delete Training Program
router.post('/deleteTrainingProgram', function(req, res) {
    log.info('Get Delete Command');
    models.TrainingProgram.destroy({
        where:{
            id: req.body.id
        }
    });
    res.send({
        success: true,
        msg: 'Delete Training Program success'
    });
});

//Get Class
router.get('/getClass', function(req, res){

    var query =
    {
        include: [
            {
                model: models.Course
            }
        ],
        where:{
            courseId: req.body.courseId
        }
    };
    models.Class.findAll(query).then(function(Class) {
        var datasend = {
            success : true,
            msg:'send list success',
            Class: Class
        };
        res.send(datasend);
    });
});

//Add Class
router.post('/addClass', function(req, res) {
    log.info('/admin/courses/addClass: Add Class :' + req.body.location);
    console.log(req.body);
    models.Class.sync({
        force: false
    }).then(function() {
        models.Class.create({
            courseId: req.body.courseId,
            location: req.body.location,
            //TODO
            // trainerId: req.body.trainerId.id,
            startTime: req.body.startTime,
            duration: req.body.duration,
            maxAttendant: req.body.maxAttendant,
            note: req.body.note
        }).then(function() {
            res.send({
                success: true,
                msg: "Add Class Success"
            });
        });
    });
});

//Update Class
router.post('/updateClass', function(req, res) {
    console.log(req.body);
    log.info('/admin/updateClass: update Class :' + req.body.id);
    // TODO : add trainee to class record
    models.Class.sync({
        force: false
    }).then(function() {
        models.Class.update({
            location: req.body.location,
            //TODO
            // trainerId: req.body.trainerId,
            startTime: req.body.startTime,
            duration: req.body.duration,
            maxAttendant: req.body.maxAttendant,
            note: req.body.note
        }, {
            where: {
                id: req.body.id,
            }
        }).then(function() {
            res.send({
                success: true,
                msg: 'Edit Class Info success!'
            });
        });
    });
});

// Delete Class
router.post('/deleteClass', function(req, res) {
    log.info('Get Delete Command');
    models.Class.destroy({
        where:{
            id: req.body.id
        }
    });
    // models.ClassRecord.destroy({
    //     where:{
    //         classId: req.body.id
    //     }
    // });
    res.send({
        success: true,
        msg: 'Delete Class success'
    });
});

module.exports = router;
