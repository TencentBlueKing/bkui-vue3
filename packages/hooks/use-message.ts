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

import { createVNode, nextTick, render } from 'vue';

import { isElement } from '@bkui-vue/shared';

const instances = {
  'top-left': [],
  'top-right': [],
  'bottom-left': [],
  'bottom-right': [],
};
let seed = 1;

// 更新指定位置的所有 Message 实例的位置
const updateModalPosition = (position: string, spacing: number) => {
  const initialOffset = 30;
  let offsetTop = initialOffset;

  instances[position].forEach(vm => {
    if (vm.el) {
      // 获取当前实例的实际高度（包括详情展开后的高度）
      const currentHeight = vm.el.offsetHeight || 0;
      // 直接更新 DOM 元素的 top 样式，确保位置立即生效
      vm.el.style.top = `${offsetTop}px`;
      // 同时更新 props，保持数据一致性
      vm.props.offsetY = offsetTop;
      // 然后累加当前实例的高度和间距，用于计算下一个实例的位置
      offsetTop += currentHeight + spacing;
    }
  });
};

const Message = (constructor: any, options: any) => {
  let opts = options;
  const position = opts.position || 'top-right';
  if (typeof options === 'string') {
    opts = {
      message: options,
    };
  }
  const userOnClose = options.onClose;

  const horizontalOffset: number = opts.offsetX || 10;
  let verticalOffset: number = opts.offsetY || 30;
  const { spacing = 10 } = opts;
  instances[position].forEach(vm => {
    verticalOffset += (vm.el.offsetHeight || 0) + spacing;
  });

  seed += 1;
  const id = `message_${seed}`;

  opts = {
    ...opts,
    offsetX: horizontalOffset,
    offsetY: verticalOffset,
    id,
    spacing,
  };

  const container = document.createElement('div');
  const vm = createVNode(constructor, opts);

  vm.props.onDestroy = (id: string) => {
    close(id, position, spacing, userOnClose);
    render(null, container);
  };

  vm.props.onDetail = (_isShow: boolean, id: string) => {
    instances[position].forEach(item => {
      if (item.props.id !== id) {
        // 关闭其他实例的详情时，传入 shouldEmit = false 避免触发无限循环
        item.component?.exposed?.setDetailsShow(null, false, false);
      }
    });

    // 等待 DOM 更新完成后再更新位置
    // 详情展开/收起时，DOM 高度会变化，需要等待渲染完成
    // 由于事件已经在详情内容渲染完成后才 emit，这里只需要等待 Vue 响应式更新和浏览器布局完成
    const currentSpacing = spacing || 10;
    nextTick(() => {
      requestAnimationFrame(() => {
        updateModalPosition(position, currentSpacing);
      });
    });
  };

  render(vm, container);
  instances[position].push(vm);

  let target: HTMLElement;
  if (vm.props.getContainer && isElement(vm.props.getContainer)) {
    target = vm.props.getContainer;
  } else {
    target = document.body;
  }
  target.appendChild(container.firstElementChild);
};

function close(id: string, position: string, spacing: number, userOnClose): void {
  userOnClose?.();
  let instanceIndex = -1;
  instances[position].forEach((item, index) => {
    if (item.props.id === id) {
      instanceIndex = index;
    }
  });

  if (instanceIndex === -1) {
    return;
  }

  // 移除实例
  instances[position].splice(instanceIndex, 1);

  // 重新计算所有剩余实例的位置
  // 使用传入的 spacing，如果没有则从第一个实例获取，或使用默认值 10
  const currentSpacing = spacing || (instances[position].length > 0 ? instances[position][0].props.spacing : 10) || 10;
  nextTick(() => {
    updateModalPosition(position, currentSpacing);
  });
}

export default Message;
