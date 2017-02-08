var log = require('../../config/logConfig');
var _userModel=require('./DataObjects/user');
module.exports = function(sequelize) {
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
            getUserByEmail: function(userEmail, cb){
                log.info('/models/user: getUserByEmail() : ' + userEmail);
                var query = {
                    where: {
                        email: userEmail
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
