const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME || 'wagerdb',
    process.env.DB_user || 'dev',
    process.env.DB_PASSWORD || '1234',
    {
        host: process.env.DB_HOST || 'db',
        dialect: 'mysql',
        logging: false,
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    }
);

sequelize.authenticate()
    .then(() => console.log('Conexão com o banco de dados estabelecida com sucesso.'))
    .catch(err => console.error('Não foi possível conectar ao banco de dados:', err));

module.exports = sequelize;