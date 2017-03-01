var config = require('../config/config.json');
var log = require('../config/config')[config.logConfig];
var _userModel = require('./DataObjects/user');
module.exports = function (sequelize) {
    var User = sequelize.define('User', _userModel, {
        charset: 'utf8',
        collate: 'utf8_unicode_ci',
        classMethods: {
            getUserByEmail: function (userEmail, cb) {
                var query = {
                    where: {
                        email: userEmail
                    }
                };
                User.findOne(query).then(cb);
            },
            getUserByEmailAndPassword: function (userEmail, userPassword, cb) {
                var query = {
                    where: {
                        email: userEmail,
                        password: userPassword
                    }
                };
                User.findOne(query).then(cb);
            },
            getAllUsers: function (cb) {
                User.findAll().then(cb);
            }
        },
        tableName: 'user',
        timestamps: false
    });
    return User;
};

