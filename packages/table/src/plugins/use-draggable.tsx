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

import { SetupContext } from 'vue';

import { EMIT_EVENTS } from '../events';
import { TablePropTypes } from '../props';
import { ITableResponse } from '../use-attributes';

export default (props: TablePropTypes, resp: ITableResponse, ctx: SetupContext<any>) => {
  if (!props.rowDraggable) {
    return {};
  }

  const beforeEventFire = (fn?: () => void) => {
    if (props.rowDraggable) {
      fn?.();
    }
  };

  const getTargetRow = (event: DragEvent) => {
    return (event.target as HTMLElement).closest('tr');
  };

  const setTargetRowPlacement = (target: HTMLElement, event: DragEvent) => {
    const { y } = event;
    const { top, bottom } = target.getBoundingClientRect();
    const position = y - top > bottom - y ? '--bottom' : '--top';
    removeDragClass(target);
    target.classList.add(position);
  };

  const removeDragClass = (target: HTMLElement, classList = ['--bottom', '--top']) => {
    classList.forEach(pos => target.classList.remove(pos));
  };

  const onDragstart = (event: DragEvent) => {
    beforeEventFire(() => {
      const target = getTargetRow(event);
      target.classList.add('--drag-start');
      event.dataTransfer.setData('text/plain', null);
      event.dataTransfer.dropEffect = 'copy';
      const { rowIndex } = (event.target as HTMLElement).dataset;
      event.dataTransfer.setData('data-row-index', rowIndex);
    });
  };

  const onDragenter = (event: DragEvent) => {
    beforeEventFire(() => {
      event.dataTransfer.dropEffect = 'move';
      const target = getTargetRow(event);
      target.classList.add('--drag-enter');
      setTargetRowPlacement(target, event);
    });
  };

  const onDragleave = (event: DragEvent) => {
    beforeEventFire(() => {
      const target = getTargetRow(event);
      removeDragClass(target, ['--drag-enter', '--bottom', '--top']);
    });
  };

  const onDragover = (event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    const target = getTargetRow(event);
    setTargetRowPlacement(target, event);
  };

  const onDrop = (event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const target = getTargetRow(event);
    const { rowIndex } = target.dataset;
    let targetIndex = Number(rowIndex);
    const sourceIndex = event.dataTransfer.getData('data-row-index');
    if (target.classList.contains('--bottom')) {
      targetIndex = targetIndex + 1;
    }
    resp.changePageRowIndex(Number(sourceIndex), targetIndex);
    removeDragClass(target, ['--drag-enter', '--bottom', '--top']);
    ctx.emit(EMIT_EVENTS.DRAG_END, { sourceEvent: event, data: resp.pageData });
  };

  return {
    onDragenter,
    onDragleave,
    onDragstart,
    onDragover,
    onDrop,
  };
};
