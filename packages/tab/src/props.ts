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
import { PropType, VNode } from 'vue';
import { toType } from 'vue-types';

import { PropTypes, renderDirectiveType } from '@bkui-vue/shared';

export enum TabTypeEnum {
  CARD = 'card',
  BORDER_CARD = 'border-card',
  UNBORDER_CARD = 'unborder-card',
  CARD_TAB = 'card-tab',
  CARD_GRID = 'card-grid',
}

export enum PositionEnum {
  LEFT = 'left',
  RIGHT = 'right',
  TOP = 'top',
}

export const TabPositionType = toType<`${PositionEnum}`>('position', {}).def(PositionEnum.TOP);

export enum SortTypeEnum {
  REPLACE = 'replace',
  INSERT = 'insert',
}

export const SortTypeUnion = toType<`${SortTypeEnum}`>('sortType', {}).def(SortTypeEnum.REPLACE);

export const tabNavEventProps = {
  tabAdd: {
    type: Function,
    default: (): any => ({}),
  },
  tabChange: {
    type: Function,
    default: (name: string): string => name,
  },
  tabRemove: {
    type: Function,
    default: (name: string): string => name,
  },
  tabSort: {
    type: Function,
    default: (): any => ({}),
    // default: (dragTabIndex: number, dropTabIndex: number, sortType: string):
    // {dragTabIndex: number, dropTabIndex: number, sortType: string} => ({ dragTabIndex, dropTabIndex, sortType }),
  },
  tabDrag: {
    type: Function,
    default: (): any => ({}),
  },
};
export const tabEventProps = {
  add: {
    type: Function,
    default: (): any => ({}),
  },
  change: {
    type: Function,
    default: (): any => ({}),
  },
  remove: {
    type: Function,
    default: (): any => ({}),
  },
  sort: {
    type: Function,
    default: (): any => ({}),
  },
  drag: {
    type: Function,
    default: (): any => ({}),
  },
  // ...TabNavEventProps,
};
export const tabProps = {
  active: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).def(''),
  type: toType<`${TabTypeEnum}`>('type', {}).def(TabTypeEnum.BORDER_CARD),
  tabPosition: TabPositionType,
  closable: Boolean,
  addable: Boolean,
  sortable: Boolean,
  sortType: SortTypeUnion,
  labelHeight: PropTypes.number.def(50),
  scrollStep: PropTypes.number.def(200),
  extCls: PropTypes.string.def(''),
  validateActive: PropTypes.bool.def(true),
  showHeader: PropTypes.bool.def(true),
  changeOnHover: PropTypes.bool.def(false),
  changeOnHoverDelay: PropTypes.number.def(1000),
  activeBarSize: PropTypes.number.def(2),
  activeBarColor: PropTypes.string.def('#3a84ff'),
};

export const tabNavProps = {
  active: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).def(''),
  type: toType<`${TabTypeEnum}`>('type', {}).def(TabTypeEnum.BORDER_CARD),
  activeBarColor: PropTypes.string.def('#3a84ff'),
  activeBarSize: PropTypes.number.def(2),
  panels: {
    type: Array as PropType<VNode[]>,
    default: () => [],
  },
  tabPosition: TabPositionType,
  closable: Boolean,
  addable: Boolean,
  sortable: Boolean,
  sortType: SortTypeUnion,
  labelHeight: PropTypes.number.def(50),
  scrollStep: PropTypes.number.def(200),
  validateActive: PropTypes.bool.def(true),
  changeOnHover: PropTypes.bool.def(false),
  changeOnHoverDelay: PropTypes.number.def(1000),
  ...tabNavEventProps,
};

export const tabPanelProps = {
  name: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).def(''),
  label: PropTypes.string || PropTypes.func,
  closable: PropTypes.bool,
  visible: PropTypes.bool.def(true),
  disabled: PropTypes.bool,
  sortable: PropTypes.bool,
  renderDirective: renderDirectiveType(),
  panel: PropTypes.string || PropTypes.func,
};
