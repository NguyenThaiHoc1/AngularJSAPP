var SequelizeDatatypes = require('sequelize');

module.exports =
{
    name:
    {
        type: SequelizeDatatypes.TEXT,
        allowNull: false
    },
    description:
    {
        type: SequelizeDatatypes.TEXT,
        allowNull: true
    },
    imgLink:
    {
        type: SequelizeDatatypes.TEXT,
        allowNull: true
    },
    traineeType:{
        type: SequelizeDatatypes.STRING,
        allowNull: false
    }
};
