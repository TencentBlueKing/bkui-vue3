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
import { v4 as uuidv4 } from 'uuid';

import { isAvailableId, isElement } from './utils';

const popContainerId = `id_${uuidv4()}`;
export default (props, prefix = '#') => {
  // 为每个 popover 实例生成独立的 parentNodeReferId，避免嵌套时 ID 冲突
  const parentNodeReferId = `id_${uuidv4()}`;

  const getPrefixId = (root?) => {
    let resolvedBoundary = null;
    const resolveBoundary = (fn: () => void) => {
      if (resolvedBoundary === null) {
        fn();
      }
    };
    const resolveParentBoundary = () => {
      if (/^parent$/i.test(props.boundary) || !props.boundary) {
        const { parentNode } = root || {};
        if (parentNode?.parentNode) {
          parentNode.parentNode.setAttribute('data-pnode-id', parentNodeReferId);
          resolvedBoundary = `[data-pnode-id=${parentNodeReferId}]`;
        }
      }
    };

    const resolveCommonBoundary = () => {
      // 如果 boundary 是字符串 'body'，使用动态创建的 popContainer
      if (typeof props.boundary === 'string' && /^body$/i.test(props.boundary)) {
        resolvedBoundary = `${prefix}${popContainerId}`;
        return;
      }

      // 如果 boundary 是 document.body 对象，使用动态创建的 popContainer
      if (props.boundary === document.body) {
        resolvedBoundary = `${prefix}${popContainerId}`;
        return;
      }

      // 处理其他字符串选择器，直接使用
      if (typeof props.boundary === 'string') {
        resolvedBoundary = props.boundary;
        return;
      }

      // 处理其他 HTMLElement 对象，直接使用
      if (isElement(props.boundary)) {
        resolvedBoundary = props.boundary;
        return;
      }
    };

    resolveBoundary(resolveParentBoundary);
    resolveBoundary(resolveCommonBoundary);
    // 默认降级逻辑
    resolveBoundary(() => {
      resolvedBoundary = `${prefix}${popContainerId}`;
    });

    return resolvedBoundary;
  };

  // 确保全局 popContainer 容器存在
  if (!isAvailableId(`#${popContainerId}`)) {
    const popContainer = document.createElement('div');
    popContainer.setAttribute('id', popContainerId);
    popContainer.setAttribute('data-popper-id', popContainerId);
    document.body.append(popContainer);
  }

  // 清理父节点上的 data-pnode-id 属性
  const clearParentNodeId = (root?) => {
    if (/^parent$/i.test(props.boundary)) {
      const { parentNode } = root || {};
      if (parentNode?.parentNode) {
        const attr = parentNode.parentNode.getAttribute('data-pnode-id');
        // 只清理当前实例设置的属性
        if (attr === parentNodeReferId) {
          parentNode.parentNode.removeAttribute('data-pnode-id');
        }
      }
    }
  };

  return {
    popContainerId,
    prefixId: getPrefixId(),
    getPrefixId,
    parentNodeReferId,
    clearParentNodeId,
  };
};
