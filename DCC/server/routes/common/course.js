var router = require('express').Router();
var models = require('../../models');
var log = require('../../config/config')["log"];

router.post('/getCourseDetail', function (req, res) {
    models.Course.getByID(req.body.courseId, function (course) {
        res.send({
            success: true,
            data: course
        });
    });
});

router.post('/getClassByCourseID', function (req, res) {
    log.info('/common/course/getClassByCourseID: ');
    var query =
        {
            include: [models.User,
            {
                model: models.ClassRecord,
                include: [models.User]
            }
            ],
            where: {
                courseId: req.body.courseId
            }
        };

    models.Class.findAll(query).then(function (classes) {
        var resData = [];
        classes.forEach(classByCourseId => {
            var traineeList = [];
            var ratingAverage = 0;
            var count = 0;
            classByCourseId.ClassRecords.forEach(classRecord => {
                count++;
                ratingAverage = Math.ceil(ratingAverage + classRecord.rating) / count;
                traineeList.push({
                    traineeName: classRecord.User.username,
                    traineeAvatar: classRecord.User.avatar,
                    traineeMail: classRecord.User.email,
                    comment: classRecord.comments,
                    rating: classRecord.rating,
                });
            });

            resData.push({
                id: classByCourseId.id,
                location: classByCourseId.location,
                trainerId: classByCourseId.User ? classByCourseId.User.id : 1,
                trainerName: classByCourseId.User ? classByCourseId.User.username : "Not Assigned",
                startTime: classByCourseId.startTime,
                endTime: classByCourseId.endTime,
                trainerAvatar: classByCourseId.User ? classByCourseId.User.avatar : "/img/profiles/defaultProfile.jpg",
                traineeList: traineeList,
                maxAttendant: classByCourseId.maxAttendant,
                ratingAverage: ratingAverage,
                numTrainee: count,
                courseId: classByCourseId.courseId
            });
        });

        var datasend = {
            success: true,
            msg: 'send list success',
            data: resData
        };
        res.send(datasend);
    });
});

module.exports = router;
