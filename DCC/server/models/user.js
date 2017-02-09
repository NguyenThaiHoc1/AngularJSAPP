var log = require('../../config/logConfig');
var _userModel=require('./DataObjects/user');
module.exports = function(sequelize) {
    var User = sequelize.define('User', _userModel, {
        classMethods: {
            getUserByID: function(id,cb){
                var query = {
                    where: {
                        id: id
                    }
                };
                User.findOne(query).then(cb);
            },
            getUserByEmail: function(userEmail, cb){
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
