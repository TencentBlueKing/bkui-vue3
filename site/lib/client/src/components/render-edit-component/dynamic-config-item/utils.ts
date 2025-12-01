import type { IProp } from '@/types/component';
import {
  useHighLightJs,
} from '@/hooks/use-highlighjs';
import {
  formatCodeIndent,
} from '../code/parser/script/script-parser';

export const basicTypeToDefVal = {
  'string': '',
  'number': 0,
  'boolean': false,
  'array': [] as const,
  'object': {},
  'function': `() => {}`,
}

export const splitType = (typeStr: string) => {
  const concretTypes = [];
  let stack = [];
  let current = '';
  const isEmptyStack = () => stack.length === 0;
  
  for (let i = 0; i < typeStr.length; i++) {
    const char = typeStr[i];
    switch (char) {
      case '<':
      case '(':
      case '[':
        stack.push(char);
        current += char;
        break;
      case '>':
      case ')':
      case ']':
        stack.pop();
        current += char;
        break;
      case '|':
        if (isEmptyStack()) {
          const type = current.trim();
          if (type) concretTypes.push(type);
          current = '';
        } else {
          current += char;
        }
        break;
      case ' ':
        if (!isEmptyStack() || /=>/.test(current)) {
          current += char;
        }
        break;
      default:
        current += char;
    }
  }
  
  const lastCur = current.trim()
  if (lastCur) {
    concretTypes.push(lastCur);
  }
  
  return concretTypes;
}


export const isGenericArrType = (type: string) => {
  return /^Array<[^>]+>$/.test(type)
}
// 匹配 string[] 或 number[][] 等形式
export const isArrayTypeLiteral = (type: string) => {
  return /^[^\[\]]*(\[\]){1,2}$/.test(type)
}
// 匹配元组类型 [string, number] 等形式
export const isTupleArrType = (type: string) => { 
  return /^\[.*\]$/.test(type);
}
export const isTypeArray = (type: string) => {
  return isGenericArrType(type) || isArrayTypeLiteral(type) || isTupleArrType(type) || type.trim().toLowerCase() === 'array';
}

export const isTypeFunction = (type: string) => {
  return type?.trim()?.toLowerCase()?.startsWith('function') ||  type.includes('=>');
}

export const factType = (type: string, options: IProp['options']) => {
  const basicType = type.trim().toLowerCase();
  if(basicType === 'boolean') {
    return basicType;
  }
  const isString = ['string', 'date'].includes(basicType);
  const isNumber = basicType === 'number';
  const isEnum = options && options.length > 0;
  if(isString && !isEnum) {
    return 'string';
  }
  if(isNumber && !isEnum) {
    return 'number';
  }
  if((isString && isEnum) || (isNumber && isEnum)) {
    return 'enum';
  }
  if(isTypeArray(type)) {
    return 'array';
  }
  if(isTypeFunction(type)) {
    return 'function';
  }
  return 'object';
};

export const isString = (value: unknown) => typeof value === 'string' || value instanceof String;
export const isNumber = (value: unknown) => typeof value === 'number' || value instanceof Number;
export const isBoolean = (value: unknown) => typeof value === 'boolean' || value instanceof Boolean;
export const isArray = (value: unknown) => Array.isArray(value)
export const isObject = (value: unknown) => Object.prototype.toString.call(value) === '[object Object]';

export const debounce = (func: Function, wait: number) => {
  let timeout: ReturnType<typeof setTimeout> | null;
  return function(this: any, ...args: any[]) {
    const later = () => {
      timeout = null;
      func.apply(this, args);
    };
    if (timeout) {
      clearTimeout(timeout);
    } 
    timeout = setTimeout(later, wait);
  };
}

export const valueType = (value: unknown, type: string): string => {
  // 默认type不存在时，将字符串包含 '=>' 的视为函数类型
  if(isString(value) && value.includes('=>') && (!type || isTypeFunction(type))) {
    return 'function';
  }
  if (isString(value)) {
    return 'string';
  } 
  if (isNumber(value)) {
    return 'number';
  } 
  if (isBoolean(value)) {     
    return 'boolean';
  } 
  if (isArray(value)) {
    return 'array';
  }
  if (isObject(value)) {
    return 'object';
  }
  return 'unknown';
}

/**
 * 注意：纯表示字符串也会识别成是函数
 * 判断匹配常见的函数格式
 * @param str 字符串
 * @returns true | false
 */
export const isFunctionFormatString = (str: string) => {
  const arrowFuncRegex = /\(?[^)]*\)?\s*=>\s*(?:\{[^{}]*\}|[^;]+)(?=\s*;|$)/
  const functionKeyRegex = /function\s+\w*\s*\([^)]*\)\s*\{/
  return functionKeyRegex.test(str) || arrowFuncRegex.test(str)
}

const jsonObjArrIsHasFunc = (obj: Object | unknown[]) => {
  const iterableObj = isArray(obj) ? obj.entries() : Object.entries(obj)
  for (const [_key, value] of iterableObj) {
    if((isObject(value) || isArray(value)) && jsonObjArrIsHasFunc(value)) {
      return true
    }
    if(isFunctionFormatString(value as string)) {
      return true
    }
  }
  return false
}
/**
 * 验证JSON字符串是否有函数字符串
 * @param jsonStr 字符串
 * @returns true | false
 */
export const jsonStrIsHasFunc = (jsonStr: string) => {
  if(jsonStr === 'null') return false
  try {
    const parse = JSON.parse(jsonStr)
    if(isString(parse)) return false
    if(isNumber(parse)) return false
    if(isBoolean(parse)) return false
    if(isArray(parse) || isObject(parse)) {
      return jsonObjArrIsHasFunc(parse)
    }
    return false
  } catch {
    return false
  }
}

const { highlightFactory } = useHighLightJs();
const jsonObjArrToFunc = (obj: Object | unknown[], isTypeScript: boolean, level = 0) => {
  const iterableObj = isArray(obj) ? obj.entries() : Object.entries(obj)
  let resultStr =  isArray(obj) ? '[<br>' : '{<br>'
  const innerIndent = level + 1
  let valueStr = `<div style="padding-left: ${innerIndent * 6}px">`
  for (const [key, value] of iterableObj) {
    if(isObject(obj)) {
      valueStr += `${key}:`
    }
    let newVal = value
    if((isObject(value) || isArray(value))) {
      newVal = jsonObjArrToFunc(value, isTypeScript, innerIndent + 1)
    }
    const isFunc = isFunctionFormatString(value as string)
    if(isString(value) && !isFunc) {
      newVal = `"${newVal}"`
    }
    if(isFunc) {
      newVal = highlightFactory(
        formatCodeIndent(value, 2, isTypeScript) || '--' , 'typescript'
      )
    }
    valueStr += `${newVal}<br>`
  }
  valueStr += '</div>'
  resultStr += valueStr + (isArray(obj) ? ']' : '}')
  return resultStr
}
/**
 * 高亮含有函数字符串
 * @param jsonStr json字符串
 * @param isTypeScript 语言类型
 * @returns 字符串
 */
export const funcStrToFunc = (jsonStr: string, isTypeScript: boolean) => {
  try {
    const parse = JSON.parse(jsonStr)
    if(isArray(parse) || isObject(parse)){
      return jsonObjArrToFunc(parse, isTypeScript)
    }
    return jsonStr
  } catch {
    return jsonStr
  }
}