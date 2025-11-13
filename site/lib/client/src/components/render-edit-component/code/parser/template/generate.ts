import type {
  IComponentWiki,
  IParam,
  ValueType,
} from "@/types/component";
import {
  camelKey,
  camelToSnakeCase,
} from "@/utils";
import {
  toPascalCase,
} from "./template-parser";

// 创建插槽
export const createSlots = (
  slotContent: string,
  slotName: string,
  slotParams: IParam[],
  componentProps: IComponentWiki['props'] = [],
) => {
  if (!slotContent) {
    return '';
  }
  let slotParamsStr = '';
  if (Array.isArray(slotParams) && slotParams.length > 0) {
    slotParamsStr = `="data"`;
  }
  const curSlotName = (slotName === 'default' && !slotParamsStr) ? '' : ` #${slotName}${slotParamsStr}`;
  const name = `template${curSlotName}`;
  return createLabel(name, slotContent?.trim() ?? '', '', {}, {}, componentProps, 'template');
};

// 创建标签
export const createLabel = (
  name: string,
  slot: string,
  prefix = '',
  props: Record<string, ValueType> = {},
  events: Record<string, string> = {},
  componentProps: IComponentWiki['props'] = [],
  endLabelName = '',
) => {
  // 属性列表处理
  const propsList = Object.entries(props).map(([key, value]) => {
    let curKey = key;
    let curValue = key;
    // 判断是否为v-model
    if (key.startsWith('v-model-')) {
      curKey = `v-model:${curKey.slice(8)}`;
      curValue = curKey.slice(8);
    } else {
      curKey = `:${curKey}`;
    }
    // 判断是否为函数
    const curPropType = componentProps.find(item => item.name === curValue)?.type;
    if (curPropType && curPropType.includes('function') && typeof value === 'string' && value.includes('=>')) {
      curValue = `handle${toPascalCase(camelToSnakeCase(curValue))}`;
    }
    return ` ${curKey}="${camelKey(curValue)}"`;
  });
  // 事件列表处理
  const eventsList = Object.keys(events).map((key) => {
    return ` @${key}="handle${toPascalCase(key)}"`;
  });
  // slot处理
  const curEndLabelName = endLabelName || name;
  return `<${prefix}${name}${propsList.join('')}${eventsList.join('')}>${slot}</${prefix}${curEndLabelName}>`;
};
