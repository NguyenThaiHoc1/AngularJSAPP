var _requestOpeningModel = require('./DataObjects/requestOpening');
module.exports = function(sequelize) {
    var RequestOpening = sequelize.define('RequestOpening', _requestOpeningModel, {
        classMethods: {
            addRequestRegister: function(userEmail, courseId, cb)
            {
                var query = {
                    userEmail : userEmail,
                    courseId : courseId,
                    requestType: "register",
                    requestTime : Date.now()
                };
                RequestOpening.create(query).then(cb);
            },
            addRequestJoin: function(userEmail, courseId, cb)
            {
                var query = {
                    userEmail : userEmail,
                    courseId : courseId,
                    requestType: "join",
                    requestTime : Date.now()
                };
                RequestOpening.create(query).then(cb);
            },
            getRequestedOpeningCourse: function(userEmail, cb)
            {
                var query = {
                    where:
                    {
                        userEmail: userEmail
                    }
                };
                RequestOpening.findAll(query).then(cb);
            },
            deleteRequestOpening: function(userEmail,courseId, cb){
                var query = {
                    where:
                    {
                        userEmail: userEmail,
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
