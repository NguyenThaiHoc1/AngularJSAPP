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
    log.info('/common/course/getClassByCourseID: ');
    var query =
    {
        include: [  models.User,
            {
                model: models.ClassRecord,
                include: [models.User]
            }
        ],
        where: {
            courseId : req.body.courseId
        }
    };

    models.Class.findAll(query).then(function(classes) {
        var resData = [];
        classes.forEach( classByCourseId =>{
            var traineeList = [];
            classByCourseId.ClassRecords.forEach(classRecord =>{
                traineeList.push({
                    traineeName: classRecord.User.username,
                    //status: classRecord.status
                    comment: classRecord.comments,
                    rating: classRecord.rating,
                });
            });

            resData.push({
                id: classByCourseId.id,
                location: classByCourseId.location,
                trainerName: classByCourseId.User.username,
                startTime: classByCourseId.startTime,
                traineeList: traineeList
            });
        });

        var datasend = {
            success: true,
            msg:'send list success',
            data: resData
        };
        res.send(datasend);
    });
});

module.exports = router;
