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

import type { ComputedRef } from 'vue';

import type { Language } from '@bkui-vue/locale';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const enum BORDER_OPTION {
  NONE = 'none',
  ROW = 'row',
  COL = 'col',
  OUTER = 'outer',
  HORIZONTAL = 'horizontal'
}

/**
 * 鼠标划过行样式
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const enum ROW_HOVER {
  HIGHLIGHT = 'highlight',
  AUTO = 'auto'
}

export const ROW_HOVER_OPTIONS = [ROW_HOVER.AUTO, ROW_HOVER.HIGHLIGHT];

/**
 * 边框配置可选项
 */
export const BORDER_OPTIONS = [
  BORDER_OPTION.NONE,
  BORDER_OPTION.ROW,
  BORDER_OPTION.COL,
  BORDER_OPTION.OUTER,
  BORDER_OPTION.HORIZONTAL,
];


/**
 * Table Row Attributes
 */
export const TABLE_ROW_ATTRIBUTE = {
  ROW_INDEX: '__$table_row_index',
  ROW_UID: '__$uuid',
  ROW_EXPAND: '__row_expand',
  ROW_SELECTION: '__row_selection',
  ROW_SELECTION_ALL: '__row_selection_all',
  ROW_SELECTION_INDETERMINATE: '__row_selection_indeterminate',
  ROW_SOURCE_DATA: '__row_source_data',
  ROW_SKIP_CFG: '__row_skip_config',
};

export const COLUMN_ATTRIBUTE = {
  COL_UID: '__col_$uuid',
  COL_SOURCE_DATA: '__col_source_data',
  SORT_TYPE: '__sort_type',
};

/**
 * Y 轴滚动条宽度
 */
export const SCROLLY_WIDTH = 6;

/**
 * 默认行高
 */
export const LINE_HEIGHT = 42;

export enum IHeadColor {
  DEF1 = 'def1',
  DEF2 = 'def2',
}

/**
 * 根据表格的使用场景，表头支持颜色自定义，默认提供的选项：FAFBFD、F0F1F5，尽量一个项目选用同一种颜色。
 */
export const DEF_COLOR = {
  [IHeadColor.DEF1]: '#FAFBFD',
  [IHeadColor.DEF2]: '#F0F1F5',
};

export const SETTING_SIZE = {
  large: 78,
  medium: 60,
  small: 42,
};

// export const DEFAULT_SIZE_LIST = [
//   { value: 'small', label: '小', height: SETTING_SIZE.small },
//   { value: 'medium', label: '中', height: SETTING_SIZE.medium },
//   { value: 'large', label: '大', height: SETTING_SIZE.large },
// ];
export const createDefaultSizeList = (t: ComputedRef<Language['table']>) => [
  { value: 'small', label: t.value.setting.lineHeight.small, height: SETTING_SIZE.small },
  { value: 'medium', label: t.value.setting.lineHeight.medium, height: SETTING_SIZE.medium },
  { value: 'large', label: t.value.setting.lineHeight.large, height: SETTING_SIZE.large },
];

/**
 * Provide key: init column when use <column { ...props }> template
 */
export const PROVIDE_KEY_INIT_COL = 'InitColumns';

export const PROVIDE_KEY_TB_CACHE = 'BKTableCahce';

export const BK_COLUMN_UPDATE_DEFINE = 'Bk_COlumn_Update_Define';

/**
 * 表格底部高度
 * 分页组件
 */
export const TB_FOOT_HEIGHT = 60;

/**
 * 排序可选择项
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const enum SORT_OPTION {
  ASC = 'asc',
  DESC = 'desc',
  NULL = 'null',
  CUSTOM = 'custom'
}

export const SORT_OPTIONS = [SORT_OPTION.ASC, SORT_OPTION.DESC, SORT_OPTION.NULL, SORT_OPTION.CUSTOM];

/**
 * 列宽最小设置
 */
export const COL_MIN_WIDTH = 80;
