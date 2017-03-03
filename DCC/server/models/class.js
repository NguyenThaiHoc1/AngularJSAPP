var _classModel = require("./DataObjects/class");
module.exports = function(sequelize) {
    var Class = sequelize.define('Class', _classModel, {
        charset: 'utf8',
        collate: 'utf8_unicode_ci',
        classMethods: {
            getOpeningClassByCourseID: function(courseId, cb)
            {
                var query = {
                    where:
                    {
                        startTime:
                        {
                            $lt: Date.now()
                        },
                        courseId: courseId
                    }
                };
                Class.findOne(query).then(cb);
            }
        },

        tableName: 'class',
        timestamps: false
    });
    return Class;
};
