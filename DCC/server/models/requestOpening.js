var _requestOpeningModel = require('./DataObjects/requestOpening');
module.exports = function (sequelize) {
    var RequestOpening = sequelize.define('RequestOpening', _requestOpeningModel, {
        charset: 'utf8',
        collate: 'utf8_unicode_ci',
        classMethods: {
            addRequestRegister: function (userId, courseId, cb) {
                var query = {
                    userId: userId,
                    courseId: courseId,
                    requestType: "register",
                    requestTime: Date.now()
                };
                RequestOpening.create(query).then(cb);
            },
            getRequestedOpeningCourse: function (userId, cb) {
                var query = {
                    where:
                    {
                        userId: userId
                    }
                };
                RequestOpening.findAll(query).then(cb);
            },
            deleteRequestOpening: function (userId, courseId, cb) {
                var query = {
                    where:
                    {
                        userId: userId,
                        courseId: courseId
                    }
                };
                RequestOpening.destroy(query).then(cb);
            }
        },
        tableName: 'request_opening',
        timestamps: false
    });
    return RequestOpening;
};
