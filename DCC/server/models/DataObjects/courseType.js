var SequelizeDatatypes = require('sequelize');

module.exports=
{
    name:
    {
        type: SequelizeDatatypes.TEXT,
        allowNull: true
    },
    discription:
    {
        type: SequelizeDatatypes.TEXT,
        allowNull: true
    },
}
