const {
  demoDescription
} = require('../../model/demo');

const tableName = 'demo';

module.exports = {
  up: async queryInterface => {
    await queryInterface.createTable(tableName, demoDescription);
    await queryInterface.addIndex(
      tableName,
      {
        fields: [
          {
            attribute: 'owner'
          }
        ],
        name: 'owner'
      }
    );
  },
  down: queryInterface => queryInterface.dropTable(tableName)
};
