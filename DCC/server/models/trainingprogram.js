var log = require('../../config/logConfig');
var _trainingprogramModel= require('./DataObjects/trainingProgram');
var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  var Trainingprogram = sequelize.define('TrainingProgram', _trainingprogramModel,{
      classMethods:{
        getTraining: function(cb)
        {
          log.info('/models/course: getCourses() : ');
          var query =
          {
                include: [ models.Course ]
          };
          Trainingprogram.findAll(query).then(cb);
        },
          getTrainingByID: function(idTP,cb){
              log.info('/models/user: getTrainingByID :'+ idTP);
              var query={
              };
              Trainingprogram.findOne(query).then(cb);
          },
      },
      tableName: 'training_program'
  });
    return Trainingprogram;
};
