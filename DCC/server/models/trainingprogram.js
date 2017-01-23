var log = require('../../config/logConfig');
var _trainingprogramModel= require('./DataObjects/trainingProgram');
var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  var Trainingprogram = sequelize.define('TrainingProgram', _trainingprogramModel,{
      classMethods:{
        getTraining: function(cb)
        {
          log.info('/models/trainingprogram: getTraining() : ');
          var query =
          {
                include: [ models.Course ]
          };
          Trainingprogram.findAll(query).then(cb);
        },
          getTrainingByID: function(idTP,cb){
              log.info('/models/trainingprogram: getTrainingByID :'+ idTP);
              var query={
                  where:{
                      id: idTP
                  }
              };
              Trainingprogram.findOne(query).then(cb);
          },
          getTrainingByName: function(nameTP, cb){
            log.info('/models/trainingprogram: getTrainingByName:'+nameTP);
            var query={
                where: {
                    name: nameTP
                }
            };
          },
      },
      tableName: 'training_program'
  });
    return Trainingprogram;
};
