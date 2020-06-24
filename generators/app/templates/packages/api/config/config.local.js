/**
 * @file config file
 */
const conf = require('../../../config');

module.exports = appInfo => {
  exports = {};
  const config = exports;

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_development';

  // add your config here
  config.middleware = [];

  config.security = {
    csrf: {
      enable: process.env.NODE_ENV === 'production'
    }
  };

  config.validate = {
    convert: true
  };

  return {
    ...config,
    ...conf
  };
};
