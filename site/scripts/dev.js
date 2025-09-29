const path = require('path');
const nodemon = require('nodemon');
const chalk = require('chalk');
const { runDev } = require('@blueking/cli-service');

const backendDir = path.resolve(__dirname, '../lib/server');
const sharedDir = path.resolve(__dirname, '../lib/shared');
const releaseZipsDir = path.resolve(__dirname, '../lib/server/release-dir');
const releaseDistDir = path.resolve(__dirname, '../lib/server/release-dist');

function startServer() {
  nodemon({
    script: path.resolve(backendDir, 'app.browser.js'),
    watch: [
      backendDir,
      sharedDir,
    ],
    ignore: [
      releaseZipsDir,
      releaseDistDir,
    ],
    nodeArgs: [
      '--inspect',
    ],
    ext: 'js',
  })
    .once('start', () => {
      runDev();
    })
    .on('quit', () => {
      console.log('\n', chalk.yellow('API server has quit'), '\n');
      process.exit();
    })
    .on('crash', () => {
      console.log('\n', chalk.red('API server crashed'), '\n');
    })
    .on('restart', () => {
      console.log('\n', chalk.yellow('API server restarted'), '\n');
    });
}

startServer();
