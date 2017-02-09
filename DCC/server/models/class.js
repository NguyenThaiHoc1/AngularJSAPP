var _classModel = require("./DataObjects/class");
module.exports = function(sequelize) {
    var Class = sequelize.define('Class', _classModel, {
        classMethods: {
            getOpeningClassByCourseID: function(id, cb)
            {
                Class.findOne({
                    where:
                    {
                        startTime:
                        {
                            $gt: Date.now()
                        },
                        courseId: id
                    }}).then(cb);
                },
            },

            tableName: 'class',
            timestamps: false
        });
        return Class;
    };
