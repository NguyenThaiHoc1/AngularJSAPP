var SequelizeDatatypes = require('sequelize');

module.exports =
    {
        // 1: enrolled,
        // 2: passed
        userId:
        {
            type: SequelizeDatatypes.INTEGER,
            allowNull: true
        },
        courseId:
        {
            type: SequelizeDatatypes.INTEGER,
            allowNull: true
        },
        requestType:
        {
            type: SequelizeDatatypes.STRING,
            allowNullL: false
        },
        requestTime:
        {
            type: SequelizeDatatypes.DATE,
            allowNull: true
        }
    }
