/* eslint-disable global-require */
const path = require('path');
const fs = require('fs');

async function getContractAddress() {
  const originResult = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../config.json')).toString());
  const result = {
    ...originResult,
    remoteData: 1234
  };
  fs.writeFileSync(path.resolve(__dirname, '../config.json'), `${JSON.stringify(result, null, 2)}\n`);
}

(async () => {
  await getContractAddress();
})();
