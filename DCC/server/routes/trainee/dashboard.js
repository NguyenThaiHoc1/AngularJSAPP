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
            msg:'send list success',
            data: trainingProgram
        };
        res.send(datasend);
    });
});

module.exports = router;
