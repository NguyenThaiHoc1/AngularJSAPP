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

module.exports = router;
