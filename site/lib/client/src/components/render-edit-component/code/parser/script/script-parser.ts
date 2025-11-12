import {
  IEmit,
  IProp,
} from "@/types/component";
import {
  BREAK_LINE,
  INDENT,
  typeForVue,
} from "../../constant";
import {
  toPascalCase,
} from "../template/template-parser";

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

// 代码缩进规范化函数
export const formatCodeIndent = (code: string, indentSize: number = 2, isTypeScript: boolean = true): string => {
  if (!code) return code;
  
  // 先去除前后的空行
  let trimmedCode = code.trim();
  
  // 规范化代码格式（逗号、冒号、箭头函数空格等）
  trimmedCode = normalizeCodeFormat(trimmedCode);
  
  // 如果不是TypeScript模式，去除类型注解
  if (!isTypeScript) {
    trimmedCode = removeTypeAnnotations(trimmedCode);
  }

  
  const lines = trimmedCode.split(BREAK_LINE);
  const result: string[] = [];
  let currentIndent = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trimEnd(); // 去除行尾空白
    const trimmedLine = line.trimStart(); // 去除行首空白用于判断内容
    
    // 跳过空行
    if (trimmedLine === '') {
      result.push('');
      continue;
    }
    
    // 计算缩进级别
    const indent = ' '.repeat(currentIndent * indentSize);
    
    // 处理缩进变化
    if (trimmedLine.endsWith('{') || trimmedLine.endsWith('(') || trimmedLine.endsWith('[')) {
      result.push(indent + trimmedLine);
      currentIndent++;
    } else if (trimmedLine.startsWith('}') || trimmedLine.startsWith(')') || trimmedLine.startsWith(']')) {
      currentIndent = Math.max(0, currentIndent - 1);
      const newIndent = ' '.repeat(currentIndent * indentSize);
      result.push(newIndent + trimmedLine);
    } else {
      result.push(indent + trimmedLine);
    }
  }
  
  // 去除结果中尾部的空行
  while (result.length > 0 && result[result.length - 1] === '') {
    result.pop();
  }
  
  let formattedCode = result.join(BREAK_LINE);
  
  // 确保代码以分号结尾（如果最后一个非空字符不是分号、花括号、方括号或圆括号）
  const lastChar = formattedCode.trim().slice(-1);
  if (lastChar && ![')', '}', ']', ';'].includes(lastChar)) {
    formattedCode += ';';
  }
  
  return formattedCode;
};

export const parseEvents = (events: Record<string, string>, isTypeScript: boolean) => {
  return Object.entries(events).map(([key, value]) => {
    // 规范化事件处理函数的缩进，并根据isTypeScript决定是否保留类型注解
    const formattedValue = formatCodeIndent(value, 2, isTypeScript);
    return `const handle${toPascalCase(key)} = ${formattedValue}`;
  }).join(BREAK_LINE.repeat(2));
};

export const collectLinkTypeInEmits = (emits: IEmit[], curEmitName: string)=> {
  const curEmitParams = emits.find(item => item.name === curEmitName)?.params || [];
  return curEmitParams.filter(item => item.link).map(item => item.type);
};

// 从嵌套泛型类型中提取所有类型名称
// 例如: "ComputedRef<any>" => ["ComputedRef"]
// 例如: "Required<Array<Computed<any>>>" => ["Required", "Array", "Computed"]
const extractTypeNamesFromGeneric = (typeStr: string): string[] => {
  const typeNames: string[] = [];
  // 匹配所有类型名称（大写字母开头的标识符，后面可能跟着<）
  const typePattern = /([A-Z][a-zA-Z0-9_]*)\s*(?:<|$)/g;
  let match;
  while ((match = typePattern.exec(typeStr)) !== null) {
    typeNames.push(match[1]);
  }
  return typeNames;
};

export const collectVueTypeInEmits = (emits: IEmit[], curEmitName: string)=> {
  const curEmitParams = emits.find(item => item.name === curEmitName)?.params || [];
  const vueTypes: string[] = [];
  
  curEmitParams.forEach(item => {
    // 从类型字符串中提取所有类型名称
    const typeNames = extractTypeNamesFromGeneric(item.type);
    // 检查是否有任何类型名称在 typeForVue 列表中
    typeNames.forEach(typeName => {
      if (typeForVue.includes(typeName) && !vueTypes.includes(typeName)) {
        vueTypes.push(typeName);
      }
    });
  });
  
  return vueTypes;
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

// 去除箭头函数参数中的TypeScript类型注解
const removeTypeAnnotations = (code: string): string => {
  // 匹配箭头函数参数部分: (param1: type1, param2: type2) =>
  const arrowFunctionPattern = /\(([^)]+)\)\s*=>/;
  
  return code.replace(arrowFunctionPattern, (match, params) => {
    // 去除参数中的类型注解
    // 匹配模式: paramName: Type 或 paramName: Type<Generic>
    const cleanedParams = params.replace(/:\s*[^,)]+/g, '');
    return `(${cleanedParams}) =>`;
  });
};

// 代码格式规范化函数
const normalizeCodeFormat = (code: string): string => {
  let normalized = code;
  
  // 1. 规范化逗号后的空格：确保逗号后有一个空格
  normalized = normalized.replace(/,(\S)/g, ', $1');
  
  // 2. 规范化冒号后的空格：确保冒号后有一个空格（仅处理类型注解，不处理对象属性）
  // 匹配参数类型注解的冒号，如 param:type 或 param: type
  // 匹配冒号后跟字母（大小写）、数字、下划线、< 或 { 的情况
  normalized = normalized.replace(/(\w+):\s*([a-zA-Z_<{])/g, '$1: $2');
  
  // 3. 规范化箭头函数的空格：确保 => 前后都有空格
  normalized = normalized.replace(/\)\s*=>\s*\{/g, ') => {');
  
  return normalized;
};
