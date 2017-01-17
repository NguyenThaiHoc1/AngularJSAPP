var router = require('express').Router();
var models = require('../../models');
var log = require('../../../config/logConfig');

router.get('/getTrainingProgram', function(req, res){
    var query = { include: [ models.Course ]};
    models.TrainingProgram.findAll(query).then(
        function(trainingProgram) {
            var datasend = {
                msg:'send list success',
                data: trainingProgram
            };
            res.send(datasend);
        });
    });

    router.get('/getOpeningCourse', function(req, res){
        models.Class.getOpeningClass(
            function(openingClass)
            {
                var datasend = {
                    msg:'send list success',
                    data: openingClass
                };
                res.send(datasend);

            }
        );
    });

    router.post('/registerCourse', function(req, res){
        var courseId = req.body.courseId;
        var userEmail = req.body.userEmail;
        models.Class.getOpeningClassByCourseID(courseId,
            function(openingClass){
                if(!openingClass){
                    models.RequestOpening.addRequestOpeningCourse(userEmail,courseId);
                    var datasend = {
                        msg:'send request opening success'
                    };
                    res.send(datasend);
                }
                else{
                    //dua userid, classid vao class record
                    models.ClassRecord.addTraineeToClass(userEmail,openingClass.id);
                    var datasend = {
                        msg:'send register course success'
                    };
                    res.send(datasend);
                }
            }
        )
    });
module.exports = router;
