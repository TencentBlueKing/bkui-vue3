import dayjs from 'dayjs';

/**
 * 检查是不是 object 类型
 * @param item
 * @returns {boolean}
 */
export function isObject(item: any) {
  return Object.prototype.toString.apply(item) === '[object Object]';
}

/**
 * 时间格式化
 * @param val 待格式化时间
 * @param format 格式
 * @returns 格式化后的时间
 */
export function timeFormatter(val: string, format = 'YYYY-MM-DD HH:mm:ss') {
  return val ? dayjs(val).format(format) : '--';
}

/**
 * 深度合并多个对象
 * @param objectArray 待合并列表
 * @returns {object} 合并后的对象
 */
export function deepMerge(...objectArray: object[]) {
  return objectArray.reduce((acc: any, obj: any) => {
    Object.keys(obj || {}).forEach((key) => {
      const pVal = acc[key];
      const oVal = obj[key];

      if (isObject(pVal) && isObject(oVal)) {
        acc[key] = deepMerge(pVal, oVal);
      } else {
        acc[key] = oVal;
      }
    });

    return acc;
  }, {});
}
