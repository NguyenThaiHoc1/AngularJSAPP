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

router.post('/getClassByCourseID', function(req, res) {
    var query =
    {
        where: {
            courseId : req.body.courseId
        }
    };

    models.Class.findAll(query).then(function(classes) {
        var datasend = {
            success: true,
            msg:'send list success',
            data: classes
        };
        res.send(datasend);
    });
});

module.exports = router;
