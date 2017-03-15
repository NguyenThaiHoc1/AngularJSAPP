var router = require('express').Router();
var models = require('../../models');
var config = require('../../config/config.json');
var log = require('../../config/config')[config.logConfig];
var sequelize = require("sequelize");

router.post('/getEnrolledCourseList', function (req, res) {
    var query = {
        include: [
            {
                model: models.Class,
                include: [
                    {
                        model: models.ClassRecord,
                        where: {
                            traineeId: req.body.userId,
                            status: 'Enrolled'
                        }
                    }],
            }
        ],
        order: '`startTime` ASC'
    };
    models.Course.findAll(query).then(function (courseList) {
        var events = [];
        courseList.forEach(course => {
            var event = {};
            event.id = course.Classes[0].id;
            event.title = course.name;
            event.description = course.description;
            event.start = course.Classes[0].startTime;
            event.end = course.Classes[0].endTime;
            event.location = course.Classes[0].location;
            events.push(event);
        });
        var datasend = {
            success: true,
            msg: 'send list success',
            data: events
        };
        res.send(datasend);
    });
});

module.exports = router;