const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Campeonato = sequelize.define('Campeonato', {
    id_campeonato: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nome_campeonato: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [3, 100]
        }
    },
    data_inicio: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            isDate: true,
            isAfter: new Date().toISOString().split('T')[0]
        }
    },
    data_fim: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            isDate: true,
            isAfter(value) {
                if (new Date(value) <= new Date(this.data_inicio)) {
                    throw new Error('data_fim must be after data_inicio');
                }
            },
        },
    },
    local_campeonato: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
}, {
    tableName: 'campeonatos',
    timestamps: false,
});

module.exports = Campeonato;