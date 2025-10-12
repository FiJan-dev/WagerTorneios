const Jogador = require('./Jogador');
const Time = require('./Time');
const Campeonato = require('./Campeonato');
const Partida = require('./Partida');
const Olheiro = require('./Olheiro');

// Definir associações
Jogador.belongsTo(Time, { foreignKey: 'id_time' });
Time.hasMany(Jogador, { foreignKey: 'id_time' });

module.exports = {
  Jogador,
  Time,
  Campeonato,
  Partida,
  Olheiro
};