import type { IComponentWiki, IProp } from '@/types/component';

export const basicTypeToDefVal = {
  'string': '',
  'number': 0,
  'boolean': false,
  'array': [] as const,
  'object': {},
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

export const factType = (type: string, options: IComponentWiki['props'][number]['options']) => {
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
  if(basicType === 'function' || basicType.includes('=>')) {
    return 'errortype';
  }
  return 'object';
};

export const isString = (value: unknown) => typeof value === 'string' || value instanceof String;
export const isNumber = (value: unknown) => typeof value === 'number' || value instanceof Number;
export const isBoolean = (value: unknown) => typeof value === 'boolean' || value instanceof Boolean;
export const isArray = (value: unknown) => Array.isArray(value)
export const isObject = (value: unknown) => Object.prototype.toString.call(value) === '[object Object]';

// 暂未支持的可配置过滤掉
export const filterErrTypeProps = (props: IProp[]) => {
  const partValidTypeProps = (props ?? []).filter((item: IProp) => {
    const typeArr = [...new Set(splitType(item.type))];
    const factTypeList = typeArr.map((typeVal) => {
      return factType(typeVal, item.options);
    });
    return !factTypeList.every(factType => factType === 'errortype');
  });
  return partValidTypeProps.map((item: IProp) => {
    const typeArr = [...new Set(splitType(item.type))];
    if (typeArr.length === 1) {
      return item;
    }
    const validTypes = typeArr.filter((typeValF) => {
      const curFactType = factType(typeValF, item.options);
      return curFactType !== 'errortype';
    });
    item.type = validTypes.join(' |');
    return item;
  });
};

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

export const valueType = (value: unknown): string => {
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