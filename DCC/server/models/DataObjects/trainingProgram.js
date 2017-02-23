var SequelizeDatatypes = require('sequelize');

module.exports =
{
    name:
    {
        type: SequelizeDatatypes.TEXT,
        allowNull: true
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
    courseTypeId:
    {
        type: SequelizeDatatypes.INTEGER,
        allowNull: true
    },
};
