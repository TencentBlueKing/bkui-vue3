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

import BkCheckbox from '@bkui-vue/checkbox';
import { DownShape, Folder, FolderShapeOpen, RightShape, Spinner, TextFile } from '@bkui-vue/icon';
import { resolveClassName } from '@bkui-vue/shared';

import { EVENTS, NODE_ATTRIBUTES } from './constant';
import { TreePropTypes } from './props';
import useNodeAsync from './use-node-async';
import useNodeAttribute from './use-node-attribute';
import { getLabel, getNodeItemClass, getNodeItemStyle, getNodeRowClass, resolveNodeItem } from './util';
export default (props: TreePropTypes, ctx, flatData, _renderData, schemaValues, initOption) => {
  // const checkedNodes = [];
  let selectedNodeId = props.selected;
  const {
    setNodeAttr,
    getNodePath,
    getSchemaVal,
    getNodeAttr,
    getNodeId,
    getChildNodes,
    isRootNode,
    hasChildNode,
    isItemOpen,
    isNodeOpened,
    isNodeLoading,
    isNodeChecked,
    getParentNode,
    resolveScopedSlotParam,
    extendNodeAttr,
  } = useNodeAttribute(flatData, props);

  const { registerNextLoop } = initOption;

  const { asyncNodeClick, deepAutoOpen } = useNodeAsync(props, flatData);

  /**
   * 根据当前节点状态获取节点类型Icon
   * @param item
   * @returns
   */
  const getRootIcon = (item: any) => (isItemOpen(item)
    ? <FolderShapeOpen class={ [resolveClassName('tree-icon'), resolveClassName('node-prefix')] } />
    : <Folder class={ [resolveClassName('tree-icon'), resolveClassName('node-prefix')] } />);


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

  const getLoadingIcon = (item: any) => (ctx.slots.nodeLoading?.(extendNodeAttr(item)) ?? isNodeLoading(item)
    ? <Spinner></Spinner> : '');


  /**
* 根据节点状态获取节点操作Icon
* @param item
* @returns
*/
  const getActionIcon = (item: any) => {
    if (ctx.slots.nodeAction) {
      return ctx.slots.nodeAction(extendNodeAttr(item));
    }

    let prefixFnVal = null;

    if (isNodeLoading(item)) {
      return getLoadingIcon(item);
    }

    if (typeof props.prefixIcon === 'function') {
      prefixFnVal = props.prefixIcon(extendNodeAttr(item), 'node_action');
      if (prefixFnVal !== 'default') {
        return renderPrefixVal(prefixFnVal);
      }
    }

    if (prefixFnVal === 'default' || (typeof props.prefixIcon === 'boolean' && props.prefixIcon)) {
      if (hasChildNode(item) || item.async || !props.autoCheckChildren) {
        return isItemOpen(item) ? <DownShape class={resolveClassName('node-prefix')}/>
          : <RightShape class={resolveClassName('node-prefix')} />;
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
    if (!props.showNodeTypeIcon) {
      return null;
    }

    if (ctx.slots.nodeType) {
      return ctx.slots.nodeType(extendNodeAttr(item));
    }

    let prefixFnVal = null;

    if (typeof props.prefixIcon === 'function') {
      prefixFnVal = props.prefixIcon(extendNodeAttr(item), 'node_type');

      if (prefixFnVal !== 'default') {
        return renderPrefixVal(prefixFnVal);
      }
    }

    if (prefixFnVal === 'default' || (typeof props.prefixIcon === 'boolean' && props.prefixIcon)) {
      return isRootNode(item) || hasChildNode(item) ? getRootIcon(item)
        : <TextFile class={ [resolveClassName('tree-icon'), resolveClassName('node-prefix')] } />;
    }

    return null;
  };

  const updateParentChecked = (item: any, isChecked) => {
    const parent = getParentNode(item);
    if (parent) {
      setNodeAttr(parent, NODE_ATTRIBUTES.IS_CHECKED, isChecked);
      if (!isRootNode(parent)) {
        updateParentChecked(parent, isChecked);
      }
    }
  };

  const deepUpdateChildNode = (node: any, attr: string, value: any) => {
    getChildNodes(node).forEach((id: string) => {
      setNodeAttr({ [NODE_ATTRIBUTES.UUID]: id }, attr, value);
      deepUpdateChildNode({ [NODE_ATTRIBUTES.UUID]: id }, attr, value);
    });
  };

  const handleNodeItemCheckboxChange = (item: any, value: boolean) => {
    setNodeAttr(item, NODE_ATTRIBUTES.IS_CHECKED, !!value);
    deepUpdateChildNode(item,  NODE_ATTRIBUTES.IS_CHECKED, !!value);
    updateParentChecked(item, value);
    ctx.emit(EVENTS.NODE_CHECKED, schemaValues.value.filter((t: any) => isNodeChecked(t))
      .map((n: any) => n[NODE_ATTRIBUTES.UUID]));
  };

  const isIndeterminate = (item: any) => isNodeChecked(item)  && !schemaValues.value
    .filter(node => getNodePath(node)?.startsWith(getNodePath(item)))
    .every(filterNode => isNodeChecked(filterNode));

  const isNodeItemChecked = (item: any) => isNodeChecked(item) || schemaValues.value
    .filter(node => getNodePath(node)?.startsWith(getNodePath(item)))
    .some(filterNode => isNodeChecked(filterNode));

  const getCheckboxRender = (item: any) => {
    if (!props.showCheckbox) {
      return null;
    }

    return <BkCheckbox
      size='small'
      modelValue={ isNodeItemChecked(item) }
      indeterminate={ isIndeterminate(item) }
      onChange={ (val: boolean) => handleNodeItemCheckboxChange(item, val) }>
    </BkCheckbox>;
  };


  /**
* 设置指定节点是否展开
* @param item
* @param isOpen
*/
  const setNodeOpened = (item: any, isOpen = null, e: MouseEvent = null, fireEmit = true) => {
    const newVal = isOpen === null ? !isItemOpen(item) : !!isOpen;

    /**
  * 在收起节点时需要重置当前节点的所有叶子节点状态为 __isOpen = false
  * 如果是需要点击当前节点展开所有叶子节点此处也可以打开
  */
    if (!newVal) {
      deepUpdateChildNode(item, NODE_ATTRIBUTES.IS_OPEN, newVal);
    }

    setNodeAttr(item, NODE_ATTRIBUTES.IS_OPEN, newVal);

    if (fireEmit) {
      const emitEvent: string = isItemOpen(item) ? EVENTS.NODE_EXPAND : EVENTS.NODE_COLLAPSE;
      ctx.emit(emitEvent, item, resolveScopedSlotParam(item), getSchemaVal(item[NODE_ATTRIBUTES.UUID]), e);
    }
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
        setNodeAction(resolvedItem, NODE_ATTRIBUTES.IS_OPEN, true);
        if (!isRootNode(resolvedItem)) {
          const parentId = getNodeAttr(resolvedItem, NODE_ATTRIBUTES.PARENT_ID);
          setOpen(parentId, true, true);
        }
      } else {
        setNodeOpened(resolvedItem, false, null, false);
      }
    } else {
      setNodeAction(resolvedItem, NODE_ATTRIBUTES.IS_OPEN, isOpen);
    }
  };

  /**
   * 节点点击
   * @param item
   */
  const handleTreeNodeClick = (item: any, e: MouseEvent) => {
    const isOpen = isNodeOpened(item);
    if (isOpen) {
      setNodeOpened(item, false, e);
      return;
    }

    /** 如果是异步请求加载 */
    asyncNodeClick(item).finally(() => {
      if (getNodeAttr(item, NODE_ATTRIBUTES.IS_LOADING)) {
        registerNextLoop('setNodeOpenedAfterLoading', {
          type: 'once',
          fn: () => setNodeOpened(item, true, e),
        });
      } else {
        setNodeOpened(item, true, e);
      }
    });
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

    handleTreeNodeClick(node, e);
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

    if (
      !props.selectable
      || (typeof props.selectable === 'function' && !props.selectable(uuid))
      || (props.disabledFolderSelectable && uuid?.is_folder === true)
    ) {
      console.warn('props.selectable is false or undefined, please set selectable with true');
      return;
    }
    if (selectedNodeId !== null && selectedNodeId !== undefined) {
      setNodeAttr({ [NODE_ATTRIBUTES.UUID]: selectedNodeId }, NODE_ATTRIBUTES.IS_SELECTED, !selected);
    }

    if (props.selected && props.selected !== selectedNodeId) {
      setNodeAttr({ [NODE_ATTRIBUTES.UUID]: props.selected }, NODE_ATTRIBUTES.IS_SELECTED, !selected);
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
  };

  const resolveNodeAction = (node: any): any[] => {
    if (typeof props.nodeContentAction === 'function') {
      return Reflect.apply(props.nodeContentAction, this, [{ node }]);
    }

    if (typeof props.nodeContentAction === 'string') {
      return [props.nodeContentAction];
    }

    if (Array.isArray(props.nodeContentAction)) {
      return props.nodeContentAction;
    }

    return ['selected', 'expand', 'click'];
  };

  /**
   * 点击节点事件
   * @param item
   */
  const handleNodeContentClick = (item: any, e: MouseEvent) => {
    const nodeActions = resolveNodeAction(item);
    if (nodeActions.includes('selected')) {
      setSelect(item, true, false);
    }

    if (nodeActions.includes('expand')) {
      if (!isNodeOpened(item)) {
        handleTreeNodeClick(item, e);
      }
    }

    if (nodeActions.includes('collapse')) {
      if (isNodeOpened(item)) {
        handleTreeNodeClick(item, e);
      }
    }

    if (nodeActions.includes('click')) {
      const eventName: string = EVENTS.NODE_CLICK;
      ctx.emit(eventName, item, resolveScopedSlotParam(item), getSchemaVal(item[NODE_ATTRIBUTES.UUID]), e);
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

  const renderTreeNode = (item: any) => (
    <div
      data-tree-node={getNodeId(item)}
      key={getNodeId(item)}
      class={ getNodeRowClass(item, flatData.schema) }>
      <div
        class={getNodeItemClass(item, flatData.schema, props) }
        style={getNodeItemStyle(item, props, flatData)}
        onClick={(e: MouseEvent) => handleNodeContentClick(item, e)}>
        <div
          class={ [resolveClassName('node-action')] }
          onClick={(e: MouseEvent) => handleNodeActionClick(e, item)}>
          { getActionIcon(item) }
        </div>
        <div class={ resolveClassName('node-content') } >
          {
            [
              getCheckboxRender(item),
              getNodePrefixIcon(item),
            ]
          }
          <span
            class={ resolveClassName('node-text') }>
            {ctx.slots.node?.(extendNodeAttr(item)) ?? [getLabel(item, props)]}
          </span>
          {
            ctx.slots.nodeAppend?.(extendNodeAttr(item))
          }
        </div>
        {
          getVirtualLines(item)
        }
      </div>
    </div>
  );

  return {
    renderTreeNode,
    handleTreeNodeClick,
    deepAutoOpen,
    asyncNodeClick,
    setNodeAction,
    setNodeOpened,
    setSelect,
    setOpen,
  };
};
