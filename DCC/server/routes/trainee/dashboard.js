var router = require('express').Router();
var models = require('../../models');
var log = require('../../../config/logConfig');

router.get('/getTrainingProgram', function(req, res){
    var query =
    {
        include: [
            {
                model: models.Course,
                include: [
                    {
                        model: models.Class,
                        include: [
                            {
                                model: models.ClassRecord,
                                where: {traineeEmail: 'thach@gmail.com'} //req.user.email
                            }
                        ]
                    }
                ]
            }
        ]
    };
    models.TrainingProgram.findAll(query).then(function(trainingProgram) {
        var datasend = {
            msg:'send list success',
            trainingProgram: trainingProgram
        };
        res.send(datasend);
    });
});

router.get('/getRequestOpenCourse', function(req, res){
    var query =
    {
        include:     [{
            model: models.RequestOpening,
            where: {userEmail: req.user.email }
        }]
    };
    models.Course.findAll(query).then(function(course) {
        var datasend = {
            msg:'send list success',
            data: course
        };
        res.send(datasend);
    });
});

module.exports = router;
