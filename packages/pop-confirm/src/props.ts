/*
* Tencent is pleased to support the open source community by making
* 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
*
* Copyright (C) 2021 THL A29 Limited, a Tencent company.  All rights reserved.
*
* 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) is licensed under the MIT License.
*
* License for 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition):
*
* ---------------------------------------------------
* Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
* documentation files (the "Software"), to deal in the Software without restriction, including without limitation
* the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
* to permit persons to whom the Software is furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of
* the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
* THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
* CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
* IN THE SOFTWARE.
*/
import { toType } from 'vue-types';

import { PlacementEnum, placementType, PropTypes } from '@bkui-vue/shared';

export enum TriggerEnum {
  HOVER = 'hover',
  CLICK = 'click',
}

export function triggerType() {
  return toType<`${TriggerEnum}`>('trigger', {}).def(TriggerEnum.HOVER);
}

export const PopConfirmEvent = {
  confirm: {
    type: Function,
    default: (): any => ({}),
  },
  cancel: {
    type: Function,
    default: (): any => ({}),
  },
  // ...TabNavEventProps,
};
export const PopConfirmProps = {
  /**
   * 触发方式
   * 支持 click hover manual
   * manual： 通过isShow控制显示、隐藏
   */
  trigger: triggerType(),
  title: PropTypes.string.def(''),
  content: PropTypes.string.def(''),
  confirmText: PropTypes.string.def(''),
  cancelText: PropTypes.string.def(''),
  placement: PropTypes.oneOfType([placementType().def(PlacementEnum.TOP), PropTypes.string]).def(PlacementEnum.TOP),
  theme: PropTypes.string.def('light '),
  /**
   * 自定义icon：根据确认框中提示文字的语境来选择 icon的样式，当确认操作存在风险时，可选择带警示的icon来引起用户的注意。
   */
  icon: PropTypes.string.def(''),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).def('auto'),
};
export default PopConfirmProps;
