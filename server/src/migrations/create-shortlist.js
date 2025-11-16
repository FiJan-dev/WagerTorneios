'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('shortlist', {
      id_shortlist: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      id_jogador: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'jogadores',
          key: 'id_jogador'
        },
        onDelete: 'CASCADE'
      },

      id_usuario: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios', 
          key: 'id_usuario'
        },
        onDelete: 'CASCADE'
      }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('shortlist');
  }
};