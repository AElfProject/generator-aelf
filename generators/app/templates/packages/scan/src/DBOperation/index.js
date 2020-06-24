/**
 * @file dbOperation
 * @author atom-yang
 */
const {
  DBBaseOperation,
  QUERY_TYPE
} = require('aelf-block-scan');

class Operation extends DBBaseOperation {
  constructor(option) {
    super(option);
    this.lastTime = new Date().getTime();
  }

  init() {
    console.log('init');
  }

  async insert(data) {
    console.log('\n\n');
    const now = new Date().getTime();
    console.log(`take time ${now - this.lastTime}ms`);
    this.lastTime = now;
    const {
      type,
      bestHeight,
      LIBHeight,
      largestHeight
    } = data;
    console.log(`largest height ${largestHeight}`);
    switch (type) {
      case QUERY_TYPE.INIT:
        console.log('INIT');
        break;
      case QUERY_TYPE.MISSING:
        console.log('MISSING');
        await this.insertData(data);
        break;
      case QUERY_TYPE.GAP:
        console.log('GAP');
        console.log('LIBHeight', LIBHeight);
        await this.insertData(data);
        break;
      case QUERY_TYPE.LOOP:
        console.log('LOOP');
        console.log('bestHeight', bestHeight);
        console.log('LIBHeight', LIBHeight);
        await this.insertData(data);
        break;
      case QUERY_TYPE.ERROR:
        console.log('ERROR');
        break;
      default:
        break;
    }
  }

  async insertData(data) {
    console.log(data);
  }

  destroy() {}
}

module.exports = Operation;
