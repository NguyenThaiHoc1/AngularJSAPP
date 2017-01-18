var router = require('express').Router();
var models = require('../../models');
var log = require('../../../config/logConfig');

router.post('/getCourseDetail', function(req, res) {
    models.Course.getByID(req.body.courseId, function(course){
        res.send({
            success: true,
            data: course
        });
    });
});


module.exports = router;
