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
import { PropType } from 'vue';
import { string } from 'vue-types';

import { PopoverPropTypes } from '@bkui-vue/popover';
import { PropTypes } from '@bkui-vue/shared';

export  type TipsType = 'tips' | 'title';
export  type CalType = 'dom' | 'canvas';

export enum PlacementEnum {
  AUTO = 'auto',
  AUTO_START = 'auto-start',
  AUTO_END = 'auto-end',
  TOP = 'top',
  RIGHT = 'right',
  BOTTOM = 'bottom',
  LEFT = 'left',
  TOP_START = 'top-start',
  TOP_END = 'top-end',
  BOTTOM_START = 'bottom-start',
  BOTTOM_END = 'bottom-end',
  RIGHT_START = 'right-start',
  RIGHT_END = 'right-end',
  LEFT_START = 'left-start',
  LEFT_END = 'left-end',
}

export function placementType() {
  return string<`${PlacementEnum}`>().def(PlacementEnum.BOTTOM);
}

export default {
  content: PropTypes.string,
  type: PropTypes.oneOf(['tips', 'title']).def('title'),
  calType: PropTypes.oneOf(['dom', 'canvas']).def('dom'),
  boundary: PropTypes.oneOfType([PropTypes.string.def('parent'), PropTypes.instanceOf(HTMLElement)]).def(document.body),
  placement: placementType().def(PlacementEnum.TOP_START),
  resizeable: PropTypes.bool,
  popoverOptions: Object as PropType<Partial<PopoverPropTypes>>, // popover属性
};
