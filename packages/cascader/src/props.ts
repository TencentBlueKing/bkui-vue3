/*
 * Tencent is pleased to support the open source community by making
 * 蓝鲸智云PaaS平台 (BlueKing PaaS) available.
 *
 * Copyright (C) 2021 THL A29 Limited, a Tencent company.  All rights reserved.
 *
 * 蓝鲸智云PaaS平台 (BlueKing PaaS) is licensed under the MIT License.
 *
 * License for 蓝鲸智云PaaS平台 (BlueKing PaaS):
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

import { array, object } from 'vue-types';

import { PropTypes } from '@bkui-vue/shared';

import { INode } from './interface';

import type { ExtractPropTypes } from 'vue';

export const props = {
  modelValue: PropTypes.arrayOf(PropTypes.oneOfType([array<string>(), String, Number])),
  list: PropTypes.array.def([]),
  placeholder: PropTypes.string.def(''),
  behavior: PropTypes.string.def('normal'),
  filterable: PropTypes.bool.def(false),
  multiple: PropTypes.bool.def(false),
  disabled: PropTypes.bool.def(false),
  clearable: PropTypes.bool.def(true),
  trigger: PropTypes.string.def('click'),
  checkAnyLevel: PropTypes.bool.def(false),
  isRemote: PropTypes.bool.def(false),
  remoteMethod: PropTypes.func,
  showCompleteName: PropTypes.bool.def(true),
  idKey: PropTypes.string.def('id'),
  nameKey: PropTypes.string.def('name'),
  childrenKey: PropTypes.string.def('children'),
  separator: PropTypes.string.def('/'),
  limitOneLine: PropTypes.bool.def(false),
  extCls: PropTypes.string.def(''),
  filterMethod: PropTypes.func,
  scrollHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).def(216),
  scrollWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).def('auto'),
  customTextFillback: PropTypes.func,
  customTagsFillback: PropTypes.func,
  changeEmitsNodes: PropTypes.bool.def(false),
  collapseTags: {
    type: Boolean,
    default: true,
  },
  floatMode: {
    // 当floatMode为true时为漂浮模式,不会挤占空间
    type: Boolean,
    default: false,
  },
};

export type CascaderProps = ExtractPropTypes<typeof props>;

export const cascaderPanelProps = {
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).def('auto'),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).def(216),
  store: PropTypes.object.def({}),
  separator: PropTypes.string.def(''),
  suggestions: PropTypes.arrayOf(object<INode>()),
  isFiltering: PropTypes.bool.def(false),
  searchKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).def(''),
  modelValue: PropTypes.arrayOf(PropTypes.oneOfType([array<string>(), String, Number])),
};

export type CascaderPanelProps = ExtractPropTypes<typeof cascaderPanelProps>;
