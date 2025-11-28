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
import { isFunctionString } from "@/common/util";
import { handleReservedKeyword } from "../../constant";

// 创建插槽
export const createSlots = (
  slotContent: string,
  slotName: string,
  slotParams: IParam[],
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
  return createLabel(name, slotContent?.trim() ?? '', '', {}, {}, 'template');
};

// 创建标签
export const createLabel = (
  name: string,
  slot: string,
  prefix = '',
  props: Record<string, ValueType> = {},
  events: Record<string, string> = {},
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
    } else if (key.startsWith('v-model')) { // modelValue处理
      curValue = 'modelValue';
    } else {
      curKey = `:${curKey}`;
    }
    // 判断是否为函数
    if (isFunctionString(value)) {
      curValue = `handle${toPascalCase(camelToSnakeCase(curValue))}`;
    }
    // 处理保留关键字
    const variableName = handleReservedKeyword(camelKey(curValue));
    return ` ${curKey}="${variableName}"`;
  });
  // 事件列表处理
  const eventsList = Object.keys(events).map((key) => {
    return ` @${key}="handle${toPascalCase(camelToSnakeCase((key)))}"`;
  });
  // slot处理
  const curEndLabelName = endLabelName || name;
  return `<${prefix}${name}${propsList.join('')}${eventsList.join('')}>${slot}</${prefix}${curEndLabelName}>`;
};
