const sequelize = require('../config/database');

async function fixFotoPerfilColumn() {
  try {
    console.log('Alterando coluna foto_perfil para LONGTEXT...');
    
    // Executar SQL diretamente para alterar o tipo da coluna
    await sequelize.query('ALTER TABLE `olheiro` MODIFY COLUMN `foto_perfil` LONGTEXT;');
    
    console.log('Coluna foto_perfil alterada com sucesso para LONGTEXT!');
    process.exit(0);
  } catch (error) {
    console.error('Erro ao alterar coluna:', error);
    process.exit(1);
  }
}

fixFotoPerfilColumn();
