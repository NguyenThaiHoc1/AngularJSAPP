var _feedbackModel = require('./DataObjects/feedback');
var log = require('../../config/logConfig');

module.exports = function(sequelize, DataTypes) {
    var Feedback = sequelize.define('Feedback', _feedbackModel,{
        classMethods: {
            getFeedbackByClassID: function(id, cb) {
                log.info('/models/feedback: getFeedbackByClassID() : ' + id);
                var query = {
                    where: {
                        classId: id
                    }
                };
                Feedback.findAll(query).then(cb);
            },
            // getFeedbackByCommentedBy: function(commentedBy, cb) {
            //     log.info('/models/feedback: getFeedbackByCommentedBy() : ' + commentedBy);
            //     var query = {
            //         where: {
            //             commentedBy: commentedBy
            //         }
            //     };
            //     Feedback.findOne(query).then(cb);
            // },
            getFeedbackByClassIDByUserID: function(ClassId, UserId, cb) {
                log.info('/models/feedback: getFeedbackByCommentedBy() : ');
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
