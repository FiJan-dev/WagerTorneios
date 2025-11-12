const Jogador = require('./Jogador');
const Time = require('./Time');
const Campeonato = require('./Campeonato');
const Partida = require('./Partida');
const Olheiro = require('./Olheiro');
const Comentarios = require('./Comentarios');
const Estatisticas = require('./Estatisticas');
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
  }
}, {
  tableName: 'shortlist',
  timestamps: false
});

// Associações
Jogador.belongsTo(Time, { foreignKey: 'id_time' });
Time.hasMany(Jogador, { foreignKey: 'id_time' });

Comentarios.belongsTo(Jogador, { foreignKey: 'id_jogador' });
Jogador.hasMany(Comentarios, { foreignKey: 'id_jogador' });

Jogador.hasOne(Estatisticas, { foreignKey: 'id_jogador', onDelete: 'CASCADE' });
Estatisticas.belongsTo(Jogador, { foreignKey: 'id_jogador' });

Jogador.hasOne(Shortlist, { foreignKey: 'id_jogador' });
Shortlist.belongsTo(Jogador, { foreignKey: 'id_jogador' });

module.exports = {
  Jogador,
  Time,
  Campeonato,
  Partida,
  Olheiro,
  Comentarios,
  Estatisticas,
  Shortlist
};