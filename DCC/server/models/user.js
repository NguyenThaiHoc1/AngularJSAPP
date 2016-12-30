var log = require('../../config/logConfig');
var _userModel=require('./DataObjects/user');
module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define('User', _userModel, {
        classMethods: {
            getUserByID: function(id,cb){
                log.info('/models/user: getUserByID() : ' + id);
                var query = {
                    where: {
                        id: id
                    }
                };
                User.findOne(query).then(cb);
            },
            getUserByName: function(username,cb){
                log.info('/models/user: getUserByName() : ' + username);
                var query = {
                    where: {
                        username: username
                    }
                };
                User.findOne(query).then(cb);
            },
            getUserByEmail: function(email,cb){
                log.info('/models/user: getUserByName() : ' + email);
                var query = {
                    where: {
                        email: email
                    }
                };
                User.findOne(query).then(cb);
            }
        },

        tableName: 'user'
    });
    return User;
};
