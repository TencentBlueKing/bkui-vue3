interface ICssRule {
  selector: string
  properties: {
    key: string
    value: string
  }[]
}

// 解析 CSS 字符串
export const parseCssString = (cssStr: string): ICssRule[] => {
  const rules: ICssRule[] = [];
  let remaining = cssStr.trim();
  
  while (remaining.length > 0) {
    const result = findCssRule(remaining);
    if (!result) break;
    
    rules.push(result.rule);  // 这里取 result.rule
    remaining = result.remaining;
  }
  
  return rules;
};

// 查找 CSS 规则
const findCssRule = (str: string): { rule: ICssRule, remaining: string } | null => {
  // 查找选择器（直到 { 之前）
  const selectorMatch = str.match(/^([^{]+)\{/);
  if (!selectorMatch) return null;
  
  const selector = selectorMatch[1].trim();
  const braceStart = selectorMatch.index + selectorMatch[0].length;
  
  // 查找对应的 }
  let braceCount = 1;
  let currentIndex = braceStart;
  
  while (currentIndex < str.length && braceCount > 0) {
    if (str[currentIndex] === '{') braceCount++;
    if (str[currentIndex] === '}') braceCount--;
    currentIndex++;
  }
  
  if (braceCount > 0) return null; // 没有找到匹配的 }
  
  const contentEnd = currentIndex - 1;
  const content = str.slice(braceStart, contentEnd);
  const properties = parseCssProperties(content);
  
  return {
    rule: {  // 这里返回 ICssRule 对象
      selector,
      properties
    },
    remaining: str.slice(currentIndex).trim()
  };
};

// 解析 CSS 属性
const parseCssProperties = (content: string): { key: string, value: string }[] => {
  const properties: { key: string, value: string }[] = [];
  const lines = content.split(';').filter(line => line.trim());
  
  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;
    
    const key = line.slice(0, colonIndex).trim();
    const value = line.slice(colonIndex + 1).trim();
    
    if (key && value) {
      properties.push({ key, value });
    }
  }
  
  return properties;
};

// 序列化 CSS 规则
export const serializeCssRules = (rules: ICssRule[], indentLevel: number = 0): string => {
  let result = '';
  
  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i];
    const indent = ' '.repeat(indentLevel);
    const propertyIndent = ' '.repeat(indentLevel + 2);
    
    // 选择器 { 换行
    result += `${rule.selector} {\n`;
    
    // 属性
    for (const prop of rule.properties) {
      result += `${propertyIndent}${prop.key}: ${prop.value};\n`;
    }
    
    // 结束 }
    result += `${indent}}`;
    
    // 规则之间换行
    if (i < rules.length - 1) {
      result += '\n\n';
    }
  }
  
  return result;
};

// 主函数
export const renderCssStyle = (cssStr: string): string => {
  const rules = parseCssString(cssStr);
  return serializeCssRules(rules);
};
