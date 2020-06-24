/**
 * @file index
 */
const AElf = require('aelf-sdk');
const {
  Scanner
} = require('aelf-block-scan');
const config = require('./config');

function cleanup() {
  console.log('cleanup');
  process.exit(1);
}

process.on('unhandledRejection', err => {
  console.log('unhandledRejection');
  console.error(err);
  cleanup();
});


async function init() {
  const aelf = new AElf(new AElf.providers.HttpProvider(config.scan.host));
  const scanner = new Scanner(new DBOperation({}), {
    ...config.scan,
    aelfInstance: aelf,
    interval: config.scan.interval,
    missingHeightList: []
  });
  try {
    await scanner.start();
    console.log('start loop');
  } catch (err) {
    console.error(err);
    cleanup();
  }
}

init();
