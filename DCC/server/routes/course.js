var express = require('express');
var router = express.Router();
var models = require('../models');
var log = require('../../config/logConfig');

// force: true will drop the table if it already exists

// Or you can simply use a connection uri



// add course detail to database
models.course.sync({
    force: false
});

router.post('/getCourse', function(req, res) {
    log.info('/route/course: Get Course Information');
    models.course.getByID(parseInt(req.body.courseID), function(course) {
        res.send({
            courseName: course.name,
            courseDescription: course.description,
            courseDocuments: course.documents,
            courseCategory: course.category
        });
    });
});

// add course to database
router.post('/addCourse', function(req, res) {
    log.info('/routes/course: Add course :' + req.body);
    models.course.sync({
        force: false
    }).then(function() {
        // this function check if the courseName is already existed
        models.course.getByName(req.body.courseName, function(result) {
            if (result) {
                res.send({
                    msg: 'Name already existed. Add fail!'
                });
            } else {

                models.course.create({
                    name: req.body.courseName,
                    description: req.body.courseDescription,
                    category: req.body.courseCategory,
                    test: req.body.courseTest,
                    documents: req.body.courseDocuments,
                    // trainerID: tID
                }).then(function() {
                    res.send({
                        msg: 'Add course success!'
                    });
                });
            }
        });
    });
});

// update course in database
router.post('/updateCourse', function(req, res) {
    log.info('Get Course Information');
    models.course.sync({
        force: false
    }).then(function() {
        models.course.getByID(req.body.courseIDEdit, function(result) {
            if (result) {
                models.course.update({
                    name: req.body.courseNameEdit,
                    description: req.body.courseDescriptionEdit,
                    category: req.body.courseCategoryEdit,
                    test: req.body.courseTestEdit,
                    documents: req.body.courseDocumentsEdit,
                }, {
                    where: {
                        id: req.body.courseIDEdit
                    }
                }).then(function() {
                    res.send({
                        msg: 'Edit course success!'
                    });
                });
            } else {
                res.send({
                    msg: 'Course not found in database'
                });
            }

        });
});
});
// mark course as deleted (isDeleted = true)
router.post('/isDeletedCourse', function(req, res) {
    log.info('Get Delete Command');
    models.course.getByID(req.body.courseIDDelete, function(result) {
        if (result) {
            models.course.update({
                isDeleted: true
            }, {
                where: {
                    id: req.body.courseIDDelete
                }
            });
            res.send({
                msg: 'Delete success'
            });
        } else {
          res.send({
              msg: 'Delete failure'
          });
        }
    });
});

router.get('/list', function(req, res) {
    log.info('/routes/course: get course list data');
    models.course.getCourses(function(course) {
        console.log('ok');
        var datasend = {
            course: course,
            msg:'send list success'
        };
        res.send(datasend);
    });
});

router.get('/', function(req, res) {
    res.render('courses');
    log.info('/route/course: GET /course');
});
router.get('/coursedetail/', function(req, res) {
    res.render('coursedetail');
    log.info('/route/course: GET /course/coursedetail');
});

router.get('/coursedetail/:id', function(req, res) {
    res.render('coursedetail');
    log.info('/route/course: GET /course/coursedetail/:id');
});
router.get('/trainerdashboard', function(req, res) {
    log.info('/route/course: GET /course/trainerdashboard');
    res.render('trainerdashboard');
});
module.exports = router;