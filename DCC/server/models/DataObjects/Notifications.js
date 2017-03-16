var SequelizeDatatypes = require('sequelize');


module.exports =
    {
        email:
        {
            type: SequelizeDatatypes.STRING,
            allowNull: false
        },
        title:
        {
            type: SequelizeDatatypes.STRING,
            allowNull: true
        },
        content:
        {
            type: SequelizeDatatypes.STRING,
            allowNull: true
        },
        status:
        {
            type: SequelizeDatatypes.INTEGER,
            allowNull: true
        }
    }

