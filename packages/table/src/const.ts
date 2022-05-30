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

/**
 * 边框配置可选项
 */
export const BORDER_OPRIONS = ['none', 'row', 'col', 'outer'];

export const enum EVENTS {
  /** 点击排序事件 */
  ON_SORT_BY_CLICK = 'onSortByClick',
  ON_FILTER_CLICK = 'onFilterClick',
  ON_SETTING_CHANGE = 'onSettingChange',

  ON_ROW_EXPAND_CLICK = 'onRowExpandClick'
}

// ['columnPick', 'rowClick', 'rowDblClick', 'pageLimitChange', 'pageValueChange']
export const enum EMITEVENTS {
  COLUMN_PICK = 'columnPick',
  COLUMN_SORT = 'columnSort',
  COLUMN_FILTER = 'columnFilter',

  ROW_CLICK = 'rowClick',
  ROW_DBL_CLICK = 'rowDblClick',
  ROW_EXPAND_CLICK = 'rowExpand',

  PAGE_LIMIT_CHANGE = 'pageLimitChange',
  PAGE_VALUE_CHANGE = 'pageValueChange',

  SETTING_CHANGE = 'settingChange',

  SCROLL_BOTTOM = 'scrollBottom'
}

const EMPTY = (..._args) => true;

export const EMIT_EVENT_TYPES = {
  [EMITEVENTS.COLUMN_PICK]: EMPTY,
  [EMITEVENTS.COLUMN_FILTER]: EMPTY,
  [EMITEVENTS.COLUMN_SORT]: EMPTY,
  [EMITEVENTS.ROW_CLICK]: EMPTY,
  [EMITEVENTS.ROW_DBL_CLICK]: EMPTY,
  [EMITEVENTS.ROW_EXPAND_CLICK]: EMPTY,
  [EMITEVENTS.PAGE_LIMIT_CHANGE]: EMPTY,
  [EMITEVENTS.PAGE_VALUE_CHANGE]: EMPTY,
  [EMITEVENTS.SETTING_CHANGE]: EMPTY,
  [EMITEVENTS.SCROLL_BOTTOM]: EMPTY,
};

/**
 * Table Row Attributes
 */
export const TABLE_ROW_ATTRIBUTE = {
  ROW_INDEX: '__$table_row_index',
  ROW_UID: '__$uuid',
  ROW_EXPAND: '__row_expand',
};
