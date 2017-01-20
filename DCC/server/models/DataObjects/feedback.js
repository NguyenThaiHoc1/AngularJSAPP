var SequelizeDatatypes = require('sequelize');

module.exports=
{
    comments: {
        type: SequelizeDatatypes.TEXT,
        allowNull: true
    },
    rating: {
        type: SequelizeDatatypes.INTEGER,
        allowNull: true
    },
    userEmail:{
        type: SequelizeDatatypes.STRING,
        allowNull: false
    },
    classId:{
        type: SequelizeDatatypes.INTEGER,
        allowNull: false
    },
}
