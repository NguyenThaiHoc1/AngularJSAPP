var _classrecordModel = require('./DataObjects/classRecord');
module.exports = function(sequelize) {
    var Classrecord = sequelize.define('ClassRecord', _classrecordModel, {
        classMethods: {
            unEnrollCourse: function(traineeId, classId, cb){
                var query = {
                    where: {
                        classId: classId,
                        traineeId: traineeId
                     },
                };
                Classrecord.destroy(query).then(cb);
            }
        },
        tableName: 'class_record',
        timestamps: false
    });
    return Classrecord;
};
