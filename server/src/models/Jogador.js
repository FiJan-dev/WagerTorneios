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
    altura_cm: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    peso_kg: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    idade: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    passes_certos: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    gols_marcados: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    assistencias: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    cartoes_amarelos: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  cartoes_vermelhos: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  finalizacoes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
}, {
  tableName: 'jogadores',
  timestamps: false,
});

// Associação
Jogador.belongsTo(Time, { foreignKey: 'id_time' });

module.exports = Jogador;