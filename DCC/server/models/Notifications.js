var _notificationsModel = require("./DataObjects/Notifications");
var Sequelize = require('sequelize');
var models = require("./index");

module.exports = function (sequelize) {
    var Notifications = sequelize.define('Notifications', _notificationsModel, {
        charset: 'utf8',
        collate: 'utf8_unicode_ci',
        classMethods: {

            getAllNotificationByEmail: function (userEmail, cb) {
                var query = {
                    where: {
                        email: userEmail
                    }
                };
                Notifications.findAll(query).then(cb);
            },
            getNotificationsNewNumber: function (userEmail, cb) {
                var query = {
                    where: {
                        email: userEmail,
                        status: 1
                    }
                };
                Notifications.findAndCountAll(query).then(cb);
            },
        },
        tableName: 'notification',
        timestamps: false
    });
    return Notifications;
};
