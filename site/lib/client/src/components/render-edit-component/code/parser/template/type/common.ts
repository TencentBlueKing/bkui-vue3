import type {
  IComponentWiki,
  ValueType,
} from '@/types/component';
import {
  camelKey,
} from '@/utils';

import {
  SpecialComponentProps,
} from '../../../extra';
import {
  camelToKebab,
} from '../../../util';
import {
  createLabel,
  createSlots,
} from '../generate';
import {
  parseStringTemplate,
  serializeElementTree,
} from '../template-parser';

// 生成通用模板
export const createCommonTemplate = (
  renderProps: Record<string, ValueType>,
  componentProps: IComponentWiki['props'],
  curSlot: Record<string, string>,
  componentName: IComponentWiki['name'],
  componentSlots: IComponentWiki['slots'],
  curEvents: Record<string, string>,
) => {
  const curSlots = Object.entries(curSlot).map(([slotName, slotContent]) => {
    const slotParams = componentSlots?.find(item => item.name === slotName)?.params;
    return createSlots(slotContent, slotName, slotParams);
  })
    .join('');
  const str =  createLabel(
    'template',
    createLabel(
      componentName,
      curSlots,
      'bk-',
      createTemplateProps(
        componentProps,
        renderProps,
      ),
      curEvents,
    ),
  );
  const elementTree = parseStringTemplate(str);
  return serializeElementTree(elementTree, 0, true);
};

export const createTemplateProps = (
  componentProps: SpecialComponentProps,
  renderProps: Record<string, ValueType>,
) => {
  const result: Record<string, ValueType> = {};
  const vModelKeys = componentProps.filter(item => item?.isSupportVModel).map(item => camelKey(item.name));
  for (const [key, value] of Object.entries(renderProps)) {
    const curPropInfo = componentProps.find(item => item.name === key || camelKey(item.name) === key);
    if (vModelKeys.includes(key)) {
      if (key === 'modelValue') {
        result['v-model'] = value;
      } else {
        result[`v-model-${camelToKebab(camelKey(key))}`] = value;
      }
    } else if (curPropInfo.isRef) {
      result['ref'] = value;
    } else {
      result[key] = value;
    }
  }
  return result;
};
