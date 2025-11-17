const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Olheiro = sequelize.define('Olheiro', {
    id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    admin: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    aprovado: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0, // 0 = pendente, 1 = aprovado, 2 = rejeitado
    },
    nome_usuario: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [2, 100]
        },
    },
    email_usuario: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    senha_usuario: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    foto_perfil: {
        type: DataTypes.TEXT('long'),
        allowNull: true,
        defaultValue: null,
    },
}, {
    tableName: 'olheiro',
    timestamps: false,
});

module.exports = Olheiro;