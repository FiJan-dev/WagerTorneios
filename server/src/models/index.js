// src/models/index.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Jogador = require('./Jogador');
const Time = require('./Time');
const Campeonato = require('./Campeonato');
const Partida = require('./Partida');
const Olheiro = require('./Olheiro');
const Comentarios = require('./Comentarios');
const Estatisticas = require('./Estatisticas');
const Shortlist = require('./ShortList');
const Notas = require('./Notas');
// === ASSOCIAÇÕES ===

// Time ↔ Jogador
Jogador.belongsTo(Time, { foreignKey: 'id_time' });
Time.hasMany(Jogador, { foreignKey: 'id_time' });

// Comentários ↔ Jogador
Comentarios.belongsTo(Jogador, { foreignKey: 'id_jogador' });
Jogador.hasMany(Comentarios, { foreignKey: 'id_jogador' });

// Comentários ↔ Olheiro
Comentarios.belongsTo(Olheiro, { foreignKey: 'id_usuario' });
Olheiro.hasMany(Comentarios, { foreignKey: 'id_usuario' });

// Estatísticas ↔ Jogador
Jogador.hasOne(Estatisticas, { foreignKey: 'id_jogador', onDelete: 'CASCADE' });
Estatisticas.belongsTo(Jogador, { foreignKey: 'id_jogador' });

// Shortlist ↔ Jogador
Jogador.hasMany(Shortlist, { foreignKey: 'id_jogador' }); // <--- CORRIGIDO
Shortlist.belongsTo(Jogador, { foreignKey: 'id_jogador' });

// Shortlist ↔ Olheiro
Olheiro.hasMany(Shortlist, { foreignKey: 'id_usuario' }); // <--- ADICIONADO
Shortlist.belongsTo(Olheiro, { foreignKey: 'id_usuario' });

// Notas ↔ Olheiro
Olheiro.hasMany(Notas, {foreinkey: 'id_usuario' });
Notas.belongsTo(Olheiro, {foreignKey: 'id_usuario'});

// Notas ↔ Jogador
Jogador.hasMany(Notas, {foreinkey: 'id_jogador' });
Notas.belongsTo(Jogador, {foreignKey: 'id_jogador'});

module.exports = {
  Jogador,
  Time,
  Campeonato,
  Partida,
  Olheiro,
  Comentarios,
  Estatisticas,
  Shortlist,
  Notas
};