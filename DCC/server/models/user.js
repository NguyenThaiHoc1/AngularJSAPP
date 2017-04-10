var log = require('../config/config')["log"];
var _userModel = require('./DataObjects/user');
var md5 = require('md5');
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
            },
            getEmailUsers: function (cb) {
                sequelize.query('SELECT * FROM user us where us.isNotificationEmail = 1 order by us.email', { type: sequelize.QueryTypes.SELECT }).then(cb);
            },
            getUserByID : function(userID, cb){
                var query = {
                    where: {
                        id: userID
                    }
                };
                User.findOne(query).then(cb);
            }
        },
        tableName: 'user',
        timestamps: false
    });
    return User;
};

