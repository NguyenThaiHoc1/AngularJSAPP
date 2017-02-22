'use strict';

var models = require(../server/models);


module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable(model.User.tableName,models.User.attributes)
    .then(function(){return queryInterface.createTable(model.Course.tableName,models.Course.attributes})
    .then(function(){return queryInterface.createTable(model.CourseType.tableName,models.CourseType.attributes})
    .then(function(){return queryInterface.createTable(model.TrainingProgram.tableName,models.TrainingProgram.attributes})
    .then(function(){return queryInterface.createTable(model.RequestOpening.tableName,models.RequestOpening.attributes})
    .then(function(){return queryInterface.createTable(model.Class.tableName,models.Class.attributes})
    .then(function(){return queryInterface.createTable(model.ClassRecord.tableName,models.ClassRecord.attributes})
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
