const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Campeonato = require('./Campeonato');
const Time = require('./Time');

const Partida = sequelize.define('Partida', {
    id_partida: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_campeonato: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    id_time_casa: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            async notEqualVisitante(value) {
                if (value === this.id_time_visitante) {
                    throw new Error('O time da casa não pode ser igual ao time visitante.');
                }
            }
        }
    },
    id_time_visitante: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    data_partida: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            isDate: true,
        },
    },
    local_partida: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    placar_casa: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    placar_visitante: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
}, {
    tableName: 'partidas',
    timestamps: false,
});

// Associações
Partida.belongsTo(Campeonato, { foreignKey: 'id_campeonato'});
Partida.belongsTo(Time, { as: 'timeCasa', foreignKey: 'id_time_casa' });
Partida.belongsTo(Time, { as: 'timeVisitante', foreignKey: 'id_time_visitante' });

module.exports = Partida;