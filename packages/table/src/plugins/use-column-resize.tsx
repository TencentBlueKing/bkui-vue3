
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
import { computed, ref } from 'vue';

import { GroupColumn } from '../props';

export default (colgroups: GroupColumn[], immediate = true) => {
  const pluginName = 'HeadColumnResize';
  const enum EVENTS {
    MOUSE_MOVE = 'onMousemove',
    MOUSE_OUT = 'onMouseout',
    MOUSE_DOWN ='onMousedown'
  };
  let isInDragSection = false;
  let isMouseDown = false;
  let isDraging = false;
  let startX = 0;
  let dragColumn: GroupColumn = null;
  let dragStartOffsetX = 0;
  const dragOffsetX = ref(-1000);

  const handleMouseUp = (e: MouseEvent) => {
    isMouseDown = false;
    isDraging = false;
    const bodyStyle = document.body.style;
    bodyStyle.cursor = '';

    const diff = e.clientX - startX;
    dragColumn.resizeWidth = (dragColumn.resizeWidth ?? dragColumn.calcWidth) + diff;

    document.removeEventListener('mouseup', handleMouseUp);
    document.removeEventListener('mousemove', handleMouseMove);

    startX = 0;
    dragOffsetX.value = -1000;
    dragColumn = null;

    const targetTable = (e.target as HTMLElement).closest('table');
    targetTable.querySelectorAll('th').forEach((th: HTMLElement) => th.style.setProperty('user-select', 'inherit'));
  };

  const handleMouseMove = (e: MouseEvent) => {
    const bodyStyle = document.body.style;
    bodyStyle.setProperty('cursor', '');
    dragOffsetX.value = e.clientX - startX + dragStartOffsetX;
  };

  const handler = {
    [EVENTS.MOUSE_DOWN]: (e: MouseEvent, column: GroupColumn) => {
      if (!isInDragSection) {
        return;
      }
      isMouseDown = true;
      const bodyStyle = document.body.style;
      bodyStyle.setProperty('cursor', 'col-resize');

      dragColumn = column;
      startX = e.clientX;

      const targetTable = (e.target as HTMLElement).closest('table');
      dragStartOffsetX = startX - targetTable.getBoundingClientRect().left;

      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('mousemove', handleMouseMove);
    },
    [EVENTS.MOUSE_MOVE]: (e: MouseEvent, _column: GroupColumn) => {
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
        if (rect.width > 12 && rect.right - e.pageX < 8) {
          isInDragSection = true;
          target.style.setProperty('cursor', 'col-resize');
        } else {
          isInDragSection = false;
        }
      }
    },
    [EVENTS.MOUSE_OUT]: (e: MouseEvent, _column: GroupColumn) => {
      const target = e.target as HTMLElement;
      if (!isDraging) {
        target.style.setProperty('cursor', '');
      }
    },
  };

  const getEventName = (event: string) => `${pluginName}_${event}`;

  const registerResizeEvent = () => {
    colgroups.forEach((col) => {
      if (col.resizable !== false) {
        Object.keys(handler).forEach((event: string) => {
          const name = getEventName(event);
          if (!col.listeners.has(name)) {
            col.listeners.set(name, []);
          }

          col.listeners.get(name).push(handler[event]);
        });
      }
    });
  };

  const resetResizeEvents = () => {
    colgroups.forEach((col) => {
      Object.keys(handler).forEach((event: string) => {
        const name = getEventName(event);
        if (col.listeners.has(name)) {
          const listeners = col.listeners.get(name);
          listeners.splice(0, listeners.length);
        }
      });
    });
  };

  if (immediate) {
    registerResizeEvent();
  }

  const dragOffsetXStyle = computed(() => ({
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: `${dragOffsetX.value}px`,
    width: '1px',
    'background-color': '#ebeef5',
  } as const));

  return {
    registerResizeEvent,
    resetResizeEvents,
    dragOffsetX,
    dragOffsetXStyle,
  };
};
