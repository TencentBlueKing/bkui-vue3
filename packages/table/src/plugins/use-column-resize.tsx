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
import isElement from 'lodash/isElement';
import throttle from 'lodash/throttle';
import { computed, type Ref, ref } from 'vue';

import { COLUMN_ATTRIBUTE } from '../const';
import { Column } from '../props';
import { ITableResponse } from '../use-attributes';

export default (tableResp: ITableResponse, immediate = true, head: Ref<HTMLElement>) => {
  const { formatData, getColumnAttribute, getColumnOrderWidth, setColumnAttribute } = tableResp;
  const getColListener = (col: Column) => getColumnAttribute(col, COLUMN_ATTRIBUTE.LISTENERS) as Map<string, any>;

  const pluginName = 'HeadColumnResize';
  const enum EVENTS {
    MOUSE_MOVE = 'onMousemove',
    MOUSE_OUT = 'onMouseout',
    MOUSE_DOWN = 'onMousedown',
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
    const bodyStyle = document.body.style;
    bodyStyle.cursor = '';

    const diff = e.clientX - startX;

    const resolveWidth = getColumnOrderWidth(dragColumn, ORDER_LIST) + diff;
    const minWidth = getColumnOrderWidth(dragColumn, [COLUMN_ATTRIBUTE.COL_MIN_WIDTH]);
    setColumnAttribute(dragColumn, COLUMN_ATTRIBUTE.RESIZE_WIDTH, resolveWidth > minWidth ? resolveWidth : minWidth);

    setTimeout(() => tableResp.setAllColumnAttribute(COLUMN_ATTRIBUTE.COL_IS_DRAG, false));
    document.removeEventListener('mouseup', handleMouseUp);
    document.removeEventListener('mousemove', handleMouseMove);

    startX = 0;
    dragOffsetX.value = -1000;
    dragColumn = null;

    const targetTable = head.value?.querySelector('table');
    targetTable?.querySelectorAll('th').forEach((th: HTMLElement) => th.style.setProperty('user-select', 'inherit'));
  };

  const updateOffsetX = (e: MouseEvent) =>
    throttle(() => {
      const diff = e.clientX - startX;
      const resolveWidth = getColumnOrderWidth(dragColumn, ORDER_LIST) + diff;
      const minWidth = getColumnOrderWidth(dragColumn, [COLUMN_ATTRIBUTE.COL_MIN_WIDTH]);

      if (minWidth < resolveWidth) {
        dragOffsetX.value = e.clientX - startX + dragStartOffsetX;
      }
    }, 60);

  const handleMouseMove = (e: MouseEvent) => {
    const bodyStyle = document.body.style;
    bodyStyle.setProperty('cursor', '');
    updateOffsetX(e)();
    stopDefaultEvent(e);
  };

  const setChildrenNodeCursor = (root: HTMLElement, cursor: string) => {
    if (isElement(root)) {
      root.style?.setProperty('cursor', cursor);
      if (root.childNodes?.length > 0) {
        root.childNodes.forEach(node => setChildrenNodeCursor(node as HTMLElement, cursor));
      }
    }
  };

  const handler = {
    [EVENTS.MOUSE_DOWN]: (e: MouseEvent, column: Column) => {
      if (!isInDragSection) {
        return;
      }
      isMouseDown = true;
      const target = (e.target as HTMLElement).closest('th');
      tableResp.setColumnAttribute(column, COLUMN_ATTRIBUTE.COL_IS_DRAG, true);
      tableResp.setColumnAttribute(column, COLUMN_ATTRIBUTE.CALC_WIDTH, target.scrollWidth);

      const bodyStyle = document.body.style;
      bodyStyle.setProperty('cursor', 'col-resize');

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
        target.classList.remove('col-resize-hover');
      }

      if (!isDraging) {
        if (!target) {
          target.classList.remove('col-resize-hover');
          return;
        }

        const rect = target.getBoundingClientRect();
        if (rect.width > 12 && rect.right - e.pageX < 8) {
          isInDragSection = true;
          setChildrenNodeCursor(target, 'col-resize');
          target.classList.add('col-resize-hover');
        } else {
          setChildrenNodeCursor(target, '');
          target.classList.remove('col-resize-hover');
          isInDragSection = false;
        }
      }
    },
    [EVENTS.MOUSE_OUT]: (e: MouseEvent, _column: Column) => {
      const target = (e.target as HTMLElement).closest('th');
      if (!isDraging) {
        setChildrenNodeCursor(target, '');
        target.classList.remove('col-resize-hover');
      }
    },
  };

  const getEventName = (event: string) => `${pluginName}_${event}`;

  const registerResizeEvent = () => {
    formatData.columns.forEach(col => {
      if (col.resizable !== false) {
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
    formatData.columns.forEach(col => {
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

  if (immediate) {
    registerResizeEvent();
  }

  const dragOffsetXStyle = {
    position: 'absolute' as const,
    top: 0,
    bottom: 0,
    left: 0,
    width: '1px',
    backgroundColor: '#3785FF',
    transform: 'translateX(-50%)',
  };

  const layout = computed(() => tableResp.formatData.layout);

  const resizeColumnStyle = computed(() => ({
    ...dragOffsetXStyle,
    transform: `translate(${dragOffsetX.value + 3}px, ${layout.value.translateY}px)`,
  }));

  const resizeHeadColStyle = computed(() => ({
    ...dragOffsetXStyle,
    width: '6px',
    transform: `translateX(${dragOffsetX.value}px)`,
  }));

  return {
    registerResizeEvent,
    resetResizeEvents,
    dragOffsetX,
    dragOffsetXStyle,
    resizeColumnStyle,
    resizeHeadColStyle,
  };
};
