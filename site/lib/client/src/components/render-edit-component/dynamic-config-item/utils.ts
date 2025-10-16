import type { IComponentWiki } from '@/types/component';

export const isBasicTypeArr = (type: string) => {
  const basicTypes = ['string[]', 'number[]', 'boolean[]'];
  return basicTypes.includes(type.toLowerCase());
}

export const factType = (type: string, options: IComponentWiki['props'][number]['options'], complexTypes: IComponentWiki['types']) => {
  const basicType = type.toLowerCase();
  if(basicType === 'boolean') {
    return basicType;
  }
  const isString = basicType === 'string';
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
  if(/\[\]$/.test(type) && (isComplexType || isBasicTypeArr(type))) {
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
