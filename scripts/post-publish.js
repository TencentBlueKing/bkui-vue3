const fs = require('fs');
const path = require('path');

const PACKAGE_PATH = path.join(__dirname, '../package.json');
fs.unlinkSync(PACKAGE_PATH);

const PACKAGE_TMP_PATH = path.join(__dirname, '../package.json.tmp');
const readStream = fs.createReadStream(PACKAGE_TMP_PATH);
const writeStream = fs.createWriteStream(PACKAGE_PATH);
readStream.pipe(writeStream);
writeStream.on('finish', () => {
  fs.unlinkSync(PACKAGE_TMP_PATH);
});
writeStream.on('error', (err) => {
  console.error('复制回 package.json 错误', err);
});
