/**
 * @file migrate config
 */
const developmentConfig = require('../../../config.dev.json.ejs');
const prodConfig = require('../../../config.prod.json.ejs');

module.exports = {
  development: {
    ...developmentConfig.sql,
    username: developmentConfig.sql.user,
    dialect: 'mysql',
    define: {
      timestamp: false,
      charset: 'utf8mb4'
    }
  },
  production: {
    ...prodConfig.sql,
    username: prodConfig.sql.user,
    dialect: 'mysql',
    define: {
      timestamp: false,
      charset: 'utf8mb4'
    }
  }
};
