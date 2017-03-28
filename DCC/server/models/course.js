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

            getAll: function(cb) {
                Course.findAll().then(cb);
            }
        },
        tableName: 'course',
        timestamps: false
    });
    return Course;
};
