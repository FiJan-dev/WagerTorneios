const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Comentarios = sequelize.define('Comentarios', {
    id_comentarios: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    texto_comentarios: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    id_jogador: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'comentarios',
    timestamps: false,
});
module.exports = Comentarios;