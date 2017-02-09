var _classModel = require("./DataObjects/class");
module.exports = function(sequelize) {
    var Class = sequelize.define('Class', _classModel, {
        classMethods: {
            getClass: function(cb)
            {
                Class.findAll().then(cb);
            },

            getClassByID: function(id, cb)
            {
                var query ={
                    where:
                    {
                        id: id
                    }
                };
                Class.findOne(query).then(cb);
            },

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

            getClassByName: function(name, cb)
            {
                var query ={
                    where:
                    {
                        className: name
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
