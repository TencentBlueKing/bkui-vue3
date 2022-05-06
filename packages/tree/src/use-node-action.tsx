import { h } from 'vue';

import { DownShape, Folder, FolderShapeOpen, RightShape, Spinner, TextFile } from '@bkui-vue/icon';
import { resolveClassName } from '@bkui-vue/shared';

import useAsync from './use-async';
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
import useNodeAttribute from './use-node-attribute';
import { getLabel, getNodeItemClass, getNodeItemStyle, getNodeRowClass, NODE_ATTRIBUTES } from './util';

export default (props, ctx, flatData, renderData) => {
  const checkedNodes = [];

  const {
    setNodeAttr,
    getNodePath,
    getSchemaVal,
    getNodeAttr,
    isRootNode,
    hasChildNode,
    isItemOpen,
    isNodeOpened,
    schemaValues,
  } = useNodeAttribute(flatData);

  const { asyncNodeClick, deepAutoOpen } = useAsync(props, flatData);

  /**
   * 根据当前节点状态获取节点类型Icon
   * @param item
   * @returns
   */
  const getRootIcon = (item: any) => (isItemOpen(item)
    ? <FolderShapeOpen class={ resolveClassName('tree-icon') } />
    : <Folder class={ resolveClassName('tree-icon') } />);


  /**
* 渲染动态设置的节点样式
* @param val
* @returns
*/
  const renderPrefixVal = (val: string | { node: string, className: string, text: string, style: any } | any) => {
    if (typeof val === 'string') {
      return val;
    }

    if (typeof val === 'object' && val !== null) {
      if (val.__v_isVNode) {
        return val;
      }
      const { node, className, text, style } = val;
      return h(node, { class: className, style }, text);
    }

    return null;
  };

  /**
* 根据节点状态获取节点操作Icon
* @param item
* @returns
*/
  const getActionIcon = (item: any) => {
    let prefixFnVal = null;

    if (typeof props.prefixIcon === 'function') {
      prefixFnVal = props.prefixIcon(isRootNode(item), hasChildNode(item) || item.async, isItemOpen(item), 'action', item);
      if (prefixFnVal !== 'default') {
        return renderPrefixVal(prefixFnVal);
      }
    }

    if (prefixFnVal === 'default' || (typeof props.prefixIcon === 'boolean' && props.prefixIcon)) {
      if (hasChildNode(item) || item.async) {
        return isItemOpen(item) ? <DownShape /> : <RightShape />;
      }
    }

    return null;
  };

  /**
* 获取节点类型Icon
* @param item
* @returns
*/
  const getNodePrefixIcon = (item: any) => {
    let prefixFnVal = null;

    if (typeof props.prefixIcon === 'function') {
      prefixFnVal = props.prefixIcon(isRootNode(item), hasChildNode(item) || item.async, isItemOpen(item), 'node_type', item);

      if (prefixFnVal !== 'default') {
        return renderPrefixVal(prefixFnVal);
      }
    }

    if (prefixFnVal === 'default' || (typeof props.prefixIcon === 'boolean' && props.prefixIcon)) {
      return isRootNode(item) || hasChildNode(item) ? getRootIcon(item) : <TextFile class={ resolveClassName('tree-icon') } />;
    }

    return null;
  };

  const getLoadingIcon = (item: any) => (item.loading ? <Spinner></Spinner> : '');

  /**
* 设置指定节点是否展开
* @param item
* @param isOpen
*/
  const setNodeOpened = (item: any, isOpen = null) => {
    const newVal = isOpen === null ? !isItemOpen(item) : !!isOpen;
    setNodeAttr(item, NODE_ATTRIBUTES.IS_OPEN, newVal);

    /**
  * 在收起节点时需要重置当前节点的所有叶子节点状态为 __isOpen = false
  * 如果是需要点击当前节点展开所有叶子节点此处也可以打开
  */
    if (newVal) {
      return;
    }

    renderData.value.filter(node => String.prototype.startsWith.call(getNodePath(node), getNodePath(item)))
      .forEach(filterNode => setNodeAttr(filterNode, NODE_ATTRIBUTES.IS_OPEN, newVal));
  };

  /**
   * 节点点击
   * @param item
   */
  const hanldeTreeNodeClick = (item: any) => {
    /** 如果是异步请求加载 */
    asyncNodeClick(item);

    if (hasChildNode(item)) {
      setNodeOpened(item);
    }
  };

  /**
   * 点击树形节点展开、收起图标处理事件
   * @param e 鼠标事件
   * @param node 当前节点
   */
  const handleNodeActionClick = (e: MouseEvent, node: any) => {
    e.stopImmediatePropagation();
    e.stopPropagation();
    e.preventDefault();

    hanldeTreeNodeClick(node);
  };

  /**
   * 点击节点事件
   * @param item
   */
  const handleNodeContentClick = (item: any) => {
    if (!checkedNodes.includes(item[NODE_ATTRIBUTES.UUID])) {
      checkedNodes.forEach((__uuid: string) => setNodeAttr({ __uuid }, NODE_ATTRIBUTES.CHECKED, false));
      checkedNodes.length = 0;
      setNodeAttr(item, NODE_ATTRIBUTES.CHECKED, true);
      checkedNodes.push(item[NODE_ATTRIBUTES.UUID]);
      if (!isNodeOpened(item)) {
        hanldeTreeNodeClick(item);
      }

      ctx.emit('check', item, getSchemaVal(item[NODE_ATTRIBUTES.UUID]));
    }
  };

  /**
   * 用于判定当前节点需要展示的连线
   * 当前指定的depth需不需要展示连线
   * @param depth 当前需要判定的depth
   * @param node 当前节点
   * @returns
   */
  const filterNextNode = (depth: number, node: any) => {
    if (isRootNode(node)) {
      return false;
    }

    const nodepath = getNodePath(node);
    const paths = `${nodepath}`.split('-').slice(0, depth + 1);
    const currentPath = paths.join('-');

    // 如果是判定当前节点，则必须要有一条线
    if (currentPath === nodepath) {
      return true;
    }

    const lastLevel = paths.pop();
    const nextLevel = parseInt(lastLevel, 10);
    paths.push(`${nextLevel + 1}`);
    const nextNodePath = paths.join('-');
    return schemaValues.value.some((val: any) => val[NODE_ATTRIBUTES.PATH] === nextNodePath);
  };

  /**
   * 获取层级连线
   * @param node 节点
   * @returns
   */
  const getVirtualLines = (node: any) => {
    if (!props.levelLine) {
      return null;
    }

    const getNodeLineStyle = (dpth: number) => ({
      '--depth': dpth,
    });

    const maxDeep = getNodeAttr(node, NODE_ATTRIBUTES.DEPTH) + 1;
    return new Array(maxDeep).fill('')
      .map((_, index: number) => index)
      .filter((depth: number) => filterNextNode(depth, node))
      .filter((depth: number) => depth > 0)
    // @ts-ignore:next-line
      .map((index: number) => <span class="node-virtual-line" style={ getNodeLineStyle(maxDeep - index) }></span>);
  };

  const renderTreeNode = (item: any) => <div class={ getNodeRowClass(item, flatData.schema) }>
  <div class={getNodeItemClass(item, flatData.schema, props) }
    style={getNodeItemStyle(item, props, flatData)}
    onClick={() => handleNodeContentClick(item)}>
    <span class={ resolveClassName('node-action') }
      onClick={(e: MouseEvent) => handleNodeActionClick(e, item)}>
        { getActionIcon(item) }
      </span>
    <span class={ resolveClassName('node-content') } >
      {
        [
          getNodePrefixIcon(item),
          getLoadingIcon(item),
        ]
      }
      <span class={ resolveClassName('node-text') }>{
        ctx.slots.node?.(item) ?? [getLabel(item, props), ctx.slots.nodeAppend?.(item)]
      }</span>
    </span>
    {
      getVirtualLines(item)
    }
  </div>
</div>;

  return {
    renderTreeNode,
    hanldeTreeNodeClick,
    deepAutoOpen,
    setNodeOpened,
  };
};
