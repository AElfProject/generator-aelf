/**
 * @file plugin
 */
const path = require('path');
const configs = require('egg/config/plugin');

const prefix = '../../node_modules';
const isProd = process.env.NODE_ENV.toLowerCase() === 'production';

const result = {
  validate: {
    enable: true,
    package: 'egg-validate',
    path: path.resolve(prefix, 'egg-validate')
  },
  redis: {
    port: 6379,
    host: '127.0.0.1',
    path: path.resolve(prefix, 'egg-redis'),
    db: 1
  }
};

Object.entries(configs).forEach(([ key, value ]) => {
  result[key] = {
    ...value,
    path: path.resolve(prefix, value.package || value.name)
  };
});

if (isProd) {
  result.development.enable = false;
}

module.exports = result;
