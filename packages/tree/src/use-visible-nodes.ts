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

import { nextTick, reactive, shallowRef, type ShallowRef, toRaw } from 'vue';

import { NODE_ATTRIBUTES } from './constant';
import { TreeNode } from './props';
import { IFlatData } from './util';

type VisibleNodeHelpers = {
  checkNodeIsOpen: (node: TreeNode) => boolean;
  getChildNodes: (node: TreeNode) => TreeNode[];
  getNodeAttr: (node: TreeNode, attr: string) => unknown;
  getNodeId: (node: TreeNode) => unknown;
  getNodePath: (node: TreeNode) => string;
  getNodeOrder: (node: TreeNode) => number;
  getSchemaVal: (node: TreeNode) => Record<string, unknown> | undefined;
  isNodeOpened: (node: TreeNode) => boolean;
};

/** 单次批量节点刷新超过该阈值时回退全局刷新，避免响应式写爆 */
const NODE_UI_REFRESH_GLOBAL_THRESHOLD = 50;

/**
 * 增量维护树的可见节点列表，避免每次展开都对全量 flatData 做 O(N) filter。
 * 展开/收起复杂度接近 O(受影响的可见子节点数)，禁止回退到全表扫描。
 *
 * UI 刷新支持按节点粒度 bump，避免自定义插槽时全量可见行重跑。
 */
export default (flatData: IFlatData, helpers: VisibleNodeHelpers) => {
  const { checkNodeIsOpen, getChildNodes, getNodeAttr, getNodeId, getNodeOrder, getSchemaVal, isNodeOpened } =
    helpers;
  const visibleNodes: ShallowRef<TreeNode[]> = shallowRef([]);
  /** 全量 UI 版本：级联勾选等大批量变更时使用 */
  const uiVersion = shallowRef(0);
  /** 任意 UI 刷新的唤醒信号：驱动 Tree 重渲染，具体行是否更新由 nodeUiVersions 决定 */
  const uiTick = shallowRef(0);
  /** 按节点 UI 版本：选中/展开图标等局部变更时只更新对应行 */
  const nodeUiVersions = reactive<Record<string, number>>({});
  let uiFlushScheduled = false;
  let pendingGlobal = false;
  const pendingNodeIds = new Set<string>();

  const emitListChange = (next: TreeNode[]) => {
    visibleNodes.value = next;
  };

  const resolveNodeId = (node: TreeNode) => {
    const id = getNodeId(node);
    return id === undefined || id === null ? '' : `${id}`;
  };

  const flushUiRefresh = () => {
    uiFlushScheduled = false;
    const useGlobal = pendingGlobal || pendingNodeIds.size > NODE_UI_REFRESH_GLOBAL_THRESHOLD;
    if (useGlobal) {
      uiVersion.value += 1;
    } else {
      pendingNodeIds.forEach(id => {
        if (!id) {
          return;
        }
        nodeUiVersions[id] = (nodeUiVersions[id] || 0) + 1;
      });
    }
    pendingGlobal = false;
    pendingNodeIds.clear();
    // 唤醒 Tree → VirtualRender 插槽重跑；未 bump 的 TreeNodeRow 会因 props 不变而跳过
    uiTick.value += 1;
  };

  /**
   * 调度 UI 刷新：
   * - 传入 node：仅刷新该行（自定义插槽场景下避免全表 slot 重跑）
   * - 不传 node：全局刷新
   */
  const scheduleUiRefresh = (node?: TreeNode) => {
    if (node) {
      const id = resolveNodeId(node);
      if (id) {
        pendingNodeIds.add(id);
      } else {
        pendingGlobal = true;
      }
    } else {
      pendingGlobal = true;
    }

    if (uiFlushScheduled) {
      return;
    }
    uiFlushScheduled = true;
    nextTick(flushUiRefresh);
  };

  const getNodeUiVersion = (node: TreeNode) => {
    const id = resolveNodeId(node);
    return id ? nodeUiVersions[id] || 0 : 0;
  };

  const rebuildVisibleNodes = (filterFn?: (node: TreeNode) => boolean) => {
    if (!filterFn && (flatData.openCount || 0) <= 0 && flatData.rootNodes?.length) {
      emitListChange(flatData.rootNodes.slice());
      return;
    }

    const predicate = filterFn ?? checkNodeIsOpen;
    const next: TreeNode[] = [];
    const data = flatData.data;
    for (let i = 0, len = data.length; i < len; i++) {
      const item = data[i];
      if (predicate(item)) {
        next.push(item);
      }
    }
    emitListChange(next);
  };

  /** 直接设置可见列表（搜索态按候选集过滤后使用，避免再扫全表） */
  const setVisibleNodes = (nodes: TreeNode[]) => {
    emitListChange(nodes.slice());
  };

  const collectOpenedBranch = (node: TreeNode, result: TreeNode[]) => {
    const children = getChildNodes(node);
    for (let i = 0, len = children.length; i < len; i++) {
      const child = children[i];
      result.push(child);
      if (isNodeOpened(child)) {
        collectOpenedBranch(child, result);
      }
    }
  };

  /** 在 flatData（DFS 序）中按 ORDER 二分定位 */
  const findFlatIndexByOrder = (targetOrder: number) => {
    const data = flatData.data;
    let low = 0;
    let high = data.length - 1;
    while (low <= high) {
      const mid = (low + high) >> 1;
      const midOrder = Number(getNodeOrder(data[mid]));
      if (midOrder === targetOrder) {
        return mid;
      }
      if (midOrder < targetOrder) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
    return -1;
  };

  /**
   * 收起时清除 flat 连续子孙区间内的 IS_OPEN（O(子树)）。
   * 避免「可见区外仍保持 IS_OPEN」导致再次展开时 collectOpenedBranch 一次插入巨量子树。
   */
  const resetFlatDescendantOpenState = (node: TreeNode) => {
    const nodeOrder = Number(getNodeOrder(node));
    const nodeDepth = Number(getNodeAttr(node, NODE_ATTRIBUTES.DEPTH) ?? 0);
    if (Number.isNaN(nodeOrder)) {
      return;
    }
    const start = findFlatIndexByOrder(nodeOrder) + 1;
    if (start <= 0) {
      return;
    }
    const data = flatData.data;
    for (let i = start, len = data.length; i < len; i++) {
      const depth = Number(getNodeAttr(data[i], NODE_ATTRIBUTES.DEPTH) ?? -1);
      if (depth <= nodeDepth) {
        break;
      }
      const schema = getSchemaVal(data[i]);
      if (!schema?.[NODE_ATTRIBUTES.IS_OPEN]) {
        continue;
      }
      schema[NODE_ATTRIBUTES.IS_OPEN] = false;
      if ((flatData.openCount || 0) > 0) {
        flatData.openCount -= 1;
      }
    }
  };

  /** 仅在可见列表内线性查找，O(V)，禁止回退扫 flat 全表 */
  const findVisibleIndexLinear = (node: TreeNode) => {
    const list = visibleNodes.value;
    const rawNode = toRaw(node) as TreeNode;
    for (let i = 0, len = list.length; i < len; i++) {
      const current = list[i];
      if (current === node || current === rawNode || toRaw(current) === rawNode) {
        return i;
      }
    }
    return -1;
  };

  /**
   * 按唯一 ORDER 二分定位，兼容 Proxy/raw 引用不一致。
   * 找不到时最多回退可见列表线性查找，不得 O(N) rebuild。
   */
  const findVisibleIndex = (node: TreeNode) => {
    const list = visibleNodes.value;
    if (!list.length) {
      return -1;
    }

    const rawNode = toRaw(node) as TreeNode;
    const targetOrder = getNodeOrder(rawNode) ?? getNodeOrder(node);
    if (targetOrder === undefined || targetOrder === null || Number.isNaN(Number(targetOrder))) {
      return findVisibleIndexLinear(node);
    }

    let low = 0;
    let high = list.length - 1;
    while (low <= high) {
      const mid = (low + high) >> 1;
      const midOrder = Number(getNodeOrder(list[mid]));
      if (midOrder === Number(targetOrder)) {
        return mid;
      }
      if (midOrder < Number(targetOrder)) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
    return findVisibleIndexLinear(node);
  };

  const closeOpenedInRange = (list: TreeNode[], start: number, end: number) => {
    for (let i = start; i < end; i++) {
      const schema = getSchemaVal(list[i]);
      if (!schema?.[NODE_ATTRIBUTES.IS_OPEN]) {
        continue;
      }
      schema[NODE_ATTRIBUTES.IS_OPEN] = false;
      if ((flatData.openCount || 0) > 0) {
        flatData.openCount -= 1;
      }
    }
  };

  /**
   * 展开节点：默认只插入直接子节点。
   * 若直接子节点自身已展开，再按需带上其已展开子树；
   * 配合 collapse 时清除 flat 子孙 IS_OPEN，避免一次插入数十万节点。
   */
  const expandVisibleNode = (node: TreeNode) => {
    const index = findVisibleIndex(node);
    if (index < 0) {
      scheduleUiRefresh(node);
      return;
    }

    const list = visibleNodes.value;
    const nodeDepth = Number(getNodeAttr(node, NODE_ATTRIBUTES.DEPTH) ?? 0);
    const next = list[index + 1];
    if (next) {
      const nextDepth = Number(getNodeAttr(next, NODE_ATTRIBUTES.DEPTH) ?? -1);
      if (nextDepth > nodeDepth) {
        scheduleUiRefresh(node);
        return;
      }
    }

    const children = getChildNodes(node);
    if (!children.length) {
      scheduleUiRefresh(node);
      return;
    }

    // 只展开一层：已打开的子节点再带上其子树（收起时已清子孙 IS_OPEN，通常不会很大）
    const insertNodes: TreeNode[] = [];
    for (let i = 0, len = children.length; i < len; i++) {
      const child = children[i];
      insertNodes.push(child);
      if (isNodeOpened(child)) {
        collectOpenedBranch(child, insertNodes);
      }
    }

    emitListChange(list.slice(0, index + 1).concat(insertNodes, list.slice(index + 1)));
    scheduleUiRefresh(node);
  };

  /**
   * 收起节点：
   * 1) 清除 flat 子孙 IS_OPEN（防止再次展开时拖入巨量子树）
   * 2) 从可见列表移除该区间
   */
  const collapseVisibleNode = (node: TreeNode) => {
    const index = findVisibleIndex(node);
    if (index < 0) {
      // 即使不在可见列表，也清掉 flat 子孙 open，保持状态一致
      resetFlatDescendantOpenState(node);
      scheduleUiRefresh(node);
      return;
    }

    const list = visibleNodes.value;
    const nodeDepth = Number(getNodeAttr(node, NODE_ATTRIBUTES.DEPTH) ?? 0);
    let end = index + 1;
    while (end < list.length) {
      const depth = Number(getNodeAttr(list[end], NODE_ATTRIBUTES.DEPTH) ?? -1);
      if (depth <= nodeDepth) {
        break;
      }
      end += 1;
    }

    // 先清 flat 子孙，再改可见列表（closeOpenedInRange 对已关闭节点是 no-op）
    resetFlatDescendantOpenState(node);

    if (end === index + 1) {
      scheduleUiRefresh(node);
      return;
    }

    closeOpenedInRange(list, index + 1, end);
    emitListChange(list.slice(0, index + 1).concat(list.slice(end)));
    scheduleUiRefresh(node);
  };

  const syncNodeOpenState = (node: TreeNode, isOpen: boolean) => {
    if (isOpen) {
      expandVisibleNode(node);
      return;
    }
    collapseVisibleNode(node);
  };

  rebuildVisibleNodes();

  return {
    visibleNodes,
    uiVersion,
    uiTick,
    nodeUiVersions,
    getNodeUiVersion,
    rebuildVisibleNodes,
    setVisibleNodes,
    expandVisibleNode,
    collapseVisibleNode,
    syncNodeOpenState,
    scheduleUiRefresh,
  };
};

export type { VisibleNodeHelpers };
