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
    traineeId:{
        type: SequelizeDatatypes.INTEGER,
        allowNull: false
    },
    comments: {
        type: SequelizeDatatypes.TEXT,
        allowNull: true
    },
    rating: {
        type: SequelizeDatatypes.INTEGER,
        allowNull: true
    }
}
