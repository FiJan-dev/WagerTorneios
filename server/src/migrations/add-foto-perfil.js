const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

async function addFotoPerfilColumn() {
  try {
    console.log('Verificando se a coluna foto_perfil existe...');
    
    const queryInterface = sequelize.getQueryInterface();
    const tableDescription = await queryInterface.describeTable('olheiro');
    
    if (!tableDescription.foto_perfil) {
      console.log('Adicionando coluna foto_perfil...');
      await queryInterface.addColumn('olheiro', 'foto_perfil', {
        type: DataTypes.TEXT('long'),
        allowNull: true,
        defaultValue: null,
      });
      console.log('Coluna foto_perfil adicionada com sucesso!');
    } else {
      console.log('Coluna foto_perfil já existe.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Erro ao adicionar coluna:', error);
    process.exit(1);
  }
}

addFotoPerfilColumn();
