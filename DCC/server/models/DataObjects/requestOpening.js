var SequelizeDatatypes = require('sequelize');

module.exports=
{
    // 1: enrolled,
    // 2: passed
    userEmail:
    {
        type: SequelizeDatatypes.STRING,
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
