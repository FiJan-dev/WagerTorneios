'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('shortlist', 'id_usuario', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'olheiros', // nome da tabela de olheiros
        key: 'id_usuario'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    // Adicionar índice
    await queryInterface.addIndex('shortlist', ['id_jogador', 'id_usuario'], {
      unique: true,
      name: 'shortlist_unique_jogador_usuario'
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeIndex('shortlist', 'shortlist_unique_jogador_usuario');
    await queryInterface.removeColumn('shortlist', 'id_usuario');
  }
};