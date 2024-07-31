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

import { debounce, throttle } from 'lodash';

import { COLUMN_ATTRIBUTE } from '../const';
import { Column } from '../props';
import { UseColumns } from './use-columns';

export default (columns: UseColumns, { afterResize }) => {
  const { getColumnAttribute, getColumnOrderWidth, setColumnAttribute, setNextColumnWidth, getPreColumn } = columns;
  const getColListener = (col: Column) =>
    getColumnAttribute(col, COLUMN_ATTRIBUTE.LISTENERS) as Map<string, ((...args) => void)[]>;

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
  let poinerPlacement = 'right';
  let headTable = null;
  let mouseMoveColumn = null;
  let dragWidth = 0;
  const cellCursorStore = new WeakMap();

  const dragOffsetX = ref(-1000);
  const ORDER_LIST = [COLUMN_ATTRIBUTE.WIDTH];

  const stopDefaultEvent = (e: MouseEvent) => {
    e.stopImmediatePropagation();
    e.stopPropagation();
    e.preventDefault();
  };

  const handleMouseUp = (e: MouseEvent) => {
    stopDefaultEvent(e);
    isMouseDown = false;
    isDraging = false;

    const resolveWidth = getColumnOrderWidth(dragColumn, ORDER_LIST) + dragWidth;
    const minWidth = getColumnOrderWidth(dragColumn, [COLUMN_ATTRIBUTE.COL_MIN_WIDTH]);
    const calcWidth = resolveWidth > minWidth ? resolveWidth : minWidth;
    setNextColumnWidth(dragColumn, calcWidth);
    setColumnAttribute(dragColumn, COLUMN_ATTRIBUTE.WIDTH, calcWidth);

    document.removeEventListener('mouseup', handleMouseUp);

    dragOffsetX.value = -1000;
    dragWidth = 0;
    removeCursor(headTable);

    afterResize?.();
    headTable = null;
    const target = e.target as HTMLElement;
    handleMouseoutDragSection(target);
    dragColumn = null;
  };

  const throttleUpdateDragOffsetX = throttle((diff: number) => {
    dragOffsetX.value = dragOffsetX.value + diff;
  });

  const handleMouseDragMove = (e: MouseEvent) => {
    stopDefaultEvent(e);
    document.body.style.setProperty('user-select', 'none');
    const diff = e.clientX - startX;
    dragWidth = dragWidth + diff;
    startX = e.clientX;

    const resolveWidth = getColumnOrderWidth(dragColumn, ORDER_LIST) + diff;
    const minWidth = getColumnOrderWidth(dragColumn, [COLUMN_ATTRIBUTE.COL_MIN_WIDTH]);

    if (minWidth < resolveWidth) {
      throttleUpdateDragOffsetX(diff);
    }
  };

  const setNodeCursor = (() => {
    return debounce((target: HTMLElement) => {
      document.body.style.setProperty('user-select', 'none');
      target?.classList.add('col-resize-hover');
    });
  })();

  const removeCursor = (target: HTMLElement) => {
    setNodeCursor.cancel();

    document.body.style.removeProperty('user-select');
    target?.classList.remove('col-resize-hover');
  };

  const handlemouseDownEvent = (e: MouseEvent) => {
    if (!isInDragSection) {
      return;
    }

    removePointerClass(e.target as HTMLElement);
    startX = e.clientX;
    const column = poinerPlacement === 'left' ? getPreColumn(mouseMoveColumn) : mouseMoveColumn;
    setColumnAttribute(column, COLUMN_ATTRIBUTE.COL_IS_DRAG, true);
    dragColumn = column;
    headTable = (e.target as HTMLElement).closest('table') as HTMLElement;
    const rect = headTable.getBoundingClientRect();
    dragOffsetX.value = e.clientX - rect.left;

    setNodeCursor(headTable);
    isMouseDown = true;

    document.addEventListener('mouseup', handleMouseUp);
  };

  const removePointerClass = (target: HTMLElement) => {
    const targetElements = target?.parentElement?.parentElement?.querySelectorAll('.col-pointer-hover');
    targetElements.forEach(element => {
      element?.classList.remove('col-pointer-hover');
      element?.classList.remove('poiner-left');
      element?.classList.remove('poiner-right');
    });
  };

  const addPointerClass = (target: HTMLElement, poinerPlacement: string) => {
    const targetTh = target.parentElement;
    targetTh?.classList.add('col-pointer-hover');
    targetTh?.classList.add(`poiner-${poinerPlacement}`);

    const nextTarget = poinerPlacement === 'right' ? targetTh.nextElementSibling : targetTh.previousElementSibling;

    const nextPlacement = poinerPlacement === 'right' ? 'left' : 'right';
    nextTarget?.classList.add('col-pointer-hover');
    nextTarget?.classList.add(`poiner-${nextPlacement}`);
  };

  const handleMouseoutDragSection = (target: HTMLElement) => {
    if (!isDraging) {
      dragOffsetX.value = -1000;
      target.classList.remove('cell-resize');
      removePointerClass(target);

      cellCursorStore.set(target, false);
      document.removeEventListener('mousedown', handlemouseDownEvent);
    }
  };

  const handler = {
    [EVENTS.MOUSE_MOVE]: (e: MouseEvent, column: Column, index: number) => {
      stopDefaultEvent(e);

      if (isMouseDown) {
        isDraging = true;
        handleMouseDragMove(e);
        return;
      }

      const target = e.target as HTMLElement;

      if (!isDraging) {
        if (!target) {
          return;
        }

        const { offsetWidth } = target;
        const mouseOffsetX = e.offsetX;

        if (offsetWidth > 12 && (offsetWidth - mouseOffsetX < 8 || (mouseOffsetX < 8 && index > 0))) {
          isInDragSection = true;
          poinerPlacement = mouseOffsetX < 8 ? 'left' : 'right';

          if (!cellCursorStore.get(target)) {
            cellCursorStore.set(target, true);
            target.classList.add('cell-resize');

            addPointerClass(target, poinerPlacement);
            mouseMoveColumn = column;

            document.addEventListener('mousedown', handlemouseDownEvent);
          }
        } else {
          isInDragSection = false;
          handleMouseoutDragSection(target);
        }
      }
    },
    [EVENTS.MOUSE_OUT]: (e: MouseEvent, _column: Column, _index?: number) => {
      const target = e.target as HTMLElement;
      handleMouseoutDragSection(target);
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
