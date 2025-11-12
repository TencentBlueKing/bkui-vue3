export const generateHtmlTag = (
  labelName: string,
  type: 'start' | 'end' = 'end',
  suffix = '',
) => {
  if (type === 'start') {
    let curSuffix = suffix ? ` ${suffix}` : '';
    return `<${labelName}${curSuffix}>`;
  } else {
    return `<\/${labelName}>`;
  }
};

// 驼峰式转连字符格式
export const camelToKebab = (str: string): string => {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
};