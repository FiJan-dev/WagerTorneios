// models/EstatisticasJogador.js (adicione colunas novas)
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Jogador = require('./Jogador');

const Estatisticas = sequelize.define('Estatisticas', {
  id_estatistica: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  id_jogador: { type: DataTypes.INTEGER, allowNull: false, unique: true, references: { model: Jogador, key: 'id_jogador' } },
  // Stats básicas (já tinha)
  passes_certos: { type: DataTypes.INTEGER, defaultValue: 0 },
  finalizacoes: { type: DataTypes.INTEGER, defaultValue: 0 },
  gols_marcados: { type: DataTypes.INTEGER, defaultValue: 0 },
  assistencias: { type: DataTypes.INTEGER, defaultValue: 0 },
  cartoes_amarelos: { type: DataTypes.INTEGER, defaultValue: 0 },
  cartoes_vermelhos: { type: DataTypes.INTEGER, defaultValue: 0 },
  // Novas stats de scouts (exemplos)
  roubadas_bola: { type: DataTypes.INTEGER, defaultValue: 0 },        // Físico
  aceleracao: { type: DataTypes.INTEGER, defaultValue: 0 },          // Velocidade
  chute_forca: { type: DataTypes.INTEGER, defaultValue: 0 },         // Chute
  passe_total: { type: DataTypes.INTEGER, defaultValue: 0 },         // Passe
  drible: { type: DataTypes.INTEGER, defaultValue: 0 },              // Drible
  // Adicione mais: desarme, jogo_aereo, etc.
}, { tableName: 'estatisticas', timestamps: false });


module.exports = Estatisticas;