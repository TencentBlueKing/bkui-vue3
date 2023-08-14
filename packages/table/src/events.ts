/* eslint-disable @typescript-eslint/naming-convention */
import { SORT_OPTION } from './const';
import { Column, IColumnActive } from './props';

export const enum EVENTS {
  /** 点击排序事件 */
  ON_SORT_BY_CLICK = 'onSortByClick',
  ON_FILTER_CLICK = 'onFilterClick',
  ON_SETTING_CHANGE = 'onSettingChange',

  ON_ROW_EXPAND_CLICK = 'onRowExpandClick',
  ON_ROW_CHECK = 'onRowCheck'
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const enum EMIT_EVENTS {
  COLUMN_PICK = 'columnPick',
  COLUMN_SORT = 'columnSort',
  COLUMN_FILTER = 'columnFilter',
  COLUMN_FILTER_SAVE = 'colFilterSave',

  ROW_CLICK = 'rowClick',
  ROW_DBL_CLICK = 'rowDblclick',
  ROW_EXPAND_CLICK = 'rowExpand',
  ROW_MOUSE_ENTER = 'rowMouseEnter',
  ROW_MOUSE_LEAVE = 'rowMouseLeave',

  PAGE_LIMIT_CHANGE = 'pageLimitChange',
  PAGE_VALUE_CHANGE = 'pageValueChange',

  SETTING_CHANGE = 'settingChange',

  SCROLL_BOTTOM = 'scrollBottom',

  ROW_SELECT = 'select',
  ROW_SELECT_ALL = 'selectAll',
  ROW_SELECT_CHANGE = 'selectionChange',

  CELL_CLICK = 'cellClick',
  CELL_DBL_CLICK = 'cellDblclick',

  NATIVE_CLICK = 'click',
  NATIVE_DBL_CLICK = 'dblclick'
}

export const EVENT_COL_PICK = (_cols: IColumnActive[]) => true;
export const EVENT_COL_FILTER = (_args: { checked: string[], column: Column, index: number }) => true;
export const EVENT_COL_FILTER_SAVE = (_args: { column: Column, values: Record<string, any>[] }) => true;
export const EVENT_COL_SORT = (_args: { column: Column, index: number, type: SORT_OPTION }) => true;

export const EVENT_MOUSE_FN = (
  _e: MouseEvent,
  _row: Record<string, any>,
  _index: number,
  _rows: Record<string, any>[],
  _this: any,
) => true;

export const EVENT_EXPAND_FN = (_args: {
  row: Record<string, any>,
  column: Column,
  index: Number,
  rows: Record<string, any>[],
  e: MouseEvent
}) => true;

export const EVENT_ROW_SELECT_FN = (_args: {
  row: Record<string, any>,
  index: Number,
  checked: string,
  data: Array<Record<string, any>>,
}) => true;

export const EVENT_ROW_SELECT_ALL_FN = (_args: {
  checked: string,
  data: Array<Record<string, any>>,
}) => true;

export const EVENT_ROW_SELECT_CHANGE_FN = (_args: {
  row: Record<string, any>,
  index: Number,
  checked: string,
  data: Array<Record<string, any>>,
  isAll: boolean
}) => true;

export const EVENT_PAGE_FN = (_arg: number) => true;
export const EVENT_SETTING_FN = (_args: {
  checked: string[],
  size: string,
  height: number,
  fields: Array<Record<string, any>>
}) => true;

export const EVENT_CELL_FN = (_args: {
  event: MouseEvent,
  row: Record<string, any>,
  column: Column,
  cell: {
    getValue: () => string,
  },
  rowIndex: number,
  columnIndex: number,
}) => true;

export const EVENT_SCROLL_FN = (_args: {
  translateX: number,
  translateY: number,
  scrollTop: number,
  scrollLeft: number,
  bottom: number,
}) => true;

export const EMIT_EVENT_TYPES = {
  [EMIT_EVENTS.COLUMN_PICK]: EVENT_COL_PICK,
  [EMIT_EVENTS.COLUMN_FILTER]: EVENT_COL_FILTER,
  [EMIT_EVENTS.COLUMN_SORT]: EVENT_COL_SORT,
  [EMIT_EVENTS.COLUMN_FILTER_SAVE]: EVENT_COL_FILTER_SAVE,

  [EMIT_EVENTS.ROW_CLICK]: EVENT_MOUSE_FN,
  [EMIT_EVENTS.ROW_DBL_CLICK]: EVENT_MOUSE_FN,
  [EMIT_EVENTS.ROW_EXPAND_CLICK]: EVENT_EXPAND_FN,

  [EMIT_EVENTS.ROW_SELECT]: EVENT_ROW_SELECT_FN,
  [EMIT_EVENTS.ROW_SELECT_ALL]: EVENT_ROW_SELECT_ALL_FN,
  [EMIT_EVENTS.ROW_SELECT_CHANGE]: EVENT_ROW_SELECT_CHANGE_FN,

  [EMIT_EVENTS.PAGE_LIMIT_CHANGE]: EVENT_PAGE_FN,
  [EMIT_EVENTS.PAGE_VALUE_CHANGE]: EVENT_PAGE_FN,

  [EMIT_EVENTS.SETTING_CHANGE]: EVENT_SETTING_FN,
  [EMIT_EVENTS.SCROLL_BOTTOM]: EVENT_SCROLL_FN,

  [EMIT_EVENTS.CELL_CLICK]: EVENT_CELL_FN,
  [EMIT_EVENTS.CELL_DBL_CLICK]: EVENT_CELL_FN,

  [EMIT_EVENTS.ROW_MOUSE_ENTER]: EVENT_MOUSE_FN,
  [EMIT_EVENTS.ROW_MOUSE_LEAVE]: EVENT_MOUSE_FN,
};

export const CELL_EVENT_TYPES = {
  [EMIT_EVENTS.NATIVE_CLICK]: EVENT_MOUSE_FN,
  [EMIT_EVENTS.NATIVE_DBL_CLICK]: EVENT_MOUSE_FN,
};
