const fs = require('fs');
const path = require('path');
const package = require('../package.json');

const PACKAGE_PATH = path.join(__dirname, '../package.json');
fs.createReadStream(PACKAGE_PATH).pipe(fs.createWriteStream(path.join(__dirname, '../package.json.tmp')));

const readStream = fs.createReadStream(PACKAGE_PATH);
const writeStream = fs.createWriteStream(path.join(__dirname, '../package.json.tmp'));

readStream.pipe(writeStream);

writeStream.on('finish', () => {
  delete package.private;
  fs.writeFileSync(PACKAGE_PATH, JSON.stringify(package, null, 2), 'utf8');
});

writeStream.on('error', (err) => {
  console.error('复制到 package.json.tmp 错误', err);
});
