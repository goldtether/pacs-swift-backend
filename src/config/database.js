const { Sequelize } = require('sequelize');
require('dotenv').config();

// ЕСЛИ НЕТ БАЗЫ ДАННЫХ, ИСПОЛЬЗУЙТЕ SQLITE
let sequelize;

if (process.env.DATABASE_URL) {
  // Для облачных сервисов (Railway, Render)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  });
} else {
  // Для локальной разработки
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false
  });
}

module.exports = sequelize;
