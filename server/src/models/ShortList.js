// src/models/Shortlist.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Jogador = require('./Jogador');
const Olheiro = require('./Olheiro'); // <--- ADICIONEI

const Shortlist = sequelize.define('Shortlist', {
  id_shortlist: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_jogador: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Jogador,
      key: 'id_jogador'
    }
  },
  id_usuario: { // <--- A COLUNA QUE FALTAVA!
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Olheiro,
      key: 'id_usuario'
    }
  }
}, {
  tableName: 'shortlist',
  timestamps: true, // <--- MUDA PARA true (tem createdAt/updatedAt)
});

// === ASSOCIAÇÕES CORRETAS ===
Shortlist.belongsTo(Jogador, { foreignKey: 'id_jogador' });
Shortlist.belongsTo(Olheiro, { foreignKey: 'id_usuario' });

Jogador.hasMany(Shortlist, { foreignKey: 'id_jogador' });
Olheiro.hasMany(Shortlist, { foreignKey: 'id_usuario' });

// Exporta apenas o Shortlist (os outros já estão em seus arquivos)
module.exports = Shortlist;