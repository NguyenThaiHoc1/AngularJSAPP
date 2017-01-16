var express = require('express');
var router = express.Router();
var models = require('../../models');
var log = require('../../../config/logConfig');

// add course to database
router.post('/addCourse', function(req, res) {
    log.info('/admin/course: Add course :' + req.body.name);
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
                    courseTypeId: '1',
                    traingProgramId: '1',
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
            isDeleted:  0,
            courseTypeId: '1',
            traingProgramId: '1',
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
router.post('/isDeletedCourse', function(req, res) {
    log.info('Get Delete Command');
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
                msg: 'Delete success'
            });
        } else {
            res.send({
                msg: 'Delete failure'
            });
        }
    });
});

router.get('/getCourseList', function(req, res) {
    log.info('/admin/getCourseList: get course list data');
    // models.Course.getCourses(function(courses) {
    //     var datasend = {
    //         courses: courses,
    //         msg:'send list success'
    //     };
    //     res.send(datasend);
    // });
    models.Course.findAll({
        where:{isDeleted: false}
    }).then(function(courses) {
        var datasend = {
            course: courses,
            msg:'send list success'
        };
        res.send(datasend);
    })

});

module.exports = router;
