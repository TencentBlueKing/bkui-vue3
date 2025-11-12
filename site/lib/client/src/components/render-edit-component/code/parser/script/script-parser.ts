import { IProp } from "@/types/component";
import { BREAK_LINE, INDENT } from "../../constant";

export interface DependentData {
  list: string[];
  source: string;
  isType?: boolean;
}

// 递归格式化复杂值（对象/数组）
export const formatComplexValue = (obj: any, indentLevel = 1): string => {
  if (obj === null) {
    return 'null';
  }
  if (obj === undefined) {
    return 'undefined';
  }
  if (Array.isArray(obj)) {
    return formatComplexArray(obj, indentLevel);
  }
  if (typeof obj !== 'object') {
    return JSON.stringify(obj);
  }

  const entries = Object.entries(obj);
  const formatted = entries.map(([key, val]) => {
    let valueStr;
    if (val === null) {
      valueStr = 'null';
    } else if (val === undefined) {
      valueStr = 'undefined';
    } else if (typeof val === 'object') {
      valueStr = formatComplexValue(val, indentLevel + 1);
    } else {
      valueStr = JSON.stringify(val);
    }
    return `${INDENT.repeat(indentLevel)}${key}: ${valueStr},`;
  });
  return entries.length
    ? `{${BREAK_LINE}${formatted.join(BREAK_LINE)}${BREAK_LINE}${INDENT.repeat(indentLevel - 1)}}`
    : `{}`;
};

// 递归格式化复杂数组
const formatComplexArray = (arr: any[], indentLevel = 1): string => {
  // 判断是否为简单数组（所有元素都是基本类型或null/undefined）
  const isSimpleArray = arr.every(item => item === null
    || item === undefined
    || ['string', 'number', 'boolean'].includes(typeof item));

  if (isSimpleArray) {
    // 简单数组单行输出
    const items = arr.map((item) => {
      if (item === undefined) return 'undefined';  // 明确处理undefined
      if (item === null) return 'null';
      return typeof item === 'string' ? `'${item}'` : String(item);
    });
    return `[${items.join(', ')}]`;
  }

  // 复杂数组多行格式化
  const items = arr.map((item) => {
    if (item === undefined) return `${INDENT.repeat(indentLevel)}undefined,`;
    if (item === null) return `${INDENT.repeat(indentLevel)}null,`;
    if (typeof item === 'object') {
      return `${INDENT.repeat(indentLevel)}${formatComplexValue(item, indentLevel + 1)},`;
    }
    return `${INDENT.repeat(indentLevel)}${typeof item === 'string' ? `'${item}'` : item},`;
  });

  return `[${BREAK_LINE}${items.join(BREAK_LINE)}${BREAK_LINE}${INDENT.repeat(indentLevel - 1)}]`;
};

export const createValue = (curPropInfo: IProp, value: unknown) => {
  let curValue;
  if (curPropInfo.type === 'string' || typeof value === 'string') {
    // 模板字符串处理
    if ((value as string).includes(BREAK_LINE)) {
      curValue = `\`${value}\``;
    } else {
      curValue = `'${value}'`;
    }
  } else if (curPropInfo.type === 'object' || typeof value === 'object') {
    if (Array.isArray(value)) {
      // 判断是否为简单数组（所有元素都不是对象）
      const isSimpleArray = value.every(item => typeof item !== 'object');
      curValue = isSimpleArray
        ? `[${value.map(v => JSON.stringify(v)).join(', ')}]`  // 简单数组不换行
        : formatComplexArray(value);  // 复杂数组换行
    } else {
      curValue = formatComplexValue(value);
    }
  } else {
    curValue = value;
  }
  return curValue;
};

// 生成依赖导入
export const createDependImport = (dependData: DependentData[]) => {
  return dependData.map(({ list, source, isType = false }) => {
    if (list.length === 0) return '';
    let typeStr = isType ? ' type' : '';
    return `import${typeStr} {${
      BREAK_LINE
    }${INDENT}${list.join(`,${
      BREAK_LINE
    }${INDENT}`)},${
      BREAK_LINE
    }} from '${source}';`;
  }).join(BREAK_LINE);
};