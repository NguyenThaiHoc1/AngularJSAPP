var router = require('express').Router();
var models = require('../../models');
var log = require('../../config/logConfig');


router.post('/getTrainingProgramByTPType', function (req, res) {
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
                                    include: [models.User]
                                }
                            ]
                        }
                    ]
                }
            ]
        };
    models.TrainingProgram.findAll(query).then(function (trainingPrograms) {
        var resData = [];
        trainingPrograms.forEach(trainingProgram => {
            if (trainingProgram.CourseType.name === req.body.userType || trainingProgram.CourseType.name === 'EVERYONE' || (!req.body.isExperienced && trainingProgram.CourseType.name === 'OPTIONAL')) {
                resData.push(trainingProgram);
            }
            else {
                var resDataCourse = [];
                var a;
                trainingProgram.Courses.forEach(course => {
                    course.Classes.forEach(classes => {
                        classes.ClassRecords.forEach(classRecord => {
                            if (classRecord.User.email === req.body.email) {
                                a = 1;
                                resDataCourse.push(course);
                            }
                        });
                    });
                });
                if (a === 1) {
                    resData.push({
                        id: trainingProgram.id,
                        name: trainingProgram.name,
                        description: trainingProgram.description,
                        imgLink: trainingProgram.imgLink,
                        courseTypeId: trainingProgram.courseTypeId,
                        CourseType: trainingProgram.CourseType,
                        Courses: resDataCourse
                    });
                }
            }

        });
        var datasend = {
            success: true,
            msg: 'send list success',
            trainingProgram: resData,
        };
        res.send(datasend);
    });
});

router.post('/getRequestOpenCourse', function (req, res) {
    var query =
        {
            include: [{
                model: models.RequestOpening,
                where: { userId: req.body.userId }
            }]
        };
    models.Course.findAll(query).then(function (course) {
        var datasend = {
            success: true,
            msg: 'send list success',
            data: course
        };
        res.send(datasend);
    });
});






module.exports = router;
