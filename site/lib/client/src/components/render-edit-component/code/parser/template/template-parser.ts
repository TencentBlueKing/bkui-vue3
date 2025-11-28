import {
  BREAK_LINE,
  INDENT,
  iconsName,
} from '../../constant';
import {
  camelToKebab,
} from "../../util";

interface IElement {
  name: string
  props: {
    key: string
    value: any
  }[]
  emits: {
    event: string
    value: string
  }[]
  children: IElement[]
  isSlot?: boolean  // 新增字段，标记是否是 slot
  content?: string  // 新增：保存标签内的纯文本内容
}

// 转换为 PascalCase 格式
export const toPascalCase = (str: string, capitalizeFirst = true): string => {
  if (!str) return '';
  // 如果包含分隔符（-、_、空格），按分隔符拆分
  if (/[-_\s]/.test(str)) {
    const result = str
      .split(/[-_\s]+/)
      .filter(Boolean)
      .map(s => s ? s[0].toUpperCase() + s.slice(1).toLowerCase() : '')
      .join('');
    
    if (!capitalizeFirst && result.length > 0) {
      return result[0].toLowerCase() + result.slice(1);
    }
    return result;
  }
  
  // 如果没有分隔符，直接将首字母大写，其余字母小写
  const result = str[0].toUpperCase() + str.slice(1).toLowerCase();
  
  if (!capitalizeFirst && result.length > 0) {
    return result[0].toLowerCase() + result.slice(1);
  }
  
  return result;
};

// 从模板字符串中提取图标名称
export const extractIconNames = (template: string): string[] => {
  // 匹配所有开始标签
  const tagRegex = /<([a-zA-Z][a-zA-Z0-9-]*)/g;
  const foundIcons = new Set<string>();
  
  let match;
  while ((match = tagRegex.exec(template)) !== null) {
    const tagName = match[1];
    
    // 先尝试原样匹配（处理已经是正确PascalCase的情况，如 AngleUpFill）
    if (iconsName.includes(tagName)) {
      foundIcons.add(tagName);
      continue;
    }
    
    // 只对全小写的标签进行 PascalCase 转换（如 close → Close）
    if (tagName === tagName.toLowerCase()) {
      const pascalCaseTagName = toPascalCase(tagName);
      if (iconsName.includes(pascalCaseTagName)) {
        foundIcons.add(pascalCaseTagName);
      }
    }
  }
  
  return Array.from(foundIcons);
};

export const parseStringTemplate = (str: string): IElement[] => {
  const elements = [];
  let remaining = str.trim();
  
  while (remaining.length > 0) {
    const tag = findOuterTag(remaining);
    if (!tag) break;
    
    const isSlot = tag.tagName === 'template';
    
    let textContent = '';
    let childrenContent = '';
    
    if (tag.type === 'normal') {
      if (!hasChildTags(tag.content)) {
        textContent = tag.content.trim();
      } else {
        childrenContent = tag.content;
      }
    }
    
    // 构建 IElement
    const element: IElement = {
      name: tag.tagName,  // 直接使用原始标签名，不做转换
      props: parseAttributes(tag.attributes),
      emits: parseEmits(tag.attributes),
      children: childrenContent ? parseStringTemplate(childrenContent) : [],
      content: textContent,
      isSlot: isSlot
    };
    
    elements.push(element);
    remaining = tag.remaining;
  }
  return elements;
};

// 修改序列化函数中的 emits 输出
export const serializeElementTree = (elements: IElement[], indentLevel: number = 0, isRoot: boolean = false): string => {
  let result = '';
  const indent = ' '.repeat(indentLevel);
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    const hasPropsOrEmits = element.props.length > 0 || element.emits.length > 0;
    const hasChildren = element.children.length > 0;
    const hasContent = Boolean(element.content && element.content.length > 0);
    const isSlot = element.isSlot;
    
    const hasSlotAttr = element.props.some(prop => 
      prop.key.startsWith('#') || prop.key.startsWith('v-slot')
    );
    
    if (isSlot) {
      if (hasSlotAttr) {
        const attributesStr = element.props.map(prop => formatAttribute(prop, indentLevel)).join(' ');
        result += `${indent}<template ${attributesStr}>${BREAK_LINE}`;

      } else {
        result += `${indent}<template>${BREAK_LINE}`;
      }
      
      if (hasContent) {
        const contentIndent = ' '.repeat(indentLevel + 2);
        result += `${contentIndent}${element.content}${BREAK_LINE}`;
      }
      if (hasChildren) {
        result += serializeElementTree(element.children, indentLevel + 2);
      }
      
      result += `${indent}</template>${BREAK_LINE}`;
      continue;
    }
    
    const isSelfClosing = !hasChildren && !hasContent && !hasPropsOrEmits;
    
    if (isSelfClosing) {
      result += `${indent}<${element.name} />${BREAK_LINE}`;
    } else if (!hasPropsOrEmits && !hasChildren && !hasContent) {
      result += `${indent}<${element.name}></${element.name}>${BREAK_LINE}`;
    } else if (!hasPropsOrEmits && hasContent && !hasChildren) {
      result += `${indent}<${element.name}>${element.content}</${element.name}>${BREAK_LINE}`;
    } else if (!hasPropsOrEmits && hasChildren) {
      result += `${indent}<${element.name}>${BREAK_LINE}`;
      result += serializeElementTree(element.children, indentLevel + 2);
      result += `${indent}</${element.name}>${BREAK_LINE}`;
    } else if (hasPropsOrEmits) {
      result += `${indent}<${element.name}${BREAK_LINE}`;
      
      // 输出props
      for (const prop of element.props) {
        const propIndent = ' '.repeat(indentLevel + 2);
        result += `${propIndent}${formatAttribute(prop, indentLevel)}${BREAK_LINE}`;
      }
      
      // 输出emits - 修改为新的数据结构
      for (const emit of element.emits) {
        const emitIndent = ' '.repeat(indentLevel + 2);
        const kebabEvent = camelToKebab(emit.event);
        result += `${emitIndent}@${kebabEvent}="${emit.value}"${BREAK_LINE}`;
      }
      
      if (!hasChildren && !hasContent) {
        result += `${indent} />${BREAK_LINE}`;
      } else {
        result += `${indent}>${BREAK_LINE}`;
        if (hasContent) {
          const contentIndent = ' '.repeat(indentLevel + 2);
          result += `${contentIndent}${element.content}${BREAK_LINE}`;
        }
        if (hasChildren) {
          result += serializeElementTree(element.children, indentLevel + 2);
        }
        result += `${indent}</${element.name}>${BREAK_LINE}`;
      }
    }
  }
  
  if (isRoot && result.endsWith(BREAK_LINE)) {
    result = result.slice(0, -1);
  }
  
  return result;
};

// 解析 emits (事件) - 只解析事件属性
const parseEmits = (attrString: string): { event: string, value: string }[] => {
  const emits = [];
  let currentIndex = 0;
  
  while (currentIndex < attrString.length) {
    // 跳过空格
    while (currentIndex < attrString.length && /\s/.test(attrString[currentIndex])) {
      currentIndex++;
    }
    if (currentIndex >= attrString.length) break;
    
    // 检查是否是事件属性（以@开头）
    if (attrString[currentIndex] === '@') {
      currentIndex++; // 跳过@符号
      
      // 查找事件名
      const eventStart = currentIndex;
      while (currentIndex < attrString.length && /[^\s=]/.test(attrString[currentIndex])) {
        currentIndex++;
      }
      const event = attrString.slice(eventStart, currentIndex);
      
      // 跳过空格
      while (currentIndex < attrString.length && /\s/.test(attrString[currentIndex])) {
        currentIndex++;
      }
      
      let value = '';
      
      // 检查是否有等号
      if (currentIndex < attrString.length && attrString[currentIndex] === '=') {
        currentIndex++; // 跳过等号
        
        // 跳过等号后的空格
        while (currentIndex < attrString.length && /\s/.test(attrString[currentIndex])) {
          currentIndex++;
        }
        
        if (currentIndex < attrString.length) {
          const quoteChar = attrString[currentIndex];
          
          if (quoteChar === '"' || quoteChar === "'") {
            // 引号包裹的值
            const valueStart = currentIndex + 1;
            currentIndex = valueStart;
            while (currentIndex < attrString.length && attrString[currentIndex] !== quoteChar) {
              currentIndex++;
            }
            value = attrString.slice(valueStart, currentIndex);
            currentIndex++; // 跳过结束引号
          } else {
            // 无引号的值
            const valueStart = currentIndex;
            while (currentIndex < attrString.length && !/\s/.test(attrString[currentIndex])) {
              currentIndex++;
            }
            value = attrString.slice(valueStart, currentIndex);
          }
        }
      }
      
      emits.push({ event, value });
    } else {
      // 不是事件属性，跳过
      while (currentIndex < attrString.length && !/\s/.test(attrString[currentIndex])) {
        currentIndex++;
      }
    }
  }
  
  return emits;
};

// 检查字符串中是否包含子标签
const hasChildTags = (str: string): boolean => {
  return /<[^>]+>/.test(str);
};

// 格式化数组属性值（参考 formatComplexArray 的逻辑）
const formatArrayAttribute = (arr: any[], indentLevel: number = 0): string => {
  // 判断是否为简单数组（所有元素都不是对象）
  const isSimpleArray = arr.every(item => typeof item !== 'object' || item === null);
  
  if (isSimpleArray) {
    // 简单数组单行输出
    const items = arr.map(item => {
      if (item === null) return 'null';
      if (item === undefined) return 'undefined';
      return typeof item === 'string' ? `'${item}'` : String(item);
    });
    return `[${items.join(', ')}]`;
  }
  
  // 复杂数组多行格式化
  // 数组元素的缩进 = 标签缩进 + 2个空格
  const itemIndent = ' '.repeat(indentLevel + 2);
  // 对象属性的缩进 = 数组元素缩进 + 2个空格
  const propIndent = itemIndent + '  ';
  // 数组结束符的缩进 = 标签缩进（与开始符[对齐）
  const closeIndent = ' '.repeat(indentLevel);
  
  const items = arr.map(item => {
    if (item === null) return `${itemIndent}null,`;
    if (item === undefined) return `${itemIndent}undefined,`;
    
    if (typeof item === 'object') {
      // 对象元素，格式化为多行
      const entries = Object.entries(item);
      const props = entries.map(([k, v]) => {
        const value = typeof v === 'string' ? `'${v}'` : v;
        return `${propIndent}${k}: ${value},`;
      });
      return `${itemIndent}{\n${props.join('\n')}\n${itemIndent}},`;
    }
    
    // 基本类型
    const value = typeof item === 'string' ? `'${item}'` : item;
    return `${itemIndent}${value},`;
  });
  
  return `[\n${items.join('\n')}\n${closeIndent}]`;
};
// 格式化属性输出
const formatAttribute = (prop: { key: string; value: any }, indentLevel: number = 0): string => {
  let kebabKey = camelToKebab(prop.key);
  
  // 1. 布尔值处理
  if (typeof prop.value === 'boolean') {
    return kebabKey;
  }
  
  // 2. 字符串处理
  if (typeof prop.value === 'string') {
    // 检查字符串是否是已格式化的数组格式（如 "[...]" 或 "[\n  {...}\n]"）
    const isFormattedArray = /^\s*\[[\s\S]*\]\s*$/.test(prop.value);
    if (isFormattedArray) {
      // 检查kebabKey是否已经包含冒号前缀
      const finalKey = kebabKey.startsWith(':') ? kebabKey : `:${kebabKey}`;
      
      // 检查是否是多行格式
      if (prop.value.includes('\n')) {
        // 多行格式，需要重新计算正确的缩进
        // 解析数组内容，重新格式化
        try {
          // 尝试解析字符串为实际的数组对象
          const arrayValue = eval(`(${prop.value})`);
          if (Array.isArray(arrayValue)) {
            // 使用formatArrayAttribute重新格式化，传入0作为基础缩进（相对缩进）
            const formattedArray = formatArrayAttribute(arrayValue, 0);
            
            // 给除第一行外的每一行添加属性行缩进（indentLevel + 2）
            const baseIndent = ' '.repeat(indentLevel + 2);
            const lines = formattedArray.split('\n');
            const adjustedLines = lines.map((line, index) => {
              if (index === 0) {
                return line;
              } else {
                return baseIndent + line;
              }
            });
            return `${finalKey}="${adjustedLines.join('\n')}"`;
          }
        } catch (e) {
          // 解析失败，保持原样但调整缩进
          const propIndent = ' '.repeat(indentLevel + 2);
          const lines = prop.value.split('\n');
          const adjustedLines = lines.map((line, index) => {
            if (index === 0) {
              return line.trim();
            } else {
              return propIndent + line.trim();
            }
          });
          return `${finalKey}="${adjustedLines.join('\n')}"`;
        }
      }
      
      // 单行数组格式
      return `${finalKey}="${prop.value}"`;
    }
    
    // 检查字符串是否是已格式化的对象格式（如 "{ content, boundary }" 或 "{\n  content,\n  boundary,\n}"）
    // 这种格式通常来自 directive.ts 的预处理
    const isFormattedObject = /^\s*\{[\s\S]*\}\s*$/.test(prop.value);
    if (isFormattedObject) {
      // 检查是否是多行格式
      if (prop.value.includes('\n')) {
        // 多行格式，需要调整缩进
        // 外层serializeElementTree会添加propIndent（indentLevel + 2 = 4个空格）
        // 对象内部需要额外2个空格，总共6个空格
        const propIndent = ' '.repeat(indentLevel + 2); // 4个空格（属性行的缩进）
        const extraIndent = '  '; // 额外2个空格
        const contentIndent = propIndent + extraIndent; // 总共6个空格（对象内部属性的缩进）
        
        const lines = prop.value.split('\n');
        const adjustedLines = lines.map((line, index) => {
          const trimmedLine = line.trim();
          if (index === 0) {
            // 第一行（{）不需要额外缩进，会被外层的propIndent处理
            return trimmedLine;
          } else if (index === lines.length - 1) {
            // 最后一行（}）和属性行对齐，使用propIndent（4个空格）
            return propIndent + trimmedLine;
          } else {
            // 中间的属性行使用contentIndent（6个空格）
            return contentIndent + trimmedLine;
          }
        });
        return `${kebabKey}="${adjustedLines.join('\n')}"`;
      }

      // 单行格式，直接输出
      return `${kebabKey}="${prop.value}"`;
    }
    
    // 普通字符串
    return `${kebabKey}="${prop.value}"`;
  }
  
  // 3. 对象/数组处理
  if (typeof prop.value === 'object' && prop.value !== null) {
    // // 3.1 数组处理
    if (Array.isArray(prop.value)) {
      const formattedArray = formatArrayAttribute(prop.value, indentLevel);
      
      // 如果是多行格式，需要给除第一行外的每一行添加propIndent
      if (formattedArray.includes('\n')) {
        const propIndent = ' '.repeat(indentLevel + 2);
        const lines = formattedArray.split('\n');
        const adjustedLines = lines.map((line, index) => {
          if (index === 0) {
            // 第一行不需要额外缩进（会被外层的propIndent处理）
            return line;
          } else {
            // 其他行需要添加propIndent
            return propIndent + line;
          }
        });
        return `:${kebabKey}="${adjustedLines.join('\n')}"`;
      }
      
      return `:${kebabKey}="${formattedArray}"`;
    }
    // 3.2 对象处理
    const entries = Object.entries(prop.value);
    if (entries.length === 1) {
      // 单个属性，单行显示
      const [k, v] = entries[0];
      return `${kebabKey}="{ ${k}: '${v}' }"`;
    } else {
      const innerProps = entries.map(([k, v]) => `${INDENT}${k}: '${v}'`).join(`,${BREAK_LINE}`);
      return `${kebabKey}={${BREAK_LINE}${innerProps}${BREAK_LINE}}`;
    }
  }
  
  // 4. 其他值
  return `${kebabKey}="${prop.value}"`;
};

// 解析属性 - 最简版本
const parseAttributes = (attrString: string) => {
  if (!attrString.trim()) return [];
  
  const props = [];
  const emits = [];
  let currentIndex = 0;
  
  while (currentIndex < attrString.length) {
    // 跳过空格
    while (currentIndex < attrString.length && /\s/.test(attrString[currentIndex])) {
      currentIndex++;
    }
    if (currentIndex >= attrString.length) break;
    
    // 查找键名
    const keyStart = currentIndex;
    while (currentIndex < attrString.length && /[^\s=]/.test(attrString[currentIndex])) {
      currentIndex++;
    }
    let key = attrString.slice(keyStart, currentIndex);
    
    // 跳过空格
    while (currentIndex < attrString.length && /\s/.test(attrString[currentIndex])) {
      currentIndex++;
    }
    
    let value: any = true;
    
    // 检查是否有等号
    if (currentIndex < attrString.length && attrString[currentIndex] === '=') {
      currentIndex++; // 跳过等号
      
      // 跳过等号后的空格
      while (currentIndex < attrString.length && /\s/.test(attrString[currentIndex])) {
        currentIndex++;
      }
      
      if (currentIndex < attrString.length) {
        const quoteChar = attrString[currentIndex];
        
        if (quoteChar === '"' || quoteChar === "'") {
          // 引号包裹的值 - 需要正确处理引号内的内容
          const valueStart = currentIndex + 1;
          currentIndex = valueStart;
          
          // 逐字符扫描，直到找到匹配的结束引号
          while (currentIndex < attrString.length) {
            if (attrString[currentIndex] === quoteChar && attrString[currentIndex - 1] !== '\\') {
              break;
            }
            currentIndex++;
          }
          
          value = attrString.slice(valueStart, currentIndex);
          currentIndex++; // 跳过结束引号
        } else if (attrString[currentIndex] === '{') {
          // 对象值
          const valueStart = currentIndex;
          let braceCount = 0;
          do {
            if (attrString[currentIndex] === '{') braceCount++;
            if (attrString[currentIndex] === '}') braceCount--;
            currentIndex++;
          } while (currentIndex < attrString.length && braceCount > 0);
          value = attrString.slice(valueStart, currentIndex);
        } else {
          // 无引号的值
          const valueStart = currentIndex;
          while (currentIndex < attrString.length && !/\s/.test(attrString[currentIndex])) {
            currentIndex++;
          }
          value = attrString.slice(valueStart, currentIndex);
        }
      }
    }
    
    // 检查是否是事件属性（以@开头）
    if (key.startsWith('@')) {
      // 事件属性，添加到 emits 数组
      const eventName = key.slice(1); // 去掉 @
      emits.push({ event: eventName, value: value });
    } else {
      // 普通属性
      props.push({ key, value });
    }
  }
  
  return props;
};

// 原有的 findOuterTag 函数保持不变
const findOuterTag = (str: string) => {
  // 1. 找到第一个 < 符号
  const tagStartIndex = str.indexOf('<');
  if (tagStartIndex === -1) return null;
  
  // 2. 手动解析开始标签，正确处理引号内的内容
  let currentPos = tagStartIndex + 1;
  let inQuote = false;
  let quoteChar = '';
  let tagName = '';
  let attributes = '';
  let isSelfClosing = false;
  
  // 2.1 提取标签名
  while (currentPos < str.length) {
    const char = str[currentPos];
    if (char === ' ' || char === '\n' || char === '\r' || char === '\t' || char === '>' || char === '/') {
      break;
    }
    tagName += char;
    currentPos++;
  }
  
  if (!tagName) return null;
  
  // 2.2 提取属性，正确处理引号
  while (currentPos < str.length) {
    const char = str[currentPos];
    
    // 处理引号状态
    if ((char === '"' || char === "'") && (currentPos === 0 || str[currentPos - 1] !== '\\')) {
      if (!inQuote) {
        inQuote = true;
        quoteChar = char;
      } else if (char === quoteChar) {
        inQuote = false;
        quoteChar = '';
      }
    }
    
    // 只在引号外检查标签结束符
    if (!inQuote) {
      if (char === '/' && str[currentPos + 1] === '>') {
        isSelfClosing = true;
        currentPos += 2;
        break;
      }
      if (char === '>') {
        currentPos++;
        break;
      }
    }
    
    attributes += char;
    currentPos++;
  }
  
  const fullStartTag = str.slice(tagStartIndex, currentPos);
  
  // 3. 处理自闭合标签
  if (isSelfClosing) {
    return {
      type: 'self-closing',
      tagName: tagName,
      attributes: attributes.trim(),
      fullTag: fullStartTag,
      content: '',
      startIndex: tagStartIndex,
      endIndex: currentPos,
      remaining: str.slice(currentPos)
    };
  }
  
  // 4. 对于普通标签，使用栈来匹配对应的结束标签
  const stack = [tagName];
  let searchIndex = currentPos;
  
  while (stack.length > 0 && searchIndex < str.length) {
    // 查找下一个标签（开始或结束）
    const nextTagStart = str.indexOf('<', searchIndex);
    if (nextTagStart === -1) break;
    
    // 判断是开始标签还是结束标签
    if (str[nextTagStart + 1] === '/') {
      // 结束标签
      const endTagMatch = str.slice(nextTagStart).match(/^<\/([^\s>]+)>/);
      if (endTagMatch) {
        const endTagName = endTagMatch[1];
        if (endTagName === tagName) {
          stack.pop();
          if (stack.length === 0) {
            // 找到最外层的结束标签
            const contentEnd = nextTagStart;
            const fullEndTag = endTagMatch[0];
            const fullMatch = str.slice(tagStartIndex, contentEnd + fullEndTag.length);
            const content = str.slice(currentPos, contentEnd);
            
            return {
              type: 'normal',
              tagName: tagName,
              attributes: attributes.trim(),
              fullTag: fullMatch,
              content: content,
              startIndex: tagStartIndex,
              endIndex: contentEnd + fullEndTag.length,
              remaining: str.slice(contentEnd + fullEndTag.length)
            };
          }
        }
        searchIndex = nextTagStart + endTagMatch[0].length;
      } else {
        searchIndex = nextTagStart + 1;
      }
    } else {
      // 可能是开始标签，需要手动解析
      let tempPos = nextTagStart + 1;
      let tempTagName = '';
      
      // 提取标签名
      while (tempPos < str.length) {
        const char = str[tempPos];
        if (char === ' ' || char === '\n' || char === '\r' || char === '\t' || char === '>' || char === '/') {
          break;
        }
        tempTagName += char;
        tempPos++;
      }
      
      if (tempTagName === tagName) {
        stack.push(tempTagName);
      }
      
      searchIndex = tempPos;
    }
  }
  
  return null;
};
