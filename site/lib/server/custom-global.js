import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';

/**
 * 业务错误，用于非500错误信息，由接口自行处理错误
 * @param {*} message // 错误的信息，非必填，默认 “服务器出现业务错误”
 * @param {*} code // 错误码，非必填，默认 499
 * @param {*} data // 错误数据，非必填
 */
function BusinessError(message = '服务器错误', code = -1, status = 200, stack = (new Error()).stack, data) {
  this.name = 'BusinessError';
  this.status = status;
  this.message = message;
  this.code = code;
  this.data = data;
  this.stack = stack;
}
BusinessError.prototype = Object.create(Error.prototype);
BusinessError.prototype.constructor = BusinessError;

global.BusinessError = BusinessError;

const loadEnv = (filePath) => {
  if (fs.existsSync(filePath)) {
    dotenvExpand.expand(dotenv.config({
      path: filePath,
    }));
  }
};
// 加载 .bk.local.env 文件，优先级最高
loadEnv(path.resolve(__dirname, '../../.bk.local.env'));
// 加载 .bk.{mode}.env 文件，优先级其次
loadEnv(path.resolve(__dirname, `../../.bk.${process.env.NODE_ENV}.env`));
// 加载 .bk.env 文件，优先级最低
loadEnv(path.resolve(__dirname, '../../.bk.env'));
