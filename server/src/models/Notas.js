const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Notas = sequelize.define('Notas', {
    id_nota: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_olheiro: {
    type: DataTypes.INTEGER,
    allowNull: false,
    },
    id_jogador: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    nota: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
        min: 1,
        max: 5,
        },
    },
}, {
    tableName: 'notas',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['id_olheiro', 'id_jogador']
        }
    ]
});

module.exports = Notas;