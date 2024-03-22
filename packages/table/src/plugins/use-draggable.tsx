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

  const placeDiv = document.createElement('div');
  placeDiv.style.setProperty('height', '20px');
  placeDiv.style.setProperty('width', '100%');
  placeDiv.style.setProperty('background', '#E2EDFF');
  placeDiv.style.setProperty('cursor', 'move');
  ['dragenter', 'dragover'].forEach(type => {
    placeDiv.addEventListener(type, event => {
      event.preventDefault();
      event.stopPropagation();
      event.dataTransfer.dropEffect = 'move';
    });
  });

  let lastDragRow: HTMLElement | null = null;
  let lastDragRowClass = '';

  const insertPlaceDiv = (target: HTMLElement, placement) => {
    if (placement === '--top') {
      target.parentNode.insertBefore(placeDiv, target);
      return;
    }

    if (target.nextElementSibling === null) {
      target.parentNode.append(placeDiv);
      return;
    }

    target.parentNode.insertBefore(placeDiv, target.nextElementSibling);
  };

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
    const placement = y - top > bottom - y ? '--bottom' : '--top';
    removeDragClass(target);
    target.classList.add(placement);
    insertPlaceDiv(target, placement);
  };

  const removeDragClass = (target: HTMLElement, classList = ['--bottom', '--top']) => {
    classList.forEach(pos => target.classList.remove(pos));
  };

  const onDragstart = (event: DragEvent) => {
    beforeEventFire(() => {
      const target = getTargetRow(event);

      placeDiv.style.setProperty('height', `${target.offsetHeight}px`);
      placeDiv.style.setProperty('width', `${target.offsetWidth}px`);

      target.classList.add('--drag-start');

      event.dataTransfer.setDragImage(target, 0, 0);
      event.dataTransfer.setData('text/plain', null);
      event.dataTransfer.dropEffect = 'move';
      const { rowIndex } = (event.target as HTMLElement).dataset;
      event.dataTransfer.setData('data-row-index', rowIndex);
    });
  };

  const onDragenter = (event: DragEvent) => {
    const target = getTargetRow(event);
    event.preventDefault();
    event.stopPropagation();
    beforeEventFire(() => {
      event.dataTransfer.dropEffect = 'move';
      target.classList.add('--drag-enter');
      setTargetRowPlacement(target, event);
      lastDragRow = target;
    });
  };

  const onDragleave = (_event: DragEvent) => {
    beforeEventFire(() => {
      const target = getTargetRow(event);
      lastDragRowClass = target.classList.contains('--bottom') ? '--bottom' : '--top';
      removeDragClass(target, ['--drag-enter', '--bottom', '--top']);
    });
  };

  const onDragover = (event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = 'move';
    const target = getTargetRow(event);
    setTargetRowPlacement(target, event);
  };

  const onDragend = (event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    placeDiv.remove();

    if (!lastDragRow) {
      return;
    }

    const target = lastDragRow;
    const { rowIndex } = target.dataset;
    let targetIndex = Number(rowIndex);
    const sourceIndex = event.target.dataset?.rowIndex;
    if (lastDragRowClass === '--bottom') {
      targetIndex = targetIndex + 1;
    }
    resp.changePageRowIndex(Number(sourceIndex), targetIndex);

    lastDragRow = null;
    lastDragRowClass = '';
    ctx.emit(EMIT_EVENTS.DRAG_END, { sourceEvent: event, data: resp.pageData });
  };

  return {
    onDragenter,
    onDragleave,
    onDragstart,
    onDragover,
    onDragend,
  };
};
