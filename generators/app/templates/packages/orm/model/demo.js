/**
 * @file balance model
 */
const Sequelize = require('sequelize');
const { modalOptions } = require('../common/db');

const {
  Model,
  BIGINT,
  STRING,
  DECIMAL,
  fn
} = Sequelize;

const demoDescription = {
  id: {
    type: BIGINT,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
    field: 'id'
  },
  owner: {
    type: STRING(255),
    allowNull: false
  },
  symbol: {
    type: STRING(255),
    allowNull: false,
    defaultValue: 'none'
  },
  balance: {
    type: DECIMAL(64, 8),
    allowNull: false,
    defaultValue: 0
  },
  count: {
    type: BIGINT,
    allowNull: false,
    defaultValue: 0
  }
};

class Demo extends Model {

  static async getCount() {
    const result = await Demo.findOne({
      attributes: [
        [fn('COUNT', 1), 'total']
      ]
    });
    if (!result) {
      return {};
    }
    return result.toJSON();
  }
}

Demo.init(demoDescription, {
  ...modalOptions,
  tableName: 'demo'
});

module.exports = {
  Demo,
  demoDescription
};
