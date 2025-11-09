// scripts/cleanDB.js
const { sequelize } = require('../config/database');
(async () => {
  try {
    console.log('Conectando ao banco...');
    await sequelize.authenticate();
    console.log('Conexão OK. Limpando e recriando tabelas...');

    await sequelize.sync({ force: true });
    console.log('Banco de dados limpo e recriado com sucesso!');

    process.exit(0);
  } catch (err) {
    console.error('Erro ao limpar o banco:', err.message);
    process.exit(1);
  }
})();