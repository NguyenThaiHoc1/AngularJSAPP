var _classModel = require("./DataObjects/class");
module.exports = function(sequelize) {
    var Class = sequelize.define('Class', _classModel, {
        classMethods: {
            getOpeningClassByCourseID: function(id, cb)
            {
                var query = {
                    where:
                    {
                        startTime:
                        {
                            $gt: Date.now()
                        },
                        courseId: id
                    }
                };
                Class.findOne(query).then(cb);
            },
        },

        tableName: 'class',
        timestamps: false
    });
    return Class;
};
