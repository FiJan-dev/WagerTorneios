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
            async isWithinCampeonatoRange(value) {
                if (!this.id_campeonato) return; // Será validado no controller
                
                const campeonato = await Campeonato.findByPk(this.id_campeonato);
                if (!campeonato) {
                    throw new Error('Campeonato não encontrado.');
                }
                
                const dataPartida = new Date(value);
                const dataInicio = new Date(campeonato.data_inicio + 'T00:00:00');
                const dataFim = new Date(campeonato.data_fim + 'T23:59:59');
                
                if (dataPartida < dataInicio || dataPartida > dataFim) {
                    throw new Error(`A data da partida deve estar entre ${campeonato.data_inicio} e ${campeonato.data_fim}.`);
                }
            }
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