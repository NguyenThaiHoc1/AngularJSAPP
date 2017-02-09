var router = require('express').Router();
var models = require('../../models');
var log = require('../../../config/logConfig');

// add course to database
router.post('/addCourse', function(req, res) {
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

// update course in database
router.post('/updateCourse', function(req, res) {
    models.Course.sync({
        force: false
    }).then(function() {
        models.Course.update({
            name: req.body.name,
            description: req.body.description,
            duration: req.body.duration,
            test: req.body.test,
            documents: req.body.documents,
            isDeleted:  0,
            courseTypeId: req.body.courseTypeId.id,
            trainingProgramId: req.body.trainingProgramId.id,
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

// mark course as deleted (isDeleted = true)
router.post('/deleteCourse', function(req, res) {
    models.Course.getByID(req.body.id, function(result) {
        if (result) {
            models.Course.update({
                isDeleted: true
            }, {
                where: {
                    id: req.body.id
                }
            });
            res.send({
                success: true,
                msg: 'Delete success'
            });
        } else {
            res.send({
                success: false,
                msg: 'Delete failure'
            });
        }
    });
});

router.get('/getCourseList', function(req, res) {
    models.Course.findAll({
        include: [ models.TrainingProgram ]
    }).then(function(course) {
        var datasend = {
            success: true,
            course: course,
            msg:'send list success'
        };
        res.send(datasend);
    })

});

//getCourseTypeList
router.get('/getCourseTypeList', function(req, res) {
    var query = { include: [ models.Course ]};
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

    models.TrainingProgram.findAll().then(function(trainingProgram) {
        var datasend = {
            success: true,
            msg:'send list success',
            data: trainingProgram
        };
        res.send(datasend);
    });
});

module.exports = router;
