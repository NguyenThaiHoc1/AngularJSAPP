var _classModel = require("./DataObjects/class");
module.exports = function (sequelize) {
    var Class = sequelize.define('Class', _classModel, {
        charset: 'utf8',
        collate: 'utf8_unicode_ci',
        classMethods: {
            getOpeningClassByCourseID: function (courseId, cb) {
                var query = {
                    where:
                    {
                        startTime:
                        {
                            $gt: Date.now()
                        },
                        courseId: courseId
                    }
                };
                Class.findOne(query).then(cb);
            },
            getUserInClass: function (classId, cb) {
                sequelize.query('SELECT us.*'
                    + ' FROM class cl, class_record clr, user us '
                    + 'where cl.id = :classId and cl.id = clr.classId and us.id = clr.traineeId',
                    { replacements: { classId: classId }, type: sequelize.QueryTypes.SELECT }
                ).then(cb);
            }
        },
        tableName: 'class',
        timestamps: false
    });
    return Class;
};
