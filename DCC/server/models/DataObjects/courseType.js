var SequelizeDatatypes = require('sequelize');

module.exports=
{
    name:
    {
        type: SequelizeDatatypes.TEXT,
        allowNull: false
    },
    discription:
    {
        type: SequelizeDatatypes.TEXT,
        allowNull: false
    },
}
