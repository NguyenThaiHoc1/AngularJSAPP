var _courseTypeModel = require('./DataObjects/courseType');
var config = require('../config/config.json');
var log = require('../config/config')[config.logConfig];
var models = require("./index");

module.exports = function(sequelize) {
    var courseType = sequelize.define('CourseType', _courseTypeModel, {
        classMethods: {
        },

        tableName: 'course_type',
        timestamps: false
    });
    return courseType;
};
