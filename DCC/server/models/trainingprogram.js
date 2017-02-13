var log = require('../../config/logConfig');
var _trainingprogramModel= require('./DataObjects/trainingProgram');
var Sequelize = require('sequelize');

module.exports = function(sequelize) {
    var Trainingprogram = sequelize.define('TrainingProgram', _trainingprogramModel,{
        classMethods:{
            getTrainingByName: function(TPname, cb){
                var query = {
                    where: {
                        name: TPname
                    }
                };
                Trainingprogram.findOne(query).then(cb);
            }
        },
        tableName: 'training_program',
        timestamps: false
    });
    return Trainingprogram;
};
