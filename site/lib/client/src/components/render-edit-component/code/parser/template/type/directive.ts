import type {
  IComponentWiki,
  ValueType
} from "@/types/component";
import {
  parseStringTemplate,
  serializeElementTree,
} from "../template-parser";
import {
  BREAK_LINE,
} from "../../../constant";
import {
  camelKey,
} from "@/utils";

// 创建指令匹配的正则表达式
const createDirectiveRegex = (componentName: string, global = false) => {
  return new RegExp(`v-${componentName}=\"([^\"]*)\"`, global ? 'g' : '');
};

// 生成指令模板
export const createDirectiveTemplate = (
  preset: IComponentWiki['presets'][number],
  renderProps: Record<string, ValueType>,
  componentName: IComponentWiki['name'],
) => {
  if (preset) {
    let template = preset?.template || '';
    
    // 先尝试从模板中提取指令参数
    const extractedParams = extractDirectiveParams(template, renderProps, componentName);
    // 如果提取到参数且是对象类型（不是字符串），则替换模板中的指令参数
    if (extractedParams && typeof extractedParams === 'object' && !Array.isArray(extractedParams)) {
      // 构建新的参数字符串（根据key数量决定格式）
      const keys = Object.keys(extractedParams);
      let newParamsString: string;
      
      if (keys.length === 1) {
        // 单个key：{ x }
        newParamsString = `{ ${keys[0]} }`;
      } else {
        // 多个key：多行格式（参考propsList的换行方式）
        const formattedKeys = keys.map(key => `  ${camelKey(key)},`).join(BREAK_LINE);
        newParamsString = `{${BREAK_LINE}${formattedKeys}${BREAK_LINE}}`;
      }
      
      // 替换模板中的 v-componentName="旧值" 为 v-componentName="新值"
      const regex = createDirectiveRegex(componentName, true);
      template = template.replace(regex, `v-${componentName}="${newParamsString}"`);
    }


    
    const str = `<template>${template.trim()}</template>`;
    const elementTree = parseStringTemplate(str);
    return serializeElementTree(elementTree, 0, true);

  }
  return '';
};

const extractDirectiveParams = (
  template: string,
  renderProps: Record<string, ValueType>,
  componentName: IComponentWiki['name'],
) => {
  // 只匹配 v-componentName 格式的指令，并捕获引号内的内容
  const regex = createDirectiveRegex(componentName);
  const match = template.match(regex);
  
  if (!match) {
    return null;
  }
  const paramString = match[1]; // 获取指令参数部分（引号内的内容）
  // 判断参数是否是对象格式，即{xxx}（不带外层括号）
  const objectRegex = /^\s*\{(.+)\}\s*$/;
  const objectMatch = paramString.match(objectRegex);
  
  if (objectMatch) {
    // 如果是对象格式，返回renderProps对象（格式化在createDirectiveTemplate中处理）
    return renderProps;
  }

  // 如果不是对象格式，返回原值
  return paramString;

};