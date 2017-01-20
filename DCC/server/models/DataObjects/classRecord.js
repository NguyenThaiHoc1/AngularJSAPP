var SequelizeDatatypes = require('sequelize');

module.exports=
{
    // 1: enrolled,
    // 2: passed
    status:
    {
        type: SequelizeDatatypes.STRING,
        allowNull: true
    },
    classId:
    {
        type: SequelizeDatatypes.INTEGER,
        allowNull: true
    },
    traineeEmail:
    {
        type: SequelizeDatatypes.STRING,
        allowNull: true
    }
}
