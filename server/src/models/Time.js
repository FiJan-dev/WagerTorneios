const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Time = sequelize.define('Time', {
    id_time: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nome_time: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [3, 100],
        },
    },
    cidade_time: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            len: [0, 100],
        },
    },
    id_jogardor: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    tableName: 'times',
    timestamps: false,
});

module.exports = Time;