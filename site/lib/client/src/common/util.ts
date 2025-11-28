import { Message } from 'bkui-vue';
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

/**
 * @description 复制到剪切板
 * @param text 待复制的文本
 * @param hidePop 是否隐藏提示
 * @returns 复制成功
 */
export async function copyToClipboard(text: string, tips = '复制成功', hidePop = false) {
  try {
    // 优先使用现代Clipboard API
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      if (!hidePop) {
        Message({ theme: 'success', message: tips });
      }
      return true;
    }

    // 兼容旧浏览器的备用方案
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';  // 防止页面滚动
    document.body.appendChild(textarea);
    textarea.select();

    const result = document.execCommand('copy');
    document.body.removeChild(textarea);

    if (!hidePop) {
      Message({ theme: 'success', message: tips });
    }

    return result;
  } catch (err) {
    console.error('复制失败:', err);
    return false;
  }
};


// 辅助函数：连字符转驼峰
export function kebabToCamel(str: string) {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
};

// 辅助函数：驼峰转连字符
export function camelToKebab(str: string) {
  return str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
};

/**
 * 判断字符串是否是函数字符串
 */
export function isFunctionString(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  const trimmed = value.trim();
  // 检查是否包含箭头函数或 function 关键字
  // 支持格式：
  // - () => { ... }
  // - (param) => { ... }
  // - async () => { ... }
  // - function() { ... }
  // - async function() { ... }
  return /^\s*(async\s+)?(\([^)]*\)|[a-zA-Z_$][a-zA-Z0-9_$]*)\s*=>/.test(trimmed)
         || /^\s*(async\s+)?function\s*\(/.test(trimmed);
}