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
import { defineComponent, nextTick, onMounted, ref, watch } from 'vue';

import { usePrefix } from '@bkui-vue/config-provider';
import { debounce } from '@bkui-vue/shared';
import VirtualRender from '@bkui-vue/virtual-render';
import { cloneDeep } from 'lodash';

import { EVENTS, NODE_ATTRIBUTES, NODE_SOURCE_ATTRS, TreeEmitEventsType } from './constant';
import { TreeDataChangePayload, treeProps, TreePropTypes as defineTypes, TreeNode } from './props';
import TreeNodeRow from './tree-node-row';
import useEmpty from './use-empty';
import useIntersectionObserver from './use-intersection-observer';
import useNodeAction from './use-node-action';
import useNodeAttribute from './use-node-attribute';
import useNodeDrag from './use-node-drag';
import useSearch from './use-search';
import useTreeInit from './use-tree-init';
import useVisibleNodes from './use-visible-nodes';
import { getLabel, getTreeStyle, resolveNodeItem } from './util';

export type TreePropTypes = defineTypes;

export type ITreeScrollTopOption = {
  id?: string;
  index?: number;
};

export default defineComponent({
  name: 'Tree',
  props: treeProps,
  emits: TreeEmitEventsType,
  setup(props, ctx) {
    const root = ref();
    const treeDataRef = ref<TreeNode[]>(props.data as TreeNode[]);

    const { flatData, onSelected, rebuildData, registerNextLoop, onAfterRebuild } = useTreeInit(props);

    const {
      checkNodeIsOpen,
      isRootNode,
      isNodeOpened,
      isNodeChecked,
      isNodeMatched,
      hasChildNode,
      getNodeId,
      getNodeAttr,
      getNodeById,
      getParentNode,
      getRootNodeList,
      getIntersectionResponse,
      getChildNodes,
      getNodePath,
      getSchemaVal,
      setNodeAttr,
    } = useNodeAttribute(flatData, props);

    const {
      createMatcher,
      searchValue,
      isSearchActive,
      isTreeUI,
      resultType,
      showChildNodes,
    } = useSearch(props);
    // 不可用 reactive(Set)：百万次 add/clear 会反复触发依赖，导致检索「连续刷新」
    const matchedNodeIds = new Set<string>();
    const visibleNodeIds = new Set<string>();
    /** 搜索候选节点（DFS 序），展开/收起时只在此集合上过滤，O(命中集) */
    let searchCandidateNodes: TreeNode[] = [];
    const searchOriginalOpenState = new Map<string, boolean>();

    const getChildNodesForVisible = (node: TreeNode) => {
      const children = getChildNodes(node);
      if (!isSearchActive.value) {
        return children;
      }
      // 搜索态只插入检索可见集内的子节点，保证展开/收起增量正确
      return children.filter(child => visibleNodeIds.has(`${getNodeId(child)}`));
    };

    const {
      visibleNodes: renderData,
      uiVersion,
      uiTick,
      nodeUiVersions,
      rebuildVisibleNodes,
      setVisibleNodes,
      syncNodeOpenState: syncNodeOpenStateRaw,
      scheduleUiRefresh,
    } = useVisibleNodes(flatData, {
      checkNodeIsOpen,
      getChildNodes: getChildNodesForVisible,
      getNodeAttr,
      getNodeId,
      getNodePath,
      getNodeOrder: node => (getNodeAttr(node, NODE_ATTRIBUTES.ORDER) as number) ?? 0,
      getSchemaVal,
      isNodeOpened,
    });

    const isSearchTreeNodeVisible = (item: TreeNode) => {
      if (!visibleNodeIds.has(`${getNodeId(item)}`)) {
        return false;
      }
      let parent = getParentNode(item) as TreeNode | null;
      while (parent) {
        if (!isNodeOpened(parent)) {
          return false;
        }
        parent = getParentNode(parent) as TreeNode | null;
      }
      return true;
    };

    const rebuildSearchVisibleList = () => {
      if (!isTreeUI.value) {
        setVisibleNodes(searchCandidateNodes);
        return;
      }
      const next: TreeNode[] = [];
      for (let i = 0, len = searchCandidateNodes.length; i < len; i++) {
        const item = searchCandidateNodes[i];
        if (isSearchTreeNodeVisible(item)) {
          next.push(item);
        }
      }
      setVisibleNodes(next);
    };

    /**
     * 搜索 list 模式：展开不影响可见集。
     * 其它情况走增量 expand/collapse（搜索 tree 下 getChildNodes 已按候选集过滤）。
     */
    const syncNodeOpenState = (node: TreeNode, isOpen: boolean) => {
      if (isSearchActive.value && !isTreeUI.value) {
        scheduleUiRefresh(node);
        return;
      }
      syncNodeOpenStateRaw(node, isOpen);
    };

    flatData.notifySchemaChange = (node, attr) => {
      // IS_OPEN 由 syncNodeOpenState 增量维护可见列表，并按节点刷新图标
      if (attr === NODE_ATTRIBUTES.IS_OPEN) {
        return;
      }
      // 选中/勾选等：只刷新变更节点，避免自定义插槽全量重跑
      scheduleUiRefresh(node);
    };

    const getRenderNodeId = (node: TreeNode) => `${getNodeId(node)}`;

    const setSearchNodeOpen = (node: TreeNode) => {
      const nodeId = getRenderNodeId(node);
      if (!searchOriginalOpenState.has(nodeId)) {
        searchOriginalOpenState.set(nodeId, isNodeOpened(node));
      }
      setNodeAttr(node, NODE_ATTRIBUTES.IS_OPEN, true, undefined, { silent: true });
    };

    const restoreSearchOpenState = () => {
      searchOriginalOpenState.forEach((isOpen, nodeId) => {
        const node = getNodeById(nodeId);
        if (node) {
          setNodeAttr(node, NODE_ATTRIBUTES.IS_OPEN, isOpen, undefined, { silent: true });
        }
      });
      searchOriginalOpenState.clear();
    };

    const clearMatchedFlags = () => {
      matchedNodeIds.forEach(nodeId => {
        const node = getNodeById(nodeId);
        if (node) {
          setNodeAttr(node, NODE_ATTRIBUTES.IS_MATCH, false, undefined, { silent: true });
        }
      });
      matchedNodeIds.clear();
    };

    const addAncestorNodes = (node: TreeNode) => {
      let parent = getParentNode(node) as TreeNode | null;
      while (parent) {
        const parentId = getRenderNodeId(parent);
        visibleNodeIds.add(parentId);
        setSearchNodeOpen(parent);
        parent = getParentNode(parent) as TreeNode | null;
      }
    };

    const addDescendantNodes = (node: TreeNode) => {
      const children = getChildNodes(node);
      for (let i = 0, len = children.length; i < len; i++) {
        const child = children[i];
        visibleNodeIds.add(getRenderNodeId(child));
        // showChildNodes：默认展开有子节点的路径，深层结果可直接可见；用户仍可手动收起
        if (hasChildNode(child)) {
          setSearchNodeOpen(child);
        }
        addDescendantNodes(child);
      }
    };

    const { getLastVisibleElement, intersectionObserver } = useIntersectionObserver(props);

    const collectOpenNodeIds = () => {
      const openNodeIds = new Set<string>();
      flatData.data.forEach(node => {
        if (isNodeOpened(node)) {
          openNodeIds.add(`${getNodeId(node)}`);
        }
      });

      return openNodeIds;
    };

    const getSourceNodeId = (node: TreeNode) => `${node?.[props.nodeKey || NODE_ATTRIBUTES.UUID]}`;
    const getSourceChildren = (node: TreeNode) => (node?.[props.children] as TreeNode[]) || [];
    const sourceOpenAttr = NODE_SOURCE_ATTRS[NODE_ATTRIBUTES.IS_OPEN];

    const removeOpenState = (node: TreeNode, openNodeIds: Set<string>) => {
      openNodeIds.delete(getSourceNodeId(node));
      getSourceChildren(node).forEach(child => {
        removeOpenState(child, openNodeIds);
      });
    };

    const syncDragTargetOpenState = (openNodeIds: Set<string>, payload: TreeDataChangePayload) => {
      if (payload.trigger !== 'drag' || payload.dropType !== 'child' || !payload.targetNode) {
        return;
      }

      const targetOpenState = props.dragTargetOpenState || 'inherit';
      if (targetOpenState === 'inherit') {
        return;
      }

      const targetNodeId = getSourceNodeId(payload.targetNode);
      if (targetOpenState === 'expand') {
        openNodeIds.add(targetNodeId);
      }
      if (targetOpenState === 'collapse') {
        removeOpenState(payload.targetNode, openNodeIds);
      }
    };

    const syncSourceOpenState = (treeData: TreeNode[], openNodeIds: Set<string>, parentOpened = true) => {
      treeData.forEach(node => {
        const isOpen = parentOpened && openNodeIds.has(getSourceNodeId(node));
        if (isOpen || !parentOpened || Object.prototype.hasOwnProperty.call(node, sourceOpenAttr)) {
          node[sourceOpenAttr] = isOpen;
        }
        syncSourceOpenState(getSourceChildren(node), openNodeIds, isOpen);
      });
    };

    const normalizeDragOpenState = (payload: TreeDataChangePayload) => {
      const openNodeIds = collectOpenNodeIds();
      syncDragTargetOpenState(openNodeIds, payload);
      syncSourceOpenState(payload.data, openNodeIds);
    };

    const onTreeDataChange = (payload: TreeDataChangePayload) => {
      if (payload.trigger === 'drag') {
        normalizeDragOpenState(payload);
      }
      treeDataRef.value = payload.data ?? [];
      rebuildData(treeDataRef.value);
      ctx.emit(EVENTS.NODE_DATA_CHANGE, payload);
      props.onDataChange?.(payload);
    };

    const {
      renderTreeNode,
      handleTreeNodeClick,
      setOpen,
      setNodeAction,
      setSelect,
      asyncNodeClick,
      applyCheckedChange,
      emitCheckedChange,
      rebuildCheckedSetsFromList,
      clearAllCheckedState,
    } = useNodeAction(props, ctx, flatData, renderData, {
      getTreeData: () => treeDataRef.value,
      onTreeDataChange,
      registerNextLoop,
      syncNodeOpenState,
      scheduleUiRefresh,
    });

    // 数据重建完成后同步勾选索引与可见列表（保证读到最新 schema）
    const runSearch = () => {
      restoreSearchOpenState();
      clearMatchedFlags();
      visibleNodeIds.clear();
      searchCandidateNodes = [];

      // 非搜索态：只恢复展开并重建可见列表，禁止扫全表写 IS_MATCH
      if (!isSearchActive.value) {
        rebuildVisibleNodes();
        scheduleUiRefresh();
        return;
      }

      const matcher = createMatcher();
      const data = flatData.data;
      const matchedNodes: TreeNode[] = [];

      for (let i = 0, len = data.length; i < len; i++) {
        const item = data[i];
        if (!matcher(getLabel(item, props), item)) {
          continue;
        }
        const nodeId = getRenderNodeId(item);
        matchedNodeIds.add(nodeId);
        visibleNodeIds.add(nodeId);
        matchedNodes.push(item);
        // 仅给命中节点打标，禁止全表 setAttribute
        setNodeAttr(item, NODE_ATTRIBUTES.IS_MATCH, true, undefined, { silent: true });
      }

      for (let i = 0, len = matchedNodes.length; i < len; i++) {
        const item = matchedNodes[i];
        if (resultType.value === 'tree') {
          addAncestorNodes(item);
        }
        if (showChildNodes.value) {
          setSearchNodeOpen(item);
          addDescendantNodes(item);
        }
      }

      // 按 DFS 序收集候选集，后续展开/收起只扫候选集
      for (let i = 0, len = data.length; i < len; i++) {
        const item = data[i];
        if (visibleNodeIds.has(getRenderNodeId(item))) {
          searchCandidateNodes.push(item);
        }
      }

      rebuildSearchVisibleList();
      scheduleUiRefresh();
    };

    const syncAfterRebuild = () => {
      rebuildCheckedSetsFromList(flatData.checkedList || []);
      if (isSearchActive.value) {
        runSearch();
        return;
      }
      rebuildVisibleNodes();
    };
    onAfterRebuild(syncAfterRebuild);
    watch(() => flatData.data, syncAfterRebuild);

    const handleSearch = debounce(120, runSearch);

    // 只浅监听检索值 / 展示模式，避免 deep watch search 对象在赋值时连环触发
    watch(
      () => [searchValue.value, resultType.value, showChildNodes.value] as const,
      () => {
        handleSearch();
      },
      { immediate: true },
    );

    onMounted(() => {
      if (props.virtualRender) {
        nextTick(() => {
          scrollToTop();
        });
      }
    });

    /**
     * 设置指定节点是否选中
     * @param item Node item | Node Id | Array of Node items or Node Ids
     * @param checked
     * @param triggerEvent 是否触发抛出事件
     */
    const setChecked = (
      item: (number | string)[] | TreeNode | TreeNode[] | number | string,
      checked = true,
      triggerEvent = false,
    ) => {
      // 将 item 转换为 TreeNode 数组
      const resolveToNodes = (input: (number | string)[] | TreeNode | TreeNode[] | number | string): TreeNode[] => {
        if (Array.isArray(input)) {
          return input
            .map(i => {
              if (typeof i === 'string' || typeof i === 'number') {
                return getNodeById(i as string);
              }
              return i as TreeNode;
            })
            .filter(Boolean);
        }

        if (typeof input === 'string' || typeof input === 'number') {
          const node = getNodeById(input as string);
          return node ? [node] : [];
        }

        return [input as TreeNode].filter(Boolean);
      };

      const nodes = resolveToNodes(item);
      nodes.forEach(node => {
        const resolvedNode = resolveNodeItem(node);
        if (resolvedNode[NODE_ATTRIBUTES.IS_NULL]) {
          return;
        }
        applyCheckedChange(resolvedNode, checked, { emitEvent: false, refresh: false });
      });

      scheduleUiRefresh();

      if (triggerEvent) {
        emitCheckedChange();
      }
    };

    onSelected((newData: TreeNode) => {
      setSelect(newData, true, props.autoOpenParentNode, true);
    });

    watch(
      () => props.data,
      value => {
        treeDataRef.value = value as TreeNode[];
      },
    );

    /**
     * 根据最新的schema生成最新的Tree结构数据
     * @returns
     */
    const getLastTreeDataBySchema = () => {
      const loopData = (rootNodeList: TreeNode[]) => {
        return (rootNodeList ?? []).map(node => {
          const copyData = cloneDeep(node);
          if (!copyData) {
            return copyData;
          }

          const children = flatData.data.filter(item => getParentNode(item) === node) as TreeNode[];
          copyData[props.children] = loopData(children);
          return copyData;
        });
      };
      return loopData(getRootNodeList());
    };

    /**
     * 获取当前树形结构相关数据
     * @param newTree 如果启用了排序，拖拽功能，这里数据结构会改变，需要设置为true，获取最新的数据
     * @returns
     */
    const getData = (newTree: false) => {
      if (!newTree) {
        return flatData;
      }

      return { data: getLastTreeDataBySchema(), schema: flatData.schema, levelLineSchema: flatData.levelLineSchema };
    };

    watch(
      () => [props.checked],
      () => {
        clearAllCheckedState();
        setChecked(props.checked, true);
      },
      {
        immediate: true,
      },
    );

    const reset = () => {
      root.value?.reset();
    };

    /**
     * 将制定元素滚动到顶部
     * @param option
     */
    const scrollToTop = (option?: ITreeScrollTopOption) => {
      if (option === undefined || option === null) {
        root.value.fixToTop({ index: 1 });
        return;
      }

      if (props.nodeKey && Object.prototype.hasOwnProperty.call(option, props.nodeKey)) {
        root.value.fixToTop({
          index: renderData.value.findIndex(node => node[props.nodeKey] === option[props.nodeKey]) + 1,
        });
        return;
      }

      if (option.id !== undefined && option.id !== null) {
        root.value.fixToTop({
          index: renderData.value.findIndex(node => node[props.nodeKey] === option.id) + 1,
        });
        return;
      }

      if (option.index >= 0) {
        root.value.fixToTop({ index: option.index });
        return;
      }

      const id = getNodeId(option as TreeNode);
      if (id) {
        root.value.fixToTop({
          index: renderData.value.findIndex(node => getNodeId(node) === id) + 1,
        });
        return;
      }
    };

    const setCheckedById = (id: string, checked = true, triggerEvent = false) => {
      setChecked(getNodeById(id), checked, triggerEvent);
    };

    /**
     * 收起全部节点。
     * 直接批量清 schema.IS_OPEN，避免逐节点 setOpen 触发百万次增量更新。
     */
    const collapseAll = () => {
      const data = flatData.data;
      for (let i = 0, len = data.length; i < len; i++) {
        const schema = getSchemaVal(data[i]);
        if (schema?.[NODE_ATTRIBUTES.IS_OPEN]) {
          schema[NODE_ATTRIBUTES.IS_OPEN] = false;
        }
      }
      flatData.openCount = 0;

      if (isSearchActive.value) {
        rebuildSearchVisibleList();
      } else {
        rebuildVisibleNodes();
      }
      scheduleUiRefresh();
    };

    /**
     * 展开全部节点（openAllNodes）。
     * 批量写 IS_OPEN 后一次性重建可见列表。
     */
    const expandAllNodes = () => {
      const data = flatData.data;
      let openCount = 0;
      for (let i = 0, len = data.length; i < len; i++) {
        const node = data[i];
        if (!hasChildNode(node)) {
          continue;
        }
        const schema = getSchemaVal(node);
        if (!schema) {
          continue;
        }
        if (!schema[NODE_ATTRIBUTES.IS_OPEN]) {
          schema[NODE_ATTRIBUTES.IS_OPEN] = true;
        }
        openCount += 1;
      }
      flatData.openCount = openCount;

      if (isSearchActive.value) {
        rebuildSearchVisibleList();
      } else {
        rebuildVisibleNodes();
      }
      scheduleUiRefresh();
    };

    ctx.expose({
      handleTreeNodeClick,
      isNodeChecked,
      isRootNode,
      isNodeOpened,
      isNodeMatched,
      hasChildNode,
      setOpen,
      setChecked,
      setCheckedById,
      setNodeAction,
      setNodeOpened: setOpen,
      setSelect,
      scrollToTop,
      asyncNodeClick,
      getData,
      reset,
      getNodeAttr,
      getParentNode,
      collapseAll,
      expandAll: expandAllNodes,
      openAllNodes: expandAllNodes,
    });

    const { renderEmpty } = useEmpty(props);
    useNodeDrag(props, ctx, root, flatData, {
      getTreeData: () => treeDataRef.value,
      onTreeDataChange,
    });
    const renderTreeContent = (scopedData: TreeNode[]) => {
      if (scopedData.length) {
        const showTree = !isSearchActive.value || isTreeUI.value;
        const globalVersion = uiVersion.value;
        return scopedData.map(d => {
          const id = `${getNodeId(d)}`;
          return (
            <TreeNodeRow
              key={id}
              item={d}
              showTree={showTree}
              version={nodeUiVersions[id] || 0}
              globalVersion={globalVersion}
              renderFn={renderTreeNode}
            />
          );
        });
      }

      const emptyType = isSearchActive.value ? 'search-empty' : 'empty';
      return ctx.slots.empty?.() ?? renderEmpty(emptyType);
    };

    /**
     * 如果启用了虚拟渲染 & 虚拟滚动
     * @param param0
     */
    const handleContentScroll = ([scroll, _pagination, list]) => {
      if (intersectionObserver.value.enabled) {
        if (scroll.offset.y > 5) {
          if (!props.virtualRender) {
            const lastElement = getLastVisibleElement(scroll.offset.y, root.value.refRoot);
            const result = getIntersectionResponse(lastElement[0]);
            intersectionObserver.value?.callback?.(result);
            ctx.emit(EVENTS.NODE_ENTER_VIEW, result);
            return;
          }

          const resp = getIntersectionResponse(list.slice(-1)[0]);
          intersectionObserver.value?.callback?.(resp);
          ctx.emit(EVENTS.NODE_ENTER_VIEW, resp);
          return;
        }
      }
    };

    const { resolveClassName } = usePrefix();

    return () => {
      // uiTick：节点级刷新时唤醒 Tree；具体哪些行更新由 TreeNodeRow 的 version 决定
      void uiTick.value;

      return (
        <VirtualRender
          ref={root}
          style={getTreeStyle(null, props)}
          height={props.height}
          class={resolveClassName('tree')}
          contentClassName={resolveClassName('container')}
          enabled={props.virtualRender}
          keepAlive={true}
          lineHeight={props.lineHeight}
          list={renderData.value}
          rowKey={props.nodeKey || NODE_ATTRIBUTES.UUID}
          throttleDelay={0}
          onContentScroll={handleContentScroll}
        >
          {{
            default: (scoped: { data: TreeNode[] }) => renderTreeContent(scoped.data || []),
          }}
        </VirtualRender>
      );
    };
  },
});
