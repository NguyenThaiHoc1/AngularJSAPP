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
                                where: {traineeEmail: req.user.email}
                            }
                        ]
                    }
                ]
            }
        ]
    };
    models.TrainingProgram.findAll(query).then(function(trainingProgram) {
        var datasend = {
            success : true,
            msg:'send list success',
            trainingProgram: trainingProgram
        };
        res.send(datasend);
    });
});

router.get('/getTrainingProgramByTPType', function(req, res){
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
                            }
                        ]
                    }
                ]
            }
        ]
    };
    models.TrainingProgram.findAll(query).then(function(trainingPrograms) {
        var resData =[];
        trainingPrograms.forEach(trainingProgram =>{

            // course.Class[course.Class.length-1].ClassRecord.traineeEmail
            if( trainingProgram.traineeType == 'CBA' || trainingProgram.traineeType == 'EVERYONE' ){

                resData.push( trainingProgram);
            }
            else{
                trainingProgram.Courses.forEach(course =>{
                    if ( course.Classes[course.Classes.length - 1].ClassRecords[course.Classes[course.Classes.length - 1].ClassRecords.length - 1].traineeEmail == 'thach@gmail.com' )
                    {
                        resData.push( trainingProgram);
                    }
                });
            }

        });
        var datasend = {
            success : true,
            msg:'send list success',
            trainingProgram: resData,

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
            success:true,
            msg:'send list success',
            data: course
        };
        res.send(datasend);
    });
});

module.exports = router;
