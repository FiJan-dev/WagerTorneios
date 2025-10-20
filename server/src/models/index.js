const Jogador = require('./Jogador');
const Time = require('./Time');
const Campeonato = require('./Campeonato');
const Partida = require('./Partida');
const Olheiro = require('./Olheiro');
const Comentarios = require('./Comentarios');

// Definir associações
Jogador.belongsTo(Time, { foreignKey: 'id_time' });
Time.hasMany(Jogador, { foreignKey: 'id_time' });
Comentarios.belongsTo(Jogador, { foreignKey: 'id_jogador' });
Jogador.hasMany(Comentarios, { foreignKey: 'id_jogador' });

module.exports = {
  Jogador,
  Time,
  Campeonato,
  Partida,
  Olheiro,
  Comentarios
};