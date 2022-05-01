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

import { createVNode, render } from 'vue';

const instances = {
  'top-left': [],
  'top-right': [],
  'bottom-left': [],
  'bottom-right': [],
};
let seed = 1;

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
  instances[position].forEach((vm) => {
    verticalOffset += (vm.el.offsetHeight || 0) + spacing;
  });

  seed += 1;
  const id = `message_${seed}`;

  opts = {
    ...opts,
    offsetX: horizontalOffset,
    offsetY: verticalOffset,
    id,
  };

  const container = document.createElement('div');
  const vm = createVNode(constructor, opts);

  vm.props.onDestory = (id: string) => {
    close(id, position, spacing, userOnClose);
    render(null, container);
  };

  render(vm, container);
  instances[position].push(vm);
  document.body.appendChild(container.firstElementChild);
};

function close(id: string, position: string, spacing: number, userOnClose): void {
  userOnClose?.();
  const verticalProperty = position.startsWith('top') ? 'top' : 'bottom';
  let instanceIndex = -1;
  instances[position].forEach((item, index) => {
    if (item.props.id === id) {
      instanceIndex = index;
    }
  });

  const vm = instances[position][instanceIndex];
  const removeHeight = vm.el.offsetHeight;
  const len = instances[position].length;
  for (let i = instanceIndex; i < len; i++) {
    const pos = parseInt(instances[position][i].el.style[verticalProperty], 10) - removeHeight - spacing;
    instances[position][i].component.props.offsetY = pos;
  }

  instances[position].splice(instanceIndex, 1);
}

export default Message;
