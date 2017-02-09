var _classModel = require("./DataObjects/class");
module.exports = function(sequelize) {
    var Class = sequelize.define('Class', _classModel, {
        classMethods: {
            getOpeningClassByCourseID: function(courseId, cb)
            {
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
            }
        },

        tableName: 'class',
        timestamps: false
    });
    return Class;
};
