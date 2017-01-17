var _courseModel = require('./DataObjects/course');
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
                        isDeleted: 0
                    }
                };
                Course.findAll(query).then(cb);
            },

            getByID: function(id, cb)
            {
                log.info('/models/course: getByID() : ' + id);
                var query = {
                    where: {
                        isDeleted: 0,
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
                        isDeleted: 0,
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
                        isDeleted: 0,
                        trainingProgramId: trainingProgramId
                    }
                };
                Course.findAll(query).then(cb);
            },
            
        },

        tableName: 'course'
    });
    return Course;
};
