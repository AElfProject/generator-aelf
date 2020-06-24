/**
 * @file app
 */
const { Demo } = require('<%= name %>-orm');

module.exports = app => {
  app.model = {
    Demo
  };
};
