var router = require('express').Router();
var models = require('../../models');
var log = require('../../../config/logConfig');


router.post('/getTrainingProgramByTPType', function(req, res){
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
            if( trainingProgram.CourseType.name === req.body.userType || trainingProgram.CourseType.name === 'EVERYONE' )
            {
                resData.push(trainingProgram);
            }
            else
            {
                if( !req.body.isExperienced  )
                {
                    if(  trainingProgram.CourseType.name === 'OPTIONAL' )
                    {
                        resData.push( trainingProgram);
                    }
                    else{
                        if ( trainingProgram.Courses.length !== 0 ){
                            var resDataCourse =[];
                            trainingProgram.Courses.forEach(course =>{
                                for ( var i = 0; i < course.Classes.length ; i++)
                                {
                                    for ( var j = 0; j < course.Classes[i].ClassRecords.length  ; j++ )
                                    {
                                        if ( course.Classes[i].ClassRecords[j].traineeEmail === req.body.email )
                                        {
                                            resDataCourse.push(course);
                                        }
                                    }
                                }
                            });
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
                }
                else
                {
                    if ( trainingProgram.Courses.length !== 0 ){
                        var resDataCourse =[];
                        trainingProgram.Courses.forEach(course =>{
                            for ( var i = 0; i < course.Classes.length ; i++)
                            {
                                for ( var j = 0; j < course.Classes[i].ClassRecords.length  ; j++ )
                                {
                                    if ( course.Classes[i].ClassRecords[j].traineeEmail === req.body.email )
                                    {
                                        resDataCourse.push(course);
                                    }
                                }
                            }
                        });
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
