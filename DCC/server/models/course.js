var _courseModel = require('./DataObjects/Course');
var log = require('../../config/logConfig');
var models = require("./index");

module.exports = function(sequelize) {
    var Course = sequelize.define('Course', _courseModel, {
        classMethods: {
            getCourses: function(cb)
            {
                log.info('/models/course: getCourses()');
                var query = {
                    where: {

                    }
                };
                Course.findAll(query).then(cb);
            },

            getByID: function(id, cb)
            {
                log.info('/models/course: getByID() : ' + id);
                var query = {
                    where: {

                        id: id
                    }
                };
                Course.findOne(query).then(cb);
            },

            getByName: function(name, cb)
            {
                log.info('/models/course: getByName() : ' + name);
                var query = {
                    where: {

                        name: name
                    }
                };
                Course.findOne(query).then(cb);
            },

            getByTraningProgramID: function(trainingProgramId, cb)
            {
                log.info('/models/course: getByTraningProgramID() : ' + trainingProgramId);
                var query = {
                    where: {

                        trainingProgramId: trainingProgramId
                    }
                };
                Course.findAll(query).then(cb);
            },

        },

        tableName: 'course',
        timestamps: false
    });
    return Course;
};
