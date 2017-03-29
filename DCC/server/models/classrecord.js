var _classrecordModel = require('./DataObjects/classRecord');
module.exports = function (sequelize) {
    var Classrecord = sequelize.define('ClassRecord', _classrecordModel, {
        charset: 'utf8',
        collate: 'utf8_unicode_ci',
        classMethods: {
            unEnrollCourse: function (traineeId, classId, cb) {
                var query = {
                    where: {
                        classId: classId,
                        traineeId: traineeId
                    },
                };
                Classrecord.destroy(query).then(cb);
            },
            enrollCourse: function (traineeId, classId, cb) {
                var query = {
                    traineeId: traineeId,
                    classId: classId,
                    status: "Enrolled",
                };
                Classrecord.create(query).then(cb);
            },
            findTraineeEnrolledClass: function(traineeId, classId, cb) {
                var query = {
                    where: {
                        traineeId: traineeId,
                        classId: classId,
                        status: 'Enrolled'
                    }
                };
                Classrecord.findOne(query).then(cb);
            },
            getTraineeClassbyId: function(traineeId, classId, cb) {
                var query = {
                    where: {
                        traineeId: traineeId,
                        classId: classId
                    }
                };
                Classrecord.findOne(query).then(cb);
            }
        },
        tableName: 'class_record',
        timestamps: false
    });
    return Classrecord;
};
