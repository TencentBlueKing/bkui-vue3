import dayjs from 'dayjs';

/**
 * 检查是不是 object 类型
 * @param item
 * @returns {boolean}
 */
export function isObject(item: unknown) {
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
 * @returns 合并后的对象
 */
export function deepMerge<T extends Record<string, unknown>>(...objectArray: Partial<T>[]): T {
  return objectArray.reduce((acc: Record<string, unknown>, obj: Partial<T>) => {
    if (!obj) return acc;

    Object.keys(obj).forEach((key) => {
      const pVal = acc[key];
      const oVal = obj[key];

      if (isObject(pVal) && isObject(oVal)) {
        acc[key] = deepMerge(pVal as T, oVal as T);
      } else if (oVal !== undefined) {
        acc[key] = oVal;
      }
    });

    return acc;
  }, {} as Record<string, unknown>) as T;
}

/**
 * @description 首字母大写转换
 * @param word 待转换的单词
 * @returns 首字母大写后的单词
 */
export function capitalizeWord(word: string) {
  if (!word) return '';
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}
