var _feedbackModel = require('./DataObjects/feedback');
var log = require('../../config/logConfig');

module.exports = function(sequelize) {
    var Feedback = sequelize.define('Feedback', _feedbackModel,{
        classMethods: {
            getFeedbackByClassID: function(id, cb) {
                var query = {
                    where: {
                        classId: id
                    }
                };
                Feedback.findAll(query).then(cb);
            },
            getFeedbackByClassIDByUserID: function(ClassId, UserId, cb) {
                var query = {
                    where: {
                        ClassId: ClassId,
                        UserId: UserId
                    }
                };
                Feedback.findOne(query).then(cb);
            }
        },

        tableName: 'feedback',
        timestamps: false
    });
    return Feedback;
};
