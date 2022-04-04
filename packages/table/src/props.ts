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

import { ExtractPropTypes } from 'vue';
import { PropTypes } from '@bkui-vue/shared';
import { BORDER_OPRIONS } from './const';

export const tableProps = {
  /**
   * 渲染列表
   */
  data: PropTypes.arrayOf(PropTypes.any).def([]),

  /**
   * Table 列渲染
   */
  columns: PropTypes.arrayOf(PropTypes.shape<Column>({
    label: PropTypes.oneOfType([PropTypes.func.def(() => ''), PropTypes.string.def('')]),
    field: PropTypes.oneOfType([PropTypes.func.def(() => ''), PropTypes.string.def('')]),
    render: PropTypes.oneOfType([PropTypes.func.def(() => ''), PropTypes.string.def('')]),
    width: PropTypes.oneOfType([PropTypes.number.def(undefined), PropTypes.string.def('auto')]),
  })),

  /**
   * 当前选中列
   * 当设置选中多列时（columnPick = multi），配置为数组[index1, index2, index3]，只能选中单列时，可以为数值或者数组[index]
   */
  activeColumn: PropTypes.oneOfType([PropTypes.number.def(-1), PropTypes.arrayOf(PropTypes.number.def(-1))]),

  /**
   * 表格列选中方式
   * 支持：单列（single），多列（multi），禁用（disabled）
   * 默认：disabled
   */
  columnPick: PropTypes.commonType(['multi', 'single', 'disabled'], 'columnPick').def('disabled'),

  /**
   * 设置表格高度
   * 默认：auto，依赖外层高度
   */
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).def('auto'),

  /**
   * 设置表格最小高度
   * 默认：auto，依赖外层高度
   */
  minHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).def('auto'),

  /**
   * 行高，可以为固定数值类型
   * 可以是函数，返回当前行的高度，返回值为数值类型
   */
  rowHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.func]).def(40),

  /**
   * Thead行高，可以为固定数值类型
   */
  headHeight: PropTypes.number.def(40),

  /**
   * 是否启用虚拟渲染 & 滚动
   * 当数据量很大时，启用虚拟渲染可以解决压面卡顿问题
   */
  virtualEnabled: PropTypes.bool.def(false),

  /**
   * 表格边框显示设置，可以是一个组合
   * 生效规则: 除非单独设置 none,否则会追加每个设置
   */
  border: PropTypes.arrayOf(PropTypes.commonType(BORDER_OPRIONS, 'border')).def(['row']),

  // /**
  //  * Table Caption Config
  //  */
  // caption: PropTypes.object.def({
  //   enabled: PropTypes.bool.def(false),
  //   text: PropTypes.string.def(''),
  //   textAlign: PropTypes.commonType(['left', 'center', 'right'], 'textAlign').def('center'),
  //   side: PropTypes.commonType(['top', 'bottom'], 'side').def('top'),
  //   style: PropTypes.object.def({}),
  // }),
};

export type Column = {
  label: Function | string;
  field: Function | string;
  render?: Function | string;
  width?: number | string;
};

export type Columns = ReadonlyArray<Column>;
export type TablePropTypes = Readonly<ExtractPropTypes<typeof tableProps>>;
export type IColumnActive = {
  index: number;
  active: boolean;
};

export type IReactiveProp = {
  activeColumns: IColumnActive[]
};
