var SequelizeDatatypes = require('sequelize');

module.exports=
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
    duration:
    {
        type: SequelizeDatatypes.TIME,
        allowNull: true
    },
    imgLink:
    {
        type: SequelizeDatatypes.TEXT,
        allowNull: false
    },
    documents:
    {
        type: SequelizeDatatypes.TEXT,
        allowNull: true
    },
    test:
    {
        type: SequelizeDatatypes.TEXT,
        allowNull: true
    },
    trainingProgramId:
    {
        type: SequelizeDatatypes.INTEGER,
        allowNull: false
    },
}
