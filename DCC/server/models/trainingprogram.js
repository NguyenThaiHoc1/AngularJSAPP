var config = require('../config/config.json');
var log = require('../config/config')[config.logConfig];
var _trainingprogramModel= require('./DataObjects/trainingProgram');
var Sequelize = require('sequelize');

module.exports = function(sequelize) {
    var Trainingprogram = sequelize.define('TrainingProgram', _trainingprogramModel,{
        charset: 'utf8',
        collate: 'utf8_unicode_ci',
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
