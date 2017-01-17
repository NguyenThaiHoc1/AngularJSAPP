var _classrecordModel = require('./DataObjects/classRecord');
module.exports = function(sequelize, DataTypes) {
    var Classrecord = sequelize.define('ClassRecord', _classrecordModel, {
        classMethods: {
            addTraineeToClass: function(traineeEmail, id, cb)
            {
                var query = {
                    traineeEmail : traineeEmail,
                    classId : id,
                    status: "Enrolled"
                };
                Classrecord.create(query).then(cb);
            },
        },
        tableName: 'class_record'
    });
    return Classrecord;
};
