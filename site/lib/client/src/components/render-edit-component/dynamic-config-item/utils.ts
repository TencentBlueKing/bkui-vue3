import type { IComponentWiki } from '@/types/component';

export const basicTypeToDefVal = {
  'string': '',
  'number': 0,
  'boolean': false,
  'array': [] as const,
  'object': {},
}

export const splitType = (type: string) => {
  return type.split('|').map(item => item.trim().replace(/'/g, '')).filter(item => item)
}

export const isBasicTypeArr = (type: string) => {
  const basicTypes = ['string[]', 'number[]', 'boolean[]'];
  return basicTypes.includes(type.toLowerCase());
}

export const extractArrayGeneric = (type: string): string | null => {
  const match = type.match(/^Array\s*<(.+?)>$/)
  if (match && match[1]) {
    return match[1].trim()
  }
  return null
}

export const isGenericArrType = (type: string) => {
  return /^Array<[^>]+>$/.test(type)
}

export const isArrayTypeLiteral = (type: string, isComplexType: boolean) => {
  if(/\[\]$/.test(type)) {
    if(isComplexType || isBasicTypeArr(type)) {
      return true
    }
  }
  return false
}

export const factType = (type: string, options: IComponentWiki['props'][number]['options'], complexTypes: IComponentWiki['types']) => {
  const basicType = type.toLowerCase();
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
  const isComplexType = complexTypes?.some(item => item.name === type);
  if(isGenericArrType(type) || isArrayTypeLiteral(type, isComplexType)) {
    return 'array';
  }
  if(isComplexType) {
    return 'object';
  }
  return 'errortype';
};

export const isString = (value: unknown) => typeof value === 'string' || value instanceof String;
export const isNumber = (value: unknown) => typeof value === 'number' || value instanceof Number;
export const isBoolean = (value: unknown) => typeof value === 'boolean' || value instanceof Boolean;
export const isArray = (value: unknown) => Array.isArray(value)
export const isObject = (value: unknown) => Object.prototype.toString.call(value) === '[object Object]';
