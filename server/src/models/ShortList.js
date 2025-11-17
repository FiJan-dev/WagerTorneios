// src/models/Shortlist.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Shortlist = sequelize.define('Shortlist', {
  id_shortlist: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_jogador: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'shortlist',
  timestamps: false
});

module.exports = Shortlist;