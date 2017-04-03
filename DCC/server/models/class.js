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
            },
            deleteClassByCourseID: function (courseID, cb) {
                Class.destroy({ where: { courseId: courseID } }).then(cb)
            },
            add: function (courseId, location, startTime, endTime, maxAttendant, cb) {
                Class.create({
                    courseId: courseId,
                    location: location,
                    startTime: startTime,
                    endTime: endTime,
                    maxAttendant: maxAttendant
                }).then(cb);
            },
            edit: function (id, location, startTime, endTime, maxAttendant, cb) {
                Class.update(
                    {
                        location: location,
                        startTime: startTime,
                        endTime: endTime,
                        maxAttendant: maxAttendant
                    },
                    {
                        where: {
                            id: id
                        }
                    }).then(cb);
            },
            getOpeningClassByID: function (id, cb) {
                Class.findOne({
                    where: {
                        id: id,
                        startTime:
                        {
                            $gt: Date.now()
                        }
                    }
                }).then(cb);
            },
            deleteClassByID: function (id, cb) {
                Class.destroy({ where: { id: id } }).then(cb)
            }
        },
        tableName: 'class',
        timestamps: false
    });
    return Class;
};
