var _courseTypeModel = require('./DataObjects/courseType');
var log = require('../../config/logConfig');
var models = require("./index");

module.exports = function(sequelize) {
    var courseType = sequelize.define('CourseType', _courseTypeModel, {
        classMethods: {
        },

        tableName: 'course_type'
    });
    return courseType;
};
