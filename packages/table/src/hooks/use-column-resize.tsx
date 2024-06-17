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
import { ref, watch } from 'vue';

import { throttle } from '@bkui-vue/shared';

import { COLUMN_ATTRIBUTE } from '../const';
import { Column } from '../props';
import { UseColumns } from './use-columns';
import { debounce } from 'lodash';

export default (columns: UseColumns, { afterResize }) => {
  const { getColumnAttribute, getColumnOrderWidth, setColumnAttribute } = columns;
  const getColListener = (col: Column) => getColumnAttribute(col, COLUMN_ATTRIBUTE.LISTENERS) as Map<string, any>;

  const pluginName = 'HeadColumnResize';
  const enum EVENTS {
    MOUSE_DOWN = 'onMousedown',
    MOUSE_MOVE = 'onMousemove',
    MOUSE_OUT = 'onMouseout',
  }
  let isInDragSection = false;
  let isMouseDown = false;
  let isDraging = false;
  let startX = 0;
  let dragColumn: Column = null;
  let dragStartOffsetX = 0;
  const dragOffsetX = ref(-1000);
  const ORDER_LIST = [COLUMN_ATTRIBUTE.RESIZE_WIDTH, COLUMN_ATTRIBUTE.CALC_WIDTH];

  const stopDefaultEvent = (e: MouseEvent) => {
    e.stopImmediatePropagation();
    e.stopPropagation();
    e.preventDefault();
  };

  const handleMouseUp = (e: MouseEvent) => {
    stopDefaultEvent(e);

    isMouseDown = false;
    isDraging = false;

    const diff = e.clientX - startX;

    const resolveWidth = getColumnOrderWidth(dragColumn, ORDER_LIST) + diff;
    const minWidth = getColumnOrderWidth(dragColumn, [COLUMN_ATTRIBUTE.COL_MIN_WIDTH]);
    const calcWidth = resolveWidth > minWidth ? resolveWidth : minWidth;
    setColumnAttribute(dragColumn, COLUMN_ATTRIBUTE.RESIZE_WIDTH, calcWidth);
    setColumnAttribute(dragColumn, COLUMN_ATTRIBUTE.CALC_WIDTH, calcWidth);

    document.removeEventListener('mouseup', handleMouseUp);
    document.removeEventListener('mousemove', handleMouseMove);

    startX = 0;
    dragOffsetX.value = -1000;
    dragColumn = null;
    const target = (e.target as HTMLElement).closest('th');
    removeCursor(target);

    afterResize?.();
  };

  const updateOffsetX = (e: MouseEvent) =>
    throttle(() => {
      const diff = e.clientX - startX;
      const resolveWidth = getColumnOrderWidth(dragColumn, ORDER_LIST) + diff;
      const minWidth = getColumnOrderWidth(dragColumn, [COLUMN_ATTRIBUTE.COL_MIN_WIDTH]);

      if (minWidth < resolveWidth) {
        dragOffsetX.value = e.clientX - startX + dragStartOffsetX;
      }
    });

  const handleMouseMove = (e: MouseEvent) => {
    stopDefaultEvent(e);
    updateOffsetX(e)();
  };

  const setNodeCursor = (() => {
    return debounce((target: HTMLElement) => {
      target?.style?.setProperty('cursor', 'col-resize');
      target?.classList.add('col-resize-hover');
    });
  })();

  const removeCursor = (target: HTMLElement) => {
    setNodeCursor.cancel();

    target.style?.removeProperty('cursor');
    target?.classList.remove('col-resize-hover');
  };

  const handler = {
    [EVENTS.MOUSE_DOWN]: (e: MouseEvent, column: Column) => {
      if (!isInDragSection) {
        return;
      }

      isMouseDown = true;
      const target = (e.target as HTMLElement).closest('th');
      setColumnAttribute(column, COLUMN_ATTRIBUTE.COL_IS_DRAG, true);
      setColumnAttribute(column, COLUMN_ATTRIBUTE.CALC_WIDTH, target.scrollWidth);
      setNodeCursor(target);

      dragColumn = column;
      startX = e.clientX;

      const targetTable = (e.target as HTMLElement).closest('table');
      dragStartOffsetX = startX - targetTable.getBoundingClientRect().left;
      updateOffsetX(e)();

      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('mousemove', handleMouseMove);
    },
    [EVENTS.MOUSE_MOVE]: (e: MouseEvent, _column: Column) => {
      if (isMouseDown && !isDraging) {
        isDraging = true;
      }

      const target = (e.target as HTMLElement).closest('th');
      if (isDraging) {
        target.style.setProperty('user-select', 'none');
      }

      if (!isDraging) {
        if (!target) {
          return;
        }

        const rect = target.getBoundingClientRect();
        if (rect.width > 12 && rect.right - e.pageX < 12) {
          isInDragSection = true;
          setNodeCursor(target);
        } else {
          removeCursor(target);
          isInDragSection = false;
        }
      }
    },
    [EVENTS.MOUSE_OUT]: (e: MouseEvent, _column: Column) => {
      const target = (e.target as HTMLElement).closest('th');
      if (!isDraging) {
        removeCursor(target);
      }
    },
  };

  const getEventName = (event: string) => `${pluginName}_${event}`;

  const registerResizeEvent = () => {
    columns.tableColumnList.forEach(col => {
      if (columns.getColumnAttribute(col, COLUMN_ATTRIBUTE.COL_RESIZEABLE)) {
        const target = getColListener(col);
        Object.keys(handler).forEach((event: string) => {
          const name = getEventName(event);

          if (!target?.has(name)) {
            target.set(name, []);
          }

          target.get(name).push(handler[event]);
        });
      }
    });
  };

  const resetResizeEvents = () => {
    columns.tableColumnList.forEach(col => {
      const target = getColListener(col);
      Object.keys(handler).forEach((event: string) => {
        const name = getEventName(event);
        if (target?.has(name)) {
          const listeners = target.get(name);
          listeners.length = 0;
        }
      });
    });
  };

  watch(
    () => [columns.tableColumnList],
    () => {
      resetResizeEvents();
      registerResizeEvent();
    },
    { immediate: true, deep: true },
  );

  return {
    dragOffsetX,
  };
};
