import fs from 'fs';

// 设置接口返回
export const send = (ctx, outputData) => {
  ctx.set('Content-Type', 'application/json');
  // ctx.bkLogger.info(json)
  ctx.body = JSON.stringify(outputData);
};

// 设置请求异常
export const throwError = (ctx, error) => {
  const {
    status = 500,
    code,
    message,
    data,
  } = error;

  ctx.status = status;
  ctx.body = {
    code,
    message,
    data,
  };
  console.error(error);
  // 调用日志记录下来
  ctx.app.emit('error', error, ctx);
};

// 发送 MCP 错误
export const throwMcpError = (ctx, error) => {
  ctx.status = error.status;
  ctx.body = {
    jsonrpc: '2.0',
    error: {
      code: error.code,
      message: error.message,
    },
  };

  console.error(error);
  // 调用日志记录下来
  ctx.app.emit('error', error, ctx);
};

/**
 * 移除字符串两端空格
 *
 * @param {String} str 待移除空格的字符串
 *
 * @return {String} 移除空格后的字符串
 */
export const trim = str => (str || '').replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');

/**
 * 错误码
 */
export const CODE = {
  HTTP: [
    // 请求无效 Bad Request
    400,
    // 未授权 Unauthorized
    401,
    // 禁止访问 Forbidden
    403,
    // 未找到 Not Found
    404,
    // 服务器错误 Internal Server Error
    500,
    // 网关错误 Bad Gateway
    502,
    // 服务不可用 Service Unavailable
    503,
    // 网关超时 Gateway Time-out
    504,
    // HTTP 版本不受支持 HTTP Version not supported
    505,
  ],
  // 业务逻辑错误，程序上并没有错误
  BIZ: {
    // 没有权限
    NO_PERM: 4010,
    // 项目未找到，项目被逻辑或物理删除报出
    PROJECT_NOT_FOUND: 4040,
    // 项目页面描述文件未找到
    JSON_NOT_FOUND: 4041,
    // 项目名称已经存在
    PROJECT_NAME_EXISTED: 4042,
    // 项目ID已经存在
    PROJECT_ID_EXISTED: 4043,
    // 未定义的业务逻辑错误
    NOT_DEFINED: 9999,
  },
};

/**
 * 判断文件是否是图片文件
 *
 * @param {String} filePath 文件路径
 *
 * @return {boolean} 是否是图片文件
 */
export const isImageFile = (filePath) => {
  const imageExtensions = ['.svg', '.png', '.jpg', '.jpeg', '.gif', '.webp'];
  return imageExtensions.some(ext => filePath.endsWith(ext));
};

/**
 * 判断请求是否是 ajax 异步请求
 *
 * @param {Object} req request 对象
 *
 * @return {boolean} 返回结果
 */
export const isAjaxReq = req => req.get('X-Requested-With') || (req.header.accept || '').indexOf('json') > -1;

/**
 * 将parentId列表转换为children树结构列表
 *
 * @param {Array} list 列表
 * @param {Number} pid 根parentId值
 * @param {String} childDataKey 子节点数据键名
 *
 * @return {Array} 树结构列表
 */
export const list2tree = (list = [], pid = -1, childDataKey = 'children') => {
  function tree(pid) {
    const arr = [];
    list.filter(item => item.parentId === pid)
      .forEach((item) => {
        arr.push({
          ...item,
          [childDataKey]: tree(item.id),
        });
      });
    return arr;
  }
  return tree(pid);
};

/**
 * 将列表路径打平并返回为以路径作为key的Map
 *
 * @param {Array} list 列表
 * @param {Number} pid 根parentId值
 *
 * @return {Map} 扁平的路径map
 */
export const flattenListPath = (list = [], pid = -1, prefixKey) => {
  function getPath(node) {
    if (node.parentId === pid) {
      return node.path;
    }
    const parent = list.find(item => item.id === node.parentId);
    return [node.path].concat(getPath(parent));
  }

  const flattenList = [];
  list.forEach((item) => {
    flattenList.push({
      ...item,
      fullPath: [].concat(getPath(item)),
    });
  });

  const pathMap = new Map();
  flattenList.forEach((item) => {
    const { fullPath, ...node } = item;
    if (prefixKey) {
      pathMap.set([item[prefixKey]].concat(fullPath.reverse()).join('/'), node);
    } else {
      pathMap.set(fullPath.reverse().join('/'), node);
    }
  });
  return pathMap;
};

export async function execSql(queryRunner, path) {
  const sqlBuffer = fs.readFileSync(path);
  const sqlString = sqlBuffer.toString();
  const sqlArr = [];
  let strCharNum = 0;
  let lastCharIndex = 0;
  for (let charIndex in sqlString) {
    charIndex = +charIndex;
    const sqlChar = sqlString[charIndex];
    if (sqlChar === ';' && sqlString.slice(charIndex + 1, charIndex + 8) !== 'base64,' && (strCharNum & 1) === 0) {
      const currentStr = sqlString.slice(lastCharIndex, charIndex + 1);
      sqlArr.push(currentStr);
      lastCharIndex = charIndex + 1;
    }
    if (/'|"|`/.test(sqlChar)) strCharNum++;
  }
  for (const sqlStr of sqlArr) {
    if (sqlStr) await queryRunner.query(sqlStr);
  }
}

export const splitSql = (sqlString) => {
  const sqlArr = [];
  let strCharNum = 0;
  let lastCharIndex = 0;
  for (let charIndex in sqlString) {
    charIndex = +charIndex;
    const sqlChar = sqlString[charIndex];
    if (sqlChar === ';' && sqlString.slice(charIndex + 1, charIndex + 8) !== 'base64,' && (strCharNum & 1) === 0) {
      const currentStr = sqlString.slice(lastCharIndex, charIndex + 1);
      sqlArr.push(currentStr);
      lastCharIndex = charIndex + 1;
    }
    if (/'|"|`/.test(sqlChar) && sqlString[charIndex - 1] !== '\\') strCharNum++;
  }
  return sqlArr;
};
