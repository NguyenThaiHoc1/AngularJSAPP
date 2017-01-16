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
    requestTime:
    {
        type: SequelizeDatatypes.DATE,
        allowNull: true
    }
}
