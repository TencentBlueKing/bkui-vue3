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
import { h, isVNode, nextTick } from 'vue';

import Checkbox from '@bkui-vue/checkbox';
import { usePrefix } from '@bkui-vue/config-provider';
import { DownShape, Folder, FolderShapeOpen, RightShape, Spinner, TextFile } from '@bkui-vue/icon';

import { EVENTS, NODE_ATTRIBUTES } from './constant';
import { TreeNode, TreePropTypes } from './props';
import useCheckedState from './use-checked-state';
import useNodeAsync from './use-node-async';
import useNodeAttribute from './use-node-attribute';
import {
  getLabel,
  getNodeItemClass,
  getNodeItemStyle,
  getNodeRowClass,
  IFlatData,
  isCascadeEnabled,
  resolveNodeItem,
  showCheckbox,
} from './util';
export default (props: TreePropTypes, ctx, flatData: IFlatData, _renderData, initOption) => {
  // const checkedNodes = [];
  let selectedNodeId = props.selected;
  const {
    setNodeAttr,
    setNodeAttrById,
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
    extendNodeScopedData,
    getRootNodeList,
  } = useNodeAttribute(flatData, props);

  const { resolveClassName } = usePrefix();

  const { registerNextLoop, syncNodeOpenState, scheduleUiRefresh } = initOption;

  const {
    setNodeCheckedState,
    setDescendantChecked,
    forEachDescendant,
    updateParentChecked,
    getCheckedEmitPayload,
    rebuildCheckedSetsFromList,
    clearAllCheckedState,
    isNodeIndeterminate,
  } = useCheckedState(flatData, {
    getChildNodes,
    getNodeAttr,
    getParentNode,
    getSchemaVal,
    isRootNode,
  });

  const { asyncNodeClick, deepAutoOpen } = useNodeAsync(props, flatData, ctx, initOption);

  /**
   * 根据当前节点状态获取节点类型Icon
   * @param item
   * @returns
   */
  const getRootIcon = (item: TreeNode) =>
    isItemOpen(item) ? (
      <FolderShapeOpen class={[resolveClassName('tree-icon'), resolveClassName('node-prefix')]} />
    ) : (
      <Folder class={[resolveClassName('tree-icon'), resolveClassName('node-prefix')]} />
    );

  /**
   * 渲染动态设置的节点样式
   * @param val
   * @returns
   */
  const renderPrefixVal = (
    val: { node: string; className: string; text: boolean | number | string; style: Record<string, string> } | string,
  ) => {
    if (typeof val === 'string') {
      return val;
    }

    if (typeof val === 'object' && val !== null) {
      if (isVNode(val)) {
        return val;
      }
      const { node, className, text, style } = val;
      return h(node, { class: className, style }, text as boolean | number | string);
    }

    return null;
  };

  const getLoadingIcon = (item: TreeNode) =>
    (ctx.slots.nodeLoading?.(getScopedSlotData(item)) ?? isNodeLoading(item)) ? <Spinner></Spinner> : '';

  /**
   * 根据节点状态获取节点操作Icon
   * @param item
   * @returns
   */
  const getActionIcon = (item: TreeNode) => {
    if (ctx.slots.nodeAction) {
      return ctx.slots.nodeAction(getScopedSlotData(item));
    }

    let prefixFnVal = null;

    if (isNodeLoading(item)) {
      return getLoadingIcon(item);
    }

    if (typeof props.prefixIcon === 'function') {
      prefixFnVal = props.prefixIcon(getScopedSlotData(item), 'node_action');
      if (prefixFnVal !== 'default') {
        return renderPrefixVal(prefixFnVal);
      }
    }

    if (prefixFnVal === 'default' || (typeof props.prefixIcon === 'boolean' && props.prefixIcon)) {
      const autoCheckChild =
        typeof props.autoCheckChildren === 'function' ? props.autoCheckChildren(item) : props.autoCheckChildren;

      if (hasChildNode(item) || item.async || !autoCheckChild) {
        return isItemOpen(item) ? (
          <DownShape class={resolveClassName('node-prefix')} />
        ) : (
          <RightShape class={resolveClassName('node-prefix')} />
        );
      }
    }

    return null;
  };

  /**
   * 获取节点类型Icon
   * @param item
   * @returns
   */
  const getNodePrefixIcon = (item: TreeNode) => {
    if (!props.showNodeTypeIcon) {
      return null;
    }

    if (ctx.slots.nodeType) {
      return ctx.slots.nodeType(getScopedSlotData(item));
    }

    let prefixFnVal = null;

    if (typeof props.prefixIcon === 'function') {
      prefixFnVal = props.prefixIcon(getScopedSlotData(item), 'node_type');

      if (prefixFnVal !== 'default') {
        return renderPrefixVal(prefixFnVal);
      }
    }

    if (prefixFnVal === 'default' || (typeof props.prefixIcon === 'boolean' && props.prefixIcon)) {
      return isRootNode(item) || hasChildNode(item) ? (
        getRootIcon(item)
      ) : (
        <TextFile class={[resolveClassName('tree-icon'), resolveClassName('node-prefix')]} />
      );
    }

    return null;
  };

  const deepUpdateChildNode = (node: TreeNode, attr: string | string[], value: unknown | unknown[]) => {
    // 按 DFS 连续区间扫描后代，避免递归 forEach
    forEachDescendant(node, chid => {
      if (Array.isArray(attr)) {
        attr.forEach((val, index) => {
          setNodeAttr(chid, val, value[index], undefined, { silent: true });
        });
      } else {
        setNodeAttr(chid, attr, value, undefined, { silent: true });
      }
    });
  };

  const isRemoteFnExec = (event: string) => {
    if (props.async?.trigger?.length) {
      return props.async?.trigger.includes(event);
    }
    return true;
  };

  const emitCheckedChange = () => {
    // 先让勾选 UI 刷新，再异步抛出列表，避免百万级 Array.from 阻塞交互
    nextTick(() => {
      const [checkedNodes, indeterminateNodes] = getCheckedEmitPayload();
      ctx.emit(EVENTS.NODE_CHECKED, checkedNodes, indeterminateNodes);
    });
  };

  const applyCheckedChange = (
    item: TreeNode,
    value: boolean,
    options: { emitEvent?: boolean; refresh?: boolean } = {},
  ) => {
    const checked = !!value;
    setNodeCheckedState(item, checked, false);

    if (isCascadeEnabled(props)) {
      setDescendantChecked(item, checked);
      updateParentChecked(item);
    }

    if (options.refresh !== false) {
      scheduleUiRefresh?.();
    }

    if (options.emitEvent !== false) {
      emitCheckedChange();
    }
  };

  const handleNodeItemCheckboxChange = (item: TreeNode, value: boolean, event?: Event) => {
    event?.preventDefault();
    event?.stopImmediatePropagation();
    event?.stopPropagation();

    applyCheckedChange(item, value);
    handleNodeContentClick(item, event as MouseEvent, 'checked');
  };

  const isIndeterminate = (item: TreeNode) => isNodeIndeterminate(item);

  const getCheckboxRender = (item: TreeNode) => {
    if (!showCheckbox(props, extendNodeScopedData(item))) {
      return null;
    }

    return (
      <span
        class='node-check-box'
        onClick={handleNodeCheckboxClick}
      >
        <Checkbox
          disabled={props.disableCheck}
          indeterminate={isIndeterminate(item)}
          modelValue={isNodeChecked(item)}
          size='small'
          onChange={(val, event) => handleNodeItemCheckboxChange(item, !!val, event)}
        ></Checkbox>
      </span>
    );
  };

  /**
   * 设置指定节点是否展开
   * @param item
   * @param isOpen
   */
  const setNodeOpened = (item: TreeNode, isOpen = null, e: MouseEvent = null, fireEmit = true) => {
    const newVal = isOpen === null ? !isItemOpen(item) : !!isOpen;

    setNodeAttr(item, NODE_ATTRIBUTES.IS_OPEN, newVal, undefined, { silent: true });
    /**
     * 增量维护可见列表：
     * - 展开：插入子节点
     * - 收起：移除可见后代，并仅重置可见区间内的 IS_OPEN（不再扫 flat 全量子树）
     */
    syncNodeOpenState?.(item, newVal);

    if (fireEmit) {
      const emitEvent: string = isItemOpen(item) ? EVENTS.NODE_EXPAND : EVENTS.NODE_COLLAPSE;
      ctx.emit(emitEvent, item, resolveScopedSlotParam(item), getSchemaVal(item), e);
    }
  };

  /**
   * 设置指定节点行为 checked isOpen
   * @param args
   * @param action
   * @param value
   * @returns
   */
  const setNodeAction = (args: TreeNode | TreeNode[], action: string, value: unknown) => {
    if (Array.isArray(args)) {
      args.forEach((node: TreeNode) => setNodeAttr(resolveNodeItem(node), action, value));
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
  const setOpen = (item: TreeNode, isOpen = true, autoOpenParents = false) => {
    const resolvedItem = resolveNodeItem(item);
    if (resolvedItem[NODE_ATTRIBUTES.IS_NULL]) {
      return;
    }

    if (autoOpenParents && isOpen && !isRootNode(resolvedItem)) {
      const parents: TreeNode[] = [];
      let parent = getParentNode(resolvedItem) as TreeNode | null;
      while (parent) {
        parents.unshift(parent);
        parent = getParentNode(parent) as TreeNode | null;
      }
      parents.forEach(node => {
        if (!isItemOpen(node)) {
          setNodeOpened(node, true, null, false);
        }
      });
    }

    setNodeOpened(resolvedItem, isOpen, null, false);
  };

  /**
   * 递归处理当前节点以及父级节点属性值
   * @param node 指定节点
   * @param attrName 属性名称
   * @param value 属性值
   * @param loopParent 是否需要递归更新父级
   */
  const setNodeAttribute = (
    node: TreeNode,
    attrName: string | string[],
    value: (boolean | number | string)[] | boolean | number | string,
    loopParent = false,
  ) => {
    const resolvedItem = resolveNodeItem(node);
    if (resolvedItem[NODE_ATTRIBUTES.IS_NULL]) {
      return;
    }

    const attrNames = Array.isArray(attrName) ? attrName : [attrName];
    const values = Array.isArray(value) ? value : [value];

    if (loopParent) {
      attrNames.forEach((name, index) => setNodeAction(resolvedItem, name, values[index]));

      if (!isRootNode(resolvedItem)) {
        const parent = getParentNode(resolvedItem);
        if (!parent) {
          return;
        }

        attrNames.forEach((name, index) => {
          const parentVal = getNodeAttr(parent, name);
          if (parentVal !== value) {
            setNodeAttribute(parent, name, values[index], loopParent);
          }
        });
      }
    } else {
      attrNames.forEach((name, index) => setNodeAction(resolvedItem, name, values[index]));
    }
  };

  /**
   * 节点点击
   * @param item
   */
  const handleTreeNodeClick = (item: TreeNode, e: MouseEvent, event?: string) => {
    const isOpen = isItemOpen(item);
    if (isOpen) {
      setNodeOpened(item, false, e, true);
      return;
    }

    /** 如果是异步节点，尝试加载数据 */
    const isAsyncNode = getNodeAttr(item, NODE_ATTRIBUTES.IS_ASYNC);
    if (isAsyncNode && isRemoteFnExec(event)) {
      /** 如果是异步请求加载 */
      asyncNodeClick(item).finally(() => {
        if (getNodeAttr(item, NODE_ATTRIBUTES.IS_LOADING)) {
          registerNextLoop('setNodeOpenedAfterLoading', {
            type: 'once',
            fn: () => setNodeOpened(item, true, e, true),
          });
        } else {
          setNodeOpened(item, true, e, true);
        }
      });
    } else {
      /** 非异步节点或者 trigger 不匹配时，直接展开 */
      setNodeOpened(item, true, e, true);
    }
  };

  /**
   * 点击树形节点展开、收起图标处理事件
   * @param e 鼠标事件
   * @param node 当前节点
   */
  const handleNodeActionClick = (e: MouseEvent, node: TreeNode) => {
    e.stopImmediatePropagation();
    e.stopPropagation();
    e.preventDefault();

    handleTreeNodeClick(node, e, 'expand');
  };

  /**
   * 设置节点选中状态
   * @param nodes 选中节点，可以是多个
   * @param selected 是否选中 default：true
   * @param autoOpen 是否自动展开所有父级节点 default：true
   * @param triggerEvent 是否触发抛出事件 false
   * @returns
   */
  const setSelect = (
    nodes: TreeNode | TreeNode[],
    selected = true,
    autoOpen = true,
    triggerEvent = false,
    event = '',
  ) => {
    const nodeList = Array.isArray(nodes) ? nodes : [nodes];
    if (!nodeList.length) {
      return;
    }

    let resolvedItem = resolveNodeItem(nodeList[0]) as TreeNode | number | string | symbol;
    if (typeof resolvedItem === 'number' || typeof resolvedItem === 'string' || typeof resolvedItem === 'symbol') {
      const nodeId = resolvedItem;
      resolvedItem =
        flatData.nodeMap?.get(`${nodeId}`) ??
        flatData.data.find(item => getNodeId(item) === nodeId) ?? {
          [NODE_ATTRIBUTES.IS_NULL]: true,
        };
    }

    if (resolvedItem[NODE_ATTRIBUTES.IS_NULL]) {
      return;
    }

    if (
      !props.selectable ||
      (typeof props.selectable === 'function' && !props.selectable(nodes)) ||
      (props.disabledFolderSelectable && resolvedItem.is_folder === true)
    ) {
      console.warn('props.selectable is false or undefined, please set selectable with true');
      return;
    }
    if (selectedNodeId !== null && selectedNodeId !== undefined) {
      setNodeAttrById(selectedNodeId, NODE_ATTRIBUTES.IS_SELECTED, !selected);
    }

    if (props.selected && props.selected !== selectedNodeId) {
      setNodeAttrById(props.selected, NODE_ATTRIBUTES.IS_SELECTED, !selected);
    }

    setNodeAttr(resolvedItem, NODE_ATTRIBUTES.IS_SELECTED, selected);
    selectedNodeId = getNodeId(resolvedItem);
    if (triggerEvent) {
      ctx.emit(EVENTS.NODE_SELECTED, { selected: selected, node: resolvedItem });
    }

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
     * 仅在 autoOpen 为 true 时才触发异步加载和展开
     */
    if (autoOpen && getNodeAttr(resolvedItem, NODE_ATTRIBUTES.IS_ASYNC)) {
      if (isRemoteFnExec(event)) {
        asyncNodeClick(resolvedItem).then(() => {
          nextTick(() => {
            nodeList.shift();
            setSelect(nodeList, selected, autoOpen, triggerEvent, event);
          });
        });
      }
    }
  };

  const resolveNodeAction = (node: TreeNode): string[] => {
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
   * 点击节点内容事件
   * 处理节点内容（除展开/收起按钮外）的点击行为
   * @param item 当前节点
   * @param e 鼠标事件
   * @param event 事件类型
   */
  const handleNodeContentClick = (item: TreeNode, e: MouseEvent, event?: string) => {
    const nodeActions = resolveNodeAction(item);
    const isOpened = isNodeOpened(item);

    // checkbox 点击事件不应触发 expand/collapse 行为
    const isCheckboxEvent = event === 'checked';

    // 1. 处理 selected 行为：选中节点
    if (nodeActions.includes('selected')) {
      setSelect(item, true, false, true, event);
    }

    // 2. 处理 expand 行为：仅当节点是收起状态时展开
    if (nodeActions.includes('expand') && !isOpened && !isCheckboxEvent) {
      handleTreeNodeClick(item, e, 'expand');
    }

    // 3. 处理 collapse 行为：仅当节点是展开状态时收起
    if (nodeActions.includes('collapse') && isOpened && !isCheckboxEvent) {
      handleTreeNodeClick(item, e, 'expand');
    }

    // 4. 处理 click 行为：触发 node-click 事件
    if (nodeActions.includes('click') && !isCheckboxEvent) {
      const eventName: string = EVENTS.NODE_CLICK;
      ctx.emit(eventName, item, resolveScopedSlotParam(item), getSchemaVal(item), e);
    }

    // 处理 checked 操作：当 showCheckbox 为 true 时，点击节点内容切换复选框状态
    if (nodeActions.includes('checked') && event !== 'checked') {
      if (showCheckbox(props, extendNodeScopedData(item)) && !props.disableCheck) {
        const currentChecked = isNodeChecked(item);
        handleNodeItemCheckboxChange(item, !currentChecked, e);
      }
    }
  };

  /**
   * 用于判定当前节点需要展示的连线
   * 当前指定的depth需不需要展示连线
   * @param depth 当前需要判定的depth
   * @param node 当前节点
   * @returns
   */
  const filterNextNode = (depth: number, node: TreeNode) => {
    if (isRootNode(node)) {
      return false;
    }

    const nodeDepth = (getNodeAttr(node, NODE_ATTRIBUTES.DEPTH) as number) ?? 0;
    // 当前节点所在 depth：必有连线
    if (depth === nodeDepth) {
      return true;
    }

    if (depth > nodeDepth) {
      return false;
    }

    // 取 depth 层祖先，判断其是否存在下一个兄弟节点 —— O(depth) 替代全表 some
    let ancestor: TreeNode = node;
    for (let i = nodeDepth; i > depth; i--) {
      ancestor = getParentNode(ancestor) as TreeNode;
      if (!ancestor) {
        return false;
      }
    }

    const parent = getParentNode(ancestor) as TreeNode | null;
    const siblings = parent ? getChildNodes(parent) : getRootNodeList();
    const idx = siblings.indexOf(ancestor);
    return idx >= 0 && idx < siblings.length - 1;
  };

  /**
   * 获取层级连线
   * @param node 节点
   * @returns
   */
  const getVirtualLines = (node: TreeNode) => {
    if (!props.levelLine) {
      return null;
    }

    // 根节点不渲染层级连线（与基础用法一致）
    if (isRootNode(node)) {
      return null;
    }

    const getNodeLineStyle = (dpth: number) => ({
      '--depth': dpth,
    });

    const maxDeep = (getNodeAttr(node, NODE_ATTRIBUTES.DEPTH) ?? 0) + 1;
    return (
      new Array(maxDeep)
        .fill('')
        .map((_, index: number) => index)
        .filter((depth: number) => filterNextNode(depth, node))
        .filter((depth: number) => depth > 0)
        // @ts-ignore:next-line
        .map((index: number) => (
          <span
            style={getNodeLineStyle(maxDeep - index)}
            class='node-virtual-line'
          ></span>
        ))
    );
  };

  const renderNodeSlots = (item: TreeNode) => {
    if (ctx.slots.node) {
      return ctx.slots.node?.(getScopedSlotData(item));
    }

    if (ctx.slots.default) {
      return ctx.slots.default?.(extendNodeScopedData(item));
    }

    return [getLabel(item, props)];
  };

  const getScopedSlotData = item => {
    if (props.keepSlotData) {
      return extendNodeScopedData(item);
    }

    return extendNodeAttr(item);
  };

  const handleNodeCheckboxClick = (event: MouseEvent) => {
    event.stopImmediatePropagation();
    event.stopPropagation();
  };

  /**
   * 渲染节点函数
   * @param item 当前节点
   * @param showTree 是否展示为树形结构
   */
  const renderTreeNode = (item: TreeNode, showTree = true) => {
    const child = getActionIcon(item);
    return (
      <div
        key={getNodeId(item)}
        class={[
          getNodeRowClass(item, flatData.schema),
          { [resolveClassName('tree-node-draggable')]: props.draggable || props.dragSort },
        ]}
        data-tree-node={getNodeId(item)}
        draggable={props.draggable || props.dragSort}
      >
        <div
          style={getNodeItemStyle(item, props, flatData, showTree)}
          class={getNodeItemClass(item, flatData.schema, props, showTree)}
          onClick={(e: MouseEvent) => handleNodeContentClick(item, e, 'click')}
        >
          <div
            class={[resolveClassName('node-action'), child ? '' : 'empty-child']}
            onClick={(e: MouseEvent) => handleNodeActionClick(e, item)}
          >
            {child}
          </div>
          <div class={resolveClassName('node-content')}>
            {[getCheckboxRender(item), getNodePrefixIcon(item)]}
            <span class={resolveClassName('node-text')}>{renderNodeSlots(item)}</span>
            {ctx.slots.nodeAppend?.(getScopedSlotData(item))}
          </div>
          {showTree && getVirtualLines(item)}
        </div>
      </div>
    );
  };

  return {
    renderTreeNode,
    handleTreeNodeClick,
    deepAutoOpen,
    asyncNodeClick,
    setNodeAction,
    setNodeOpened,
    setSelect,
    setOpen,
    setNodeAttribute,
    isIndeterminate,
    deepUpdateChildNode,
    updateParentChecked,
    applyCheckedChange,
    emitCheckedChange,
    rebuildCheckedSetsFromList,
    clearAllCheckedState,
  };
};
