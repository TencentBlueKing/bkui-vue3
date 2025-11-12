import type {
  IParam,
  ValueType,
} from "@/types/component";
import {
  camelKey,
} from "@/utils";

// 创建插槽
export const createSlots = (
  slotContent: string,
  slotName: string,
  slotParams: IParam[],
) => {
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
