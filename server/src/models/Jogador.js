const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Time = require('./Time');

const Jogador = sequelize.define('Jogador', {
    id_jogador: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nome_jogador: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    posicao_jogador: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    id_time: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    idade: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    altura_cm: { type: DataTypes.INTEGER, allowNull: true },
    peso_kg: { type: DataTypes.INTEGER, allowNull: true },
}, {
  tableName: 'jogadores',
  timestamps: false,
});

module.exports = Jogador;