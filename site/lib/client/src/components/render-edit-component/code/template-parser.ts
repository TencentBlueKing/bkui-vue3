import { IParam, ValueType } from "@/types/component";
import { camelKey } from "@/utils";
import { iconsName } from './icons-name';

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

// 驼峰式转连字符格式
export const camelToKebab = (str: string): string => {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
};

// 格式化属性输出
const formatAttribute = (prop: { key: string; value: any }): string => {
  let kebabKey = camelToKebab(prop.key);
  if (typeof prop.value === 'boolean') {
    return kebabKey;
  } else if (typeof prop.value === 'object' && prop.value !== null) {
    // 对象值
    const entries = Object.entries(prop.value);
    if (entries.length === 1) {
      // 单个属性，单行显示
      const [k, v] = entries[0];
      return `${kebabKey}="{ ${k}: '${v}' }"`;
    } else {
      // 多个属性，多行显示
      const objIndent = '  ';
      const innerProps = entries.map(([k, v]) => `${objIndent}${k}: '${v}'`).join(',\n');
      return `${kebabKey}={\n${innerProps}\n}`;
    }
  } else {
    // 字符串或其他值
    return `${kebabKey}="${prop.value}"`;
  }
};

// 解析属性 - 最简版本
const parseAttributes = (attrString: string) => {
  if (!attrString.trim()) return [];
  
  const props = [];
  let currentIndex = 0;
  
  while (currentIndex < attrString.length) {
    // 跳过空格
    while (currentIndex < attrString.length && /\s/.test(attrString[currentIndex])) {
      currentIndex++;
    }
    if (currentIndex >= attrString.length) break;
    
    // 检查是否是事件属性（以@开头），如果是则跳过
    if (attrString[currentIndex] === '@') {
      // 跳过整个事件属性
      while (currentIndex < attrString.length && !/\s/.test(attrString[currentIndex])) {
        currentIndex++;
      }
      continue;
    }
    
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
          // 引号包裹的值
          const valueStart = currentIndex + 1;
          currentIndex = valueStart;
          while (currentIndex < attrString.length && attrString[currentIndex] !== quoteChar) {
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
    props.push({ key, value });
  }
  
  return props;
};

// 原有的 findOuterTag 函数保持不变
const findOuterTag = (str: string) => {
  // 1. 找到第一个开始标签
  const startMatch = str.match(/<([^>\s]+)([^>]*)>/);
  if (!startMatch) return null;
  
  const startIndex = startMatch.index;
  const tagName = startMatch[1];
  const attributes = startMatch[2];
  const fullStartTag = startMatch[0];
  
  // 2. 判断是自闭合标签 - 修复这里的逻辑
  const isSelfClosing = fullStartTag.endsWith('/>') || 
                       (attributes.trim().endsWith('/') && !fullStartTag.endsWith('/>'));
  
  if (isSelfClosing) {
    // 清理属性中的末尾斜杠
    const cleanAttributes = attributes.replace(/\/\s*$/, '').trim();
    
    return {
      type: 'self-closing',
      tagName: tagName,
      attributes: cleanAttributes,
      fullTag: fullStartTag,
      content: '',
      startIndex: startIndex,
      endIndex: startIndex + fullStartTag.length,
      remaining: str.slice(startIndex + fullStartTag.length)
    };
  }
  
  // 3. 对于普通标签，使用栈来匹配对应的结束标签
  const stack = [tagName];
  let currentIndex = startIndex + fullStartTag.length;
  
  while (stack.length > 0 && currentIndex < str.length) {
    // 查找下一个开始标签或结束标签
    const nextStartMatch = str.slice(currentIndex).match(/<([^>\s]+)([^>]*)>/);
    const nextEndMatch = str.slice(currentIndex).match(/<\/([^>\s]+)>/);
    
    if (!nextStartMatch && !nextEndMatch) break;
    
    const nextStartIndex = nextStartMatch ? currentIndex + nextStartMatch.index : Infinity;
    const nextEndIndex = nextEndMatch ? currentIndex + nextEndMatch.index : Infinity;
    
    // 先遇到开始标签
    if (nextStartIndex < nextEndIndex) {
      const nextTagName = nextStartMatch[1];
      // 如果是同名的开始标签，入栈
      if (nextTagName === tagName) {
        stack.push(nextTagName);
      }
      currentIndex = nextStartIndex + nextStartMatch[0].length;
    } 
    // 先遇到结束标签
    else if (nextEndIndex < Infinity) {
      const endTagName = nextEndMatch[1];
      // 如果是同名的结束标签，出栈
      if (endTagName === tagName) {
        stack.pop();
        if (stack.length === 0) {
          // 找到最外层的结束标签
          const contentEnd = nextEndIndex;
          const fullEndTag = nextEndMatch[0];
          const fullMatch = str.slice(startIndex, contentEnd + fullEndTag.length);
          const content = str.slice(startIndex + fullStartTag.length, contentEnd);
          
          return {
            type: 'normal',
            tagName: tagName,
            attributes: attributes.trim(),
            fullTag: fullMatch,
            content: content,
            startIndex: startIndex,
            endIndex: contentEnd + fullEndTag.length,
            remaining: str.slice(contentEnd + fullEndTag.length)
          };
        }
      }
      currentIndex = nextEndIndex + nextEndMatch[0].length;
    } else {
      currentIndex++;
    }
  }
  
  return null;
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
        const attributesStr = element.props.map(prop => formatAttribute(prop)).join(' ');
        result += `${indent}<template ${attributesStr}>\n`;
      } else {
        result += `${indent}<template>\n`;
      }
      
      if (hasContent) {
        const contentIndent = ' '.repeat(indentLevel + 2);
        result += `${contentIndent}${element.content}\n`;
      }
      if (hasChildren) {
        result += serializeElementTree(element.children, indentLevel + 2);
      }
      
      result += `${indent}</template>\n`;
      continue;
    }
    
    const isSelfClosing = !hasChildren && !hasContent && !hasPropsOrEmits;
    
    if (isSelfClosing) {
      result += `${indent}<${element.name} />\n`;
    } else if (!hasPropsOrEmits && !hasChildren && !hasContent) {
      result += `${indent}<${element.name}></${element.name}>\n`;
    } else if (!hasPropsOrEmits && hasContent && !hasChildren) {
      result += `${indent}<${element.name}>${element.content}</${element.name}>\n`;
    } else if (!hasPropsOrEmits && hasChildren) {
      result += `${indent}<${element.name}>\n`;
      result += serializeElementTree(element.children, indentLevel + 2);
      result += `${indent}</${element.name}>\n`;
    } else if (hasPropsOrEmits) {
      result += `${indent}<${element.name}\n`;
      
      // 输出props
      for (const prop of element.props) {
        const propIndent = ' '.repeat(indentLevel + 2);
        result += `${propIndent}${formatAttribute(prop)}\n`;
      }
      
      // 输出emits - 修改为新的数据结构
      for (const emit of element.emits) {
        const emitIndent = ' '.repeat(indentLevel + 2);
        const kebabEvent = camelToKebab(emit.event);
        result += `${emitIndent}@${kebabEvent}="${emit.value}"\n`;
      }
      
      if (!hasChildren && !hasContent) {
        result += `${indent} />\n`;
      } else {
        result += `${indent}>\n`;
        if (hasContent) {
          const contentIndent = ' '.repeat(indentLevel + 2);
          result += `${contentIndent}${element.content}\n`;
        }
        if (hasChildren) {
          result += serializeElementTree(element.children, indentLevel + 2);
        }
        result += `${indent}</${element.name}>\n`;
      }
    }
  }
  
  if (isRoot && result.endsWith('\n')) {
    result = result.slice(0, -1);
  }
  
  return result;
};

// 创建插槽
export const createSlots = (slotContent: string, slotName: string, slotParams: IParam[]) => {
  let slotParamsStr = '';
  if (Array.isArray(slotParams) && slotParams.length > 0) {
    slotParamsStr = `="data"`;
  }
  const curSlotName = (slotName === 'default' && !slotParamsStr) ? '' : ` #${slotName}${slotParamsStr}`;
  const name = `template${curSlotName}`;
  return createLabel(name, slotContent.trim(), '', {}, 'template');
};

// 创建标签
export const createLabel = (
  name: string,
  slot: string,
  prefix = '',
  props: Record<string, ValueType> = {},
  endLabelName = '',
) => {
  // 属性列表处理
  const propsList = Object.keys(props).map((key) => {
    let curKey = key;
    let curValue = key;
    if (key.startsWith('v-model-')) {
      curKey = `v-model:${curKey.slice(8)}`;
      curValue = curKey.slice(8);
    } else {
      curKey = `:${curKey}`;
    }
    return ` ${curKey}="${camelKey(curValue)}"`;
  });
  // slot处理
  const curEndLabelName = endLabelName || name;
  return `<${prefix}${name}${propsList.join('')}>${slot}</${prefix}${curEndLabelName}>`;
};