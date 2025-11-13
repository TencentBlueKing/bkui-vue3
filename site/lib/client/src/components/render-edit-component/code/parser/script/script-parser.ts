import {
  IComponentWiki,
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

// 智能添加换行符，避免在模板字符串和函数参数中添加换行
const autoBreakLines = (code: string): string => {
  let result = '';
  let i = 0;
  let inTemplateString = false;
  let inFunctionParams = false;
  let parenDepth = 0;
  
  while (i < code.length) {
    const char = code[i];
    const nextChar = code[i + 1];
    const prevChar = i > 0 ? code[i - 1] : '';
    
    // 检测模板字符串
    if (char === '`') {
      inTemplateString = !inTemplateString;
      result += char;
      i++;
      continue;
    }
    
    // 在模板字符串内部，不做任何处理
    if (inTemplateString) {
      result += char;
      i++;
      continue;
    }
    
    // 跟踪括号深度，判断是否在函数参数中
    if (char === '(') {
      parenDepth++;
      // 检查是否是箭头函数的参数开始
      if (i === 0 || code.substring(Math.max(0, i - 10), i).trim().match(/\w+$/)) {
        inFunctionParams = true;
      }
      result += char;
      i++;
      continue;
    }
    
    if (char === ')') {
      parenDepth--;
      result += char;
      // 检查是否是箭头函数参数结束
      if (parenDepth === 0 && nextChar && code.substring(i + 1, i + 4).trim().startsWith('=>')) {
        inFunctionParams = false;
      }
      i++;
      continue;
    }
    
    // 在函数参数中，不添加换行
    if (inFunctionParams && parenDepth > 0) {
      result += char;
      i++;
      continue;
    }
    
    // 在 { 后添加换行（如果后面不是换行）
    if (char === '{' && nextChar && nextChar !== '\n' && nextChar !== '\r') {
      result += char + '\n';
      i++;
      continue;
    }
    
    // 在 } 前添加换行（如果前面不是换行）
    if (char === '}' && prevChar && prevChar !== '\n' && prevChar !== '\r') {
      result += '\n' + char;
      i++;
      continue;
    }
    
    // 在分号后添加换行（如果后面不是换行且不是结尾）
    if (char === ';' && nextChar && nextChar !== '\n' && nextChar !== '\r' && nextChar !== ' ') {
      result += char + '\n';
      i++;
      continue;
    }
    
    result += char;
    i++;
  }
  
  return result;
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
  
  // 如果代码是单行的（没有换行符），则自动添加换行
  if (!trimmedCode.includes('\n') && !trimmedCode.includes('\r')) {
    trimmedCode = autoBreakLines(trimmedCode);
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
    
    // 获取行末字符
    const lastChar = trimmedLine.slice(-1);
    
    // 判断是否需要添加分号
    // 只有当行只包含单个闭合括号时才不加分号，其他情况都要检查
    const isOnlyClosingBracket = trimmedLine === '}' || trimmedLine === ')' || trimmedLine === ']';
    const needsSemicolon = !isOnlyClosingBracket && ![';', ',', '{', '(', '['].includes(lastChar);
    
    // 处理缩进变化
    if (trimmedLine.endsWith('{') || trimmedLine.endsWith('(') || trimmedLine.endsWith('[')) {
      result.push(indent + trimmedLine);
      currentIndent++;
    } else if (trimmedLine.startsWith('}') || trimmedLine.startsWith(')') || trimmedLine.startsWith(']')) {
      currentIndent = Math.max(0, currentIndent - 1);
      const newIndent = ' '.repeat(currentIndent * indentSize);
      // 对于闭合括号行，也检查是否需要分号
      const lineToAdd = needsSemicolon ? trimmedLine + ';' : trimmedLine;
      result.push(newIndent + lineToAdd);
    } else {
      // 普通行，检查是否需要添加分号
      const lineToAdd = needsSemicolon ? trimmedLine + ';' : trimmedLine;
      result.push(indent + lineToAdd);
    }

  }

  
  // 去除结果中尾部的空行
  while (result.length > 0 && result[result.length - 1] === '') {
    result.pop();
  }
  
  let formattedCode = result.join(BREAK_LINE);
  
  // 确保代码以分号结尾（如果最后一个非空字符不是分号）
  const lastChar = formattedCode.trim().slice(-1);
  if (lastChar && lastChar !== ';') {
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

// 从嵌套泛型类型中提取所有类型名称
// 例如: "ComputedRef<any>" => ["ComputedRef"]
// 例如: "Required<Array<Computed<any>>>" => ["Required", "Array", "Computed"]
// 例如: "{ selected: boolean, node: TreeNode }" => ["TreeNode"]
export const extractTypeNamesFromGeneric = (typeStr: string): string[] => {
  const typeNames: string[] = [];
  // 匹配所有类型名称（大写字母开头的标识符）
  // 类型名称后面可以跟着: <, >, }, ), ], ,, ;, 空格, 或字符串结尾
  const typePattern = /([A-Z][a-zA-Z0-9_]*)(?=\s*[<>},)\];:\s]|$)/g;
  let match;
  while ((match = typePattern.exec(typeStr)) !== null) {
    typeNames.push(match[1]);
  }
  return typeNames;
};


// 从事件函数参数中提取所有类型
// 例如: "(xx: AType, yy: BType, zz: Q<CType>) => {}" => ["AType", "BType", "Q", "CType"]
// 例如: "(node: { selected: boolean, node: TreeNode }) => {}" => ["TreeNode"]
export const extractTypesFromEventParams = (eventValue: string): string[] => {
  // 匹配函数参数部分: (param1: Type1, param2: Type2) =>
  const paramsMatch = eventValue.match(/\(([^)]*)\)\s*=>/);
  if (!paramsMatch) {
    return [];
  }
  
  const paramsStr = paramsMatch[1];
  const allTypes: string[] = [];
  
  // 智能分割参数，考虑嵌套的花括号、尖括号
  const params = smartSplitParams(paramsStr);
  
  params.forEach(param => {
    // 匹配参数类型: paramName: Type
    const typeMatch = param.match(/:\s*(.+)$/);
    if (typeMatch) {
      const typeStr = typeMatch[1].trim();
      // 使用extractTypeNamesFromGeneric提取类型名称
      const typeNames = extractTypeNamesFromGeneric(typeStr);
      allTypes.push(...typeNames);
    }
  });
  
  return allTypes;
};

// 智能分割参数字符串，考虑嵌套的括号
// 例如: "a: string, b: { x: number, y: Type }, c: Array<T>" => ["a: string", "b: { x: number, y: Type }", "c: Array<T>"]
const smartSplitParams = (paramsStr: string): string[] => {
  const params: string[] = [];
  let current = '';
  let depth = 0; // 跟踪嵌套深度（花括号和尖括号）
  
  for (let i = 0; i < paramsStr.length; i++) {
    const char = paramsStr[i];
    
    if (char === '{' || char === '<') {
      depth++;
      current += char;
    } else if (char === '}' || char === '>') {
      depth--;
      current += char;
    } else if (char === ',' && depth === 0) {
      // 只在顶层逗号处分割
      if (current.trim()) {
        params.push(current.trim());
      }
      current = '';
    } else {
      current += char;
    }
  }
  
  // 添加最后一个参数
  if (current.trim()) {
    params.push(current.trim());
  }
  
  return params;
};

export const collectAllITypes = (types: IComponentWiki['types']) => {
  if (!types || types.length === 0) {
    return [];
  }

  const typeSet = new Set<string>();

  // 1. 收集第一层的name
  types.forEach(type => {
    typeSet.add(type.name);
  });

  // 2. 遍历fields，收集类型信息
  types.forEach(type => {
    type.fields.forEach(field => {
      // 优先从link中提取类型（link格式: /component/xxx/api#TypeName）
      if (field.link) {
        const linkStr = typeof field.link === 'string' ? field.link : Object.values(field.link)[0];
        const match = linkStr.match(/\/api#(.+)$/);
        if (match) {
          typeSet.add(match[1]);
        }
      }
      
      // 从type字段中提取泛型类型（如 Array<ICommonItem> => ICommonItem）
      if (field.type) {
        const genericMatch = field.type.match(/<([^<>]+)>/);
        if (genericMatch) {
          // 提取泛型中的类型名，去除可能的修饰符（如Omit<ICommonItem, "xxx">）
          const innerType = genericMatch[1];
          const typeNameMatch = innerType.match(/^([A-Z][a-zA-Z0-9_]*)/);
          if (typeNameMatch) {
            typeSet.add(typeNameMatch[1]);
          }
        }
      }
    });
  });

  // 3. 去重并返回数组
  return Array.from(typeSet);
}



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
