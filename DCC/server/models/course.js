var _courseModel = require('./DataObjects/Course');
var log = require('../config/logConfig');
var models = require("./index");

module.exports = function(sequelize) {
    var Course = sequelize.define('Course', _courseModel, {
        classMethods: {
            getByID: function(id, cb)
            {
                var query = {
                    where: {

                        id: id
                    }
                };
                Course.findOne(query).then(cb);
            },

            getByName: function(name, cb)
            {
                var query = {
                    where: {

                        name: name
                    }
                };
                Course.findOne(query).then(cb);
            },

            getByTraningProgramID: function(trainingProgramId, cb)
            {
                var query = {
                    where: {

                        trainingProgramId: trainingProgramId
                    }
                };
                Course.findAll(query).then(cb);
            }
        },
        tableName: 'course',
        timestamps: false
    });
    return Course;
};
