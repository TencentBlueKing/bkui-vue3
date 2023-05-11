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

import { ExtractPropTypes, PropType, VNode } from 'vue';
import { toType } from 'vue-types';

import { IOptions } from '@bkui-vue/directives/src/tooltips';
import { PopoverPropTypes } from '@bkui-vue/popover';
import { PropTypes } from '@bkui-vue/shared';

enum TagInputTriggerEnum {
  FOCUS ='focus',
  SEARCH ='search'
}
const tagProps = () => ({
  modelValue: PropTypes.arrayOf(PropTypes.string).def([]),
  placeholder: PropTypes.string.def(''),
  list: PropTypes.arrayOf(PropTypes.object).def([]),
  disabled: PropTypes.bool.def(false),
  tooltipKey: PropTypes.string.def(''),
  saveKey: PropTypes.string.def('id'),
  displayKey: PropTypes.string.def('name'),
  hasDeleteIcon: PropTypes.bool.def(false),
  clearable: PropTypes.bool.def(true),
  trigger: toType<`${TagInputTriggerEnum}`>('treeTriggerType', {}).def(TagInputTriggerEnum.SEARCH),
  searchKey: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]).def('name'),
  useGroup: PropTypes.bool.def(false),
  allowCreate: PropTypes.bool.def(false),
  maxData: PropTypes.number.def(-1),
  maxResult: PropTypes.number.def(10),
  contentMaxHeight: PropTypes.number.def(300),
  contentWidth: PropTypes.number.def(190),
  separator: PropTypes.string.def(''),
  allowNextFocus: PropTypes.bool.def(true),
  allowAutoMatch: PropTypes.bool.def(false),
  showClearOnlyHover: PropTypes.bool.def(false),
  leftSpace: PropTypes.number.def(0),
  createTagValidator: {
    type: Function as PropType<(tag: any) => boolean>,
  },
  filterCallback: {
    type: Function as PropType<(value: string, searchKey: string | string[], list: any[]) => any[]>,
  },
  tagTpl: {
    type: Function as PropType<(node, highlightKeyword: Function, h: Function, ctx: VNode) => VNode>,
  },
  tpl: {
    type: Function as PropType<(node, h: Function, ctx: VNode) => VNode>,
  },
  pasteFn: {
    type: Function as PropType<(value: string) => any[]>,
  },
  withValidate: {
    type: Boolean,
    default: true,
  },
  popoverProps: {
    type: Object as PropType<Partial<PopoverPropTypes>>,
    default: () => ({}),
  },
  collapseTags: {
    type: Boolean,
    default: false,
  },
  tagOverflowTips: {
    type: Object as PropType<Partial<IOptions>>,
    default: () => ({}),
  },
});


export default tagProps;
export type TagProps = Partial<ExtractPropTypes<ReturnType<typeof tagProps>>>;
