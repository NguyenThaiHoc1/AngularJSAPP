var _courseModel = require('./DataObjects/Course');
var log = require('../config/config')["log"];
var models = require("./index");

module.exports = function (sequelize) {
    var Course = sequelize.define('Course', _courseModel, {
        charset: 'utf8',
        collate: 'utf8_unicode_ci',
        classMethods: {
            getByID: function (id, cb) {
                var query = {
                    where: {

                        id: id
                    }
                };
                Course.findOne(query).then(cb);
            },

            getByName: function (name, cb) {
                var query = {
                    where: {

                        name: name
                    }
                };
                Course.findOne(query).then(cb);
            },

            getAll: function (cb) {
                Course.findAll().then(cb);
            },
            deleteCourseByID: function (id, cb) {
                Course.destroy({ where: { id: id } }).then(cb);
            },
            deleteCourseByTPID: function (TPID, cb) {
                Course.destroy({ where: { trainingProgramId: TPID } }).then(cb);
            },
            add: function (name, description, duration, test, documents, trainingProgramID, cb) {
                Course.create({
                    name: name,
                    description: description,
                    duration: duration,
                    test: test,
                    documents: documents,
                    trainingProgramId: trainingProgramID,
                    imgLink: '/img/courses/training-icon-1.svg'
                }).then(cb);
            },
            edit: function (id, name, description, duration, test, documents, trainingProgramID, cb) {
                Course.update({
                    name: name,
                    description: description,
                    duration: duration,
                    test: test,
                    documents: documents,
                    trainingProgramId: trainingProgramID
                },
                    {
                        where: {
                            id: id
                        }
                    }).then(cb)
            }
        },
        tableName: 'course',
        timestamps: false
    });
    return Course;
};
