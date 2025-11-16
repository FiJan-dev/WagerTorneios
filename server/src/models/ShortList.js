const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Jogador = require('./Jogador'); 
const Usuario = require('./Usuario'); 

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
            model: 'jogadores',
            key: 'id_jogador'
        }
    },

    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'usuarios', 
            key: 'id_usuario'
        }
    }
}, {
    tableName: 'shortlist',
    timestamps: false
});

// Associações
Shortlist.belongsTo(Jogador, { foreignKey: 'id_jogador', targetKey: 'id_jogador' });
Shortlist.belongsTo(Usuario, { foreignKey: 'id_usuario', targetKey: 'id_usuario' }); 

module.exports = Shortlist;