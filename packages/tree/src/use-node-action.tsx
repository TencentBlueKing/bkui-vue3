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
import { h, nextTick } from 'vue';

import { DownShape, Folder, FolderShapeOpen, RightShape, Spinner, TextFile } from '@bkui-vue/icon';
import { resolveClassName } from '@bkui-vue/shared';

import { EVENTS, NODE_ATTRIBUTES } from './constant';
import useNodeAsync from './use-node-async';
import useNodeAttribute from './use-node-attribute';
import { getLabel, getNodeItemClass, getNodeItemStyle, getNodeRowClass, resolveNodeItem } from './util';
export default (props, ctx, flatData, renderData, schemaValues) => {
  // const checkedNodes = [];
  let selectedNodeId = null;
  const {
    setNodeAttr,
    getNodePath,
    getSchemaVal,
    getNodeAttr,
    getNodeId,
    isRootNode,
    hasChildNode,
    isItemOpen,
    isNodeOpened,
    isNodeChecked,
    isNodeMatched,
  } = useNodeAttribute(flatData);

  const { asyncNodeClick, deepAutoOpen } = useNodeAsync(props, flatData);

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
    if (ctx.slots.nodeAction) {
      return ctx.slots.nodeAction(resolveScopedSlotParam(item));
    }

    let prefixFnVal = null;

    if (typeof props.prefixIcon === 'function') {
      prefixFnVal = props.prefixIcon(resolveScopedSlotParam(item), 'node_action');
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
    if (ctx.slots.nodeType) {
      return ctx.slots.nodeType(resolveScopedSlotParam(item));
    }

    let prefixFnVal = null;

    if (typeof props.prefixIcon === 'function') {
      prefixFnVal = props.prefixIcon(resolveScopedSlotParam(item), 'node_type');

      if (prefixFnVal !== 'default') {
        return renderPrefixVal(prefixFnVal);
      }
    }

    if (prefixFnVal === 'default' || (typeof props.prefixIcon === 'boolean' && props.prefixIcon)) {
      return isRootNode(item) || hasChildNode(item) ? getRootIcon(item) : <TextFile class={ resolveClassName('tree-icon') } />;
    }

    return null;
  };

  const getLoadingIcon = (item: any) => (ctx.slots.nodeLoading?.(resolveScopedSlotParam(item)) ?? item.loading ? <Spinner></Spinner> : '');

  /**
* 设置指定节点是否展开
* @param item
* @param isOpen
*/
  const setNodeOpened = (item: any, isOpen = null, e: MouseEvent = null, fireEmit = true) => {
    const newVal = isOpen === null ? !isItemOpen(item) : !!isOpen;
    setNodeAttr(item, NODE_ATTRIBUTES.IS_OPENED, newVal);

    if (fireEmit) {
      const emitEvent = isItemOpen(item) ? EVENTS.NODE_EXPAND : EVENTS.NODE_COLLAPSE;
      ctx.emit(emitEvent, resolveScopedSlotParam(item), getSchemaVal(item[NODE_ATTRIBUTES.UUID]), e);
    }

    /**
  * 在收起节点时需要重置当前节点的所有叶子节点状态为 __isOpen = false
  * 如果是需要点击当前节点展开所有叶子节点此处也可以打开
  */
    if (newVal) {
      return;
    }

    renderData.value.filter(node => String.prototype.startsWith.call(getNodePath(node), getNodePath(item)))
      .forEach(filterNode => setNodeAttr(filterNode, NODE_ATTRIBUTES.IS_OPENED, newVal));
  };

  /**
     * 设置指定节点行为 checked isOpen
     * @param args
     * @param action
     * @param value
     * @returns
     */
  const setNodeAction = (args: any | any[], action: string, value: any) => {
    if (Array.isArray(args)) {
      args.forEach((node: any) => setNodeAttr(resolveNodeItem(node), action, value));
      return;
    }

    setNodeAttr(resolveNodeItem(args), action, value);
  };

  /**
     * 指定节点展开
     * @param item 节点数据 | Node Id
     * @param isOpen 是否展开
     * @param autoOpenParents 如果是 isOpen = true，是否自动设置所有父级展开
     * @returns
     */
  const setOpen = (item: any[] | any, isOpen = true, autoOpenParents = false) => {
    const resolvedItem = resolveNodeItem(item);
    if (resolvedItem[NODE_ATTRIBUTES.IS_NULL]) {
      return;
    }

    if (autoOpenParents) {
      if (isOpen) {
        setNodeAction(resolvedItem, NODE_ATTRIBUTES.IS_OPENED, isOpen);
        if (!isRootNode(resolvedItem)) {
          const parentId = getNodeAttr(resolvedItem, NODE_ATTRIBUTES.PARENT_ID);
          setOpen(parentId, true, true);
        }
      } else {
        setNodeOpened(resolvedItem, false, null, false);
      }
    } else {
      setNodeAction(resolvedItem, NODE_ATTRIBUTES.IS_OPENED, isOpen);
    }
  };

  /**
   * 节点点击
   * @param item
   */
  const hanldeTreeNodeClick = (item: any, e: MouseEvent) => {
    /** 如果是异步请求加载 */
    asyncNodeClick(item);
    setNodeOpened(item, null, e);
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

    hanldeTreeNodeClick(node, e);
  };

  const setSelect = (uuid: any, selected = true, autoOpen = true) => {
    const nodeList = Array.isArray(uuid) ? uuid : [uuid];
    if (!nodeList.length) {
      return;
    }

    const resolvedItem = resolveNodeItem(nodeList[0]);
    if (resolvedItem[NODE_ATTRIBUTES.IS_NULL]) {
      return;
    }

    if (props.selectable) {
      if (selectedNodeId !== null) {
        setNodeAttr({ [NODE_ATTRIBUTES.UUID]: selectedNodeId }, NODE_ATTRIBUTES.IS_SELECTED, !selected);
      }

      setNodeAttr(resolvedItem, NODE_ATTRIBUTES.IS_SELECTED, selected);
      selectedNodeId = getNodeId(resolvedItem);

      /**
       * 如果设置了自动展开
       * 判定长度是为了处理异步节点,如果当前设置selected的节点为多级异步节点
       * 此时需要一层一层展开所有数据，只需要在最后一次执行setOpen即可
       */
      if (autoOpen && nodeList.length === 1) {
        setOpen(resolvedItem, true, true);
      }

      /**
       * 处理异步节点多层级展开选中
       */
      if (getNodeAttr(resolvedItem, NODE_ATTRIBUTES.IS_ASYNC)) {
        asyncNodeClick(resolvedItem).then(() => {
          nextTick(() => {
            nodeList.shift();
            setSelect(nodeList, selected, autoOpen);
          });
        });
      }
    } else {
      console.warn('props.selectable is false or undefined, please set selectable with true');
    }
  };

  /**
   * 点击节点事件
   * @param item
   */
  const handleNodeContentClick = (item: any, e: MouseEvent) => {
    setSelect(item, true, false);

    if (!isNodeOpened(item)) {
      hanldeTreeNodeClick(item, e);
    }

    // if (!checkedNodes.includes(item[NODE_ATTRIBUTES.UUID])) {
    //   checkedNodes.forEach((__uuid: string) => setNodeAttr({ __uuid }, NODE_ATTRIBUTES.IS_SELECTED, false));
    //   checkedNodes.length = 0;
    //   setNodeAttr(item, NODE_ATTRIBUTES.IS_SELECTED, true);
    //   checkedNodes.push(item[NODE_ATTRIBUTES.UUID]);
    //   if (!isNodeOpened(item)) {
    //     hanldeTreeNodeClick(item, e);
    //   }
    // }
    ctx.emit(EVENTS.NODE_CLICK, resolveScopedSlotParam(item), getSchemaVal(item[NODE_ATTRIBUTES.UUID]), e);
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

  /**
   * 处理scoped slot 透传数据
   * @param item 当前节点数据
   * @returns
   */
  const resolveScopedSlotParam = (item: any) => ({
    ...item,
    hasChildNode: hasChildNode(item),
    isMatched: isNodeMatched(item),
    isChecked: isNodeChecked(item),
    isOpened: isNodeOpened(item),
    isRoot: isRootNode(item),
  });

  const renderTreeNode = (item: any) => <div data-tree-node={getNodeId(item)}
    class={ getNodeRowClass(item, flatData.schema) }>
  <div class={getNodeItemClass(item, flatData.schema, props) }
    style={getNodeItemStyle(item, props, flatData)}
    onClick={(e: MouseEvent) => handleNodeContentClick(item, e)}>
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
        ctx.slots.node?.(resolveScopedSlotParam(item))
        ?? [getLabel(item, props)]
      }</span>
      {
        ctx.slots.nodeAppend?.(resolveScopedSlotParam(item))
      }
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
    setNodeAction,
    setNodeOpened,
    setSelect,
    setOpen,
  };
};
