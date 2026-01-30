/*
 * Tencent is pleased to support the open source community by making
 * 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
 *
 * Copyright (C) 2025 Tencent.  All rights reserved.
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

import debounce from 'lodash/debounce';

import { COLUMN_ATTRIBUTE } from '../const';
import { Column } from '../props';
import { UseColumns } from './use-columns';

type ResizeOptions = {
  afterResize?: () => void;
  /** 推送给 use-layout.setDragOffsetX，避免 table.tsx 再额外 watch 一层 */
  onDragOffsetXChange?: (val: number) => void;
  /** 用于计算辅助线位置基准（应为 Table root 节点） */
  getRootEl?: () => HTMLElement | null;
  /** 当前横向滚动偏移（use-layout.translateX） */
  getTranslateX?: () => number;
};

export default (columns: UseColumns, { afterResize, onDragOffsetXChange, getRootEl, getTranslateX }: ResizeOptions) => {
  const { getColumnAttribute, getColumnOrderWidth, setColumnAttribute, getPreColumn, setColumnResizeWidth } = columns;
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
  let startClientX = 0;
  let startColWidth = 0;
  let startDragOffsetX = 0;
  let minWidth = 0;
  let maxWidth = Infinity;
  let latestClampedWidth = 0;
  let dragColumn: Column = null;
  let poinerPlacement = 'right';
  let headTable: HTMLElement | null = null;
  let mouseMoveColumn = null;
  const cellCursorStore = new WeakMap();

  const dragOffsetX = ref(-1000);

  const preventSelection = (e: MouseEvent) => {
    e.preventDefault();
  };

  const setDragOffset = (val: number) => {
    dragOffsetX.value = val;
    onDragOffsetXChange?.(val);
  };

  const resolveDragOffsetX = (boundaryClientX: number) => {
    const root = getRootEl?.() ?? headTable?.closest('div');
    const rect = root?.getBoundingClientRect();
    if (!rect) return -1000;
    const tx = getTranslateX?.() ?? 0;
    // use-layout 会做：--drag-offset-x = dragOffsetX + translateX
    // 因此这里存 “相对 root 的 x - translateX”，避免在横向滚动时漂移
    return boundaryClientX - rect.left - tx;
  };

  const cleanupDrag = () => {
    isMouseDown = false;
    isDraging = false;
    document.body.style.removeProperty('user-select');
    document.removeEventListener('mousemove', handleDocumentMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
    setDragOffset(-1000);
    if (dragColumn) {
      setColumnAttribute(dragColumn, COLUMN_ATTRIBUTE.COL_IS_DRAG, false);
    }
    removeCursor(headTable as HTMLElement);
    headTable = null;
    dragColumn = null;
  };

  const applyResizeResultByWidth = (targetWidth: number) => {
    if (!dragColumn) return;

    const baseWidth = Math.min(Math.max(targetWidth, minWidth), maxWidth);

    // 同时约束“下一列”不小于 minWidth（如果存在），避免出现宽度负值/跳变
    const colIndex = columns.getColumnIndex(dragColumn);
    const nextColumn = columns.visibleColumns[colIndex + 1];
    if (nextColumn) {
      const nextStartWidth = getColumnOrderWidth(nextColumn);
      const nextMin = getColumnOrderWidth(nextColumn, [COLUMN_ATTRIBUTE.COL_MIN_WIDTH]);
      const total = startColWidth + nextStartWidth;
      const maxDrag = total - nextMin;
      const dragWidth = Math.min(Math.max(baseWidth, minWidth), maxDrag);
      const nextWidth = total - dragWidth;
      setColumnResizeWidth(nextColumn, nextWidth);
      setColumnResizeWidth(dragColumn, dragWidth);
      return;
    }

    setColumnResizeWidth(dragColumn, baseWidth);
  };

  const handleMouseUp = (e: MouseEvent) => {
    preventSelection(e);
    // 关键：mouseup 可能发生在最后一次 rAF flush 之前，
    // 若直接用 e.clientX 结算，会出现“松开后比拖拽中显示更跳”的偏差。
    latestClientX = e.clientX;
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
      flushDragMove();
    } else {
      // 没有 pending 的 rAF，也要确保 latestClampedWidth 与当前 clientX 对齐
      const delta = latestClientX - startClientX;
      const resolved = startColWidth + delta;
      latestClampedWidth = Math.min(Math.max(resolved, minWidth), maxWidth);
      const appliedDelta = latestClampedWidth - startColWidth;
      setDragOffset(startDragOffsetX + appliedDelta);
    }

    applyResizeResultByWidth(latestClampedWidth);
    afterResize?.();
    handleMouseoutDragSection((e.target as HTMLElement) ?? null);
    cleanupDrag();
  };

  // rAF 驱动：mousemove 只记录最新坐标，每帧最多更新一次辅助线
  let rafId = 0;
  let latestClientX = 0;
  const flushDragMove = () => {
    rafId = 0;
    const delta = latestClientX - startClientX;
    const resolved = startColWidth + delta;
    const finalWidth = Math.min(Math.max(resolved, minWidth), maxWidth);
    latestClampedWidth = finalWidth;
    const appliedDelta = latestClampedWidth - startColWidth;
    setDragOffset(startDragOffsetX + appliedDelta);
  };

  const handleDocumentMouseMove = (e: MouseEvent) => {
    preventSelection(e);
    latestClientX = e.clientX;
    if (!rafId) {
      rafId = requestAnimationFrame(flushDragMove);
    }
  };

  const startDrag = (e: MouseEvent, column: Column, boundaryClientX: number) => {
    startClientX = e.clientX;
    startColWidth = getColumnOrderWidth(column);
    minWidth = getColumnOrderWidth(column, [COLUMN_ATTRIBUTE.COL_MIN_WIDTH]);
    latestClampedWidth = startColWidth;

    // 防护：宽度异常时直接终止，避免辅助线归零/NaN 扩散
    if (!Number.isFinite(startColWidth) || startColWidth <= 0) {
      cleanupDrag();
      return;
    }

    // 约束最大宽度：保证下一列不小于 minWidth（如果存在）
    const colIndex = columns.getColumnIndex(column);
    const nextColumn = columns.visibleColumns[colIndex + 1];
    if (nextColumn) {
      const nextStartWidth = getColumnOrderWidth(nextColumn);
      const nextMin = getColumnOrderWidth(nextColumn, [COLUMN_ATTRIBUTE.COL_MIN_WIDTH]);
      maxWidth = startColWidth + (nextStartWidth - nextMin);
    } else {
      maxWidth = Infinity;
    }

    startDragOffsetX = resolveDragOffsetX(boundaryClientX);
    setDragOffset(startDragOffsetX);

    document.body.style.setProperty('user-select', 'none');
    document.addEventListener('mousemove', handleDocumentMouseMove, { passive: false });
    document.addEventListener('mouseup', handleMouseUp, { passive: false });
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

    preventSelection(e);
    const target = e.target as HTMLElement;
    removePointerClass(target);

    const th = target?.closest('th') as HTMLElement;
    if (!th) {
      return;
    }

    const column = poinerPlacement === 'left' ? getPreColumn(mouseMoveColumn) : mouseMoveColumn;
    setColumnAttribute(column, COLUMN_ATTRIBUTE.COL_IS_DRAG, true);
    dragColumn = column;
    headTable = target.closest('table') as HTMLElement;

    // 用边界线而不是鼠标位置作为基准，避免辅助线“飘”
    const thRect = th.getBoundingClientRect();
    const boundaryClientX = poinerPlacement === 'left' ? thRect.left : thRect.right;
    startDrag(e, column, boundaryClientX);

    setNodeCursor(headTable);
    isMouseDown = true;
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
      if (target) {
        target.classList.remove('cell-resize');
        removePointerClass(target);
      }

      if (target) {
        cellCursorStore.set(target, false);
      }
      document.removeEventListener('mousedown', handlemouseDownEvent);
      setDragOffset(-1000);
    }
  };

  const handler = {
    [EVENTS.MOUSE_MOVE]: (e: MouseEvent, column: Column, index: number) => {
      if (isMouseDown) {
        isDraging = true;
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
