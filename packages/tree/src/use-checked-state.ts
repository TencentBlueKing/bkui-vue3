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

import { NODE_ATTRIBUTES } from './constant';
import { TreeNode } from './props';
import { IFlatData } from './util';

type CheckedHelpers = {
  getChildNodes: (node: TreeNode) => TreeNode[];
  getNodeAttr: (node: TreeNode, attr: string) => unknown;
  getParentNode: (node: TreeNode) => TreeNode | null | undefined;
  getSchemaVal: (node: TreeNode) => Record<string, unknown> | undefined;
  isRootNode: (node: TreeNode) => boolean;
};

/**
 * 勾选状态增量维护：
 * - checked/indeterminate 用 Set 跟踪，避免每次 emit 全表 filter O(N)
 * - 子树更新按 flatData 的 DFS 连续区间扫描，避免递归调用开销
 */
export default (flatData: IFlatData, helpers: CheckedHelpers) => {
  const { getChildNodes, getNodeAttr, getParentNode, getSchemaVal, isRootNode } = helpers;

  const checkedSet = new Set<TreeNode>();
  const indeterminateSet = new Set<TreeNode>();

  const syncNodeToSets = (node: TreeNode) => {
    const schema = getSchemaVal(node);
    if (!schema) {
      return;
    }
    const checked = !!schema[NODE_ATTRIBUTES.IS_CHECKED];
    const indeterminate = checked && !!schema[NODE_ATTRIBUTES.IS_INDETERMINATE];

    if (checked) {
      checkedSet.add(node);
    } else {
      checkedSet.delete(node);
    }

    if (indeterminate) {
      indeterminateSet.add(node);
    } else {
      indeterminateSet.delete(node);
    }
  };

  const setNodeCheckedState = (
    node: TreeNode,
    checked: boolean,
    indeterminate = false,
  ): boolean => {
    const schema = getSchemaVal(node);
    if (!schema) {
      return false;
    }

    const nextChecked = !!checked;
    const nextIndeterminate = nextChecked && !!indeterminate;
    const prevChecked = !!schema[NODE_ATTRIBUTES.IS_CHECKED];
    const prevIndeterminate = !!schema[NODE_ATTRIBUTES.IS_INDETERMINATE];

    if (prevChecked === nextChecked && prevIndeterminate === nextIndeterminate) {
      return false;
    }

    schema[NODE_ATTRIBUTES.IS_CHECKED] = nextChecked;
    schema[NODE_ATTRIBUTES.IS_INDETERMINATE] = nextIndeterminate;

    if (nextChecked) {
      checkedSet.add(node);
    } else {
      checkedSet.delete(node);
    }

    if (nextIndeterminate) {
      indeterminateSet.add(node);
    } else {
      indeterminateSet.delete(node);
    }

    return true;
  };

  /** 基于 flatten 收集的 checkedList 重建，避免无勾选时全表扫描 */
  const rebuildCheckedSetsFromList = (nodes: TreeNode[] = []) => {
    checkedSet.clear();
    indeterminateSet.clear();
    for (let i = 0, len = nodes.length; i < len; i++) {
      const node = nodes[i];
      syncNodeToSets(node);
      let parent = getParentNode(node) as TreeNode | null;
      while (parent) {
        syncNodeToSets(parent);
        parent = getParentNode(parent) as TreeNode | null;
      }
    }
  };

  /**
   * flatData 为 DFS 序，INDEX 即数组下标；后代是一段连续区间。
   */
  const forEachDescendant = (node: TreeNode, fn: (child: TreeNode) => void) => {
    const data = flatData.data;
    const start = ((getNodeAttr(node, NODE_ATTRIBUTES.INDEX) as number) ?? -1) + 1;
    if (start <= 0) {
      return;
    }

    const nodeDepth = (getNodeAttr(node, NODE_ATTRIBUTES.DEPTH) as number) ?? 0;
    for (let i = start; i < data.length; i++) {
      const child = data[i];
      const depth = (getNodeAttr(child, NODE_ATTRIBUTES.DEPTH) as number) ?? 0;
      if (depth <= nodeDepth) {
        break;
      }
      fn(child);
    }
  };

  const setDescendantChecked = (node: TreeNode, checked: boolean) => {
    forEachDescendant(node, child => {
      setNodeCheckedState(child, checked, false);
    });
  };

  const isNodeChecked = (node: TreeNode) => !!getNodeAttr(node, NODE_ATTRIBUTES.IS_CHECKED);
  const isNodeIndeterminate = (node: TreeNode) =>
    isNodeChecked(node) && !!getNodeAttr(node, NODE_ATTRIBUTES.IS_INDETERMINATE);

  /**
   * 自底向上更新祖先勾选 / 半选，复杂度 O(depth × 兄弟数)
   */
  const updateParentChecked = (item: TreeNode) => {
    const parent = getParentNode(item) as TreeNode | null;
    if (!parent) {
      return;
    }

    const children = getChildNodes(parent) || [];
    let hasChecked = false;
    let hasUncheckedOrIndeterminate = false;

    for (let i = 0, len = children.length; i < len; i++) {
      const child = children[i];
      const childChecked = isNodeChecked(child);
      if (childChecked) {
        hasChecked = true;
      }
      if (!childChecked || isNodeIndeterminate(child)) {
        hasUncheckedOrIndeterminate = true;
      }
      // 半选态已确定，可提前结束
      if (hasChecked && hasUncheckedOrIndeterminate) {
        break;
      }
    }

    setNodeCheckedState(parent, hasChecked, hasChecked && hasUncheckedOrIndeterminate);

    if (!isRootNode(parent)) {
      updateParentChecked(parent);
    }
  };

  const getCheckedEmitPayload = (): [TreeNode[], TreeNode[]] => [
    Array.from(checkedSet),
    Array.from(indeterminateSet),
  ];

  const rebuildCheckedSets = () => {
    checkedSet.clear();
    indeterminateSet.clear();
    const data = flatData.data;
    for (let i = 0, len = data.length; i < len; i++) {
      syncNodeToSets(data[i]);
    }
  };

  const clearAllCheckedState = () => {
    checkedSet.forEach(node => {
      const schema = getSchemaVal(node);
      if (schema) {
        schema[NODE_ATTRIBUTES.IS_CHECKED] = false;
        schema[NODE_ATTRIBUTES.IS_INDETERMINATE] = false;
      }
    });
    indeterminateSet.clear();
    checkedSet.clear();
  };

  // 初始化：优先用 flatten 结果，避免空勾选时扫百万节点
  rebuildCheckedSetsFromList(flatData.checkedList || []);
  flatData.syncCheckedState = syncNodeToSets;

  return {
    checkedSet,
    indeterminateSet,
    syncNodeToSets,
    setNodeCheckedState,
    setDescendantChecked,
    forEachDescendant,
    updateParentChecked,
    getCheckedEmitPayload,
    rebuildCheckedSets,
    rebuildCheckedSetsFromList,
    clearAllCheckedState,
    isNodeIndeterminate,
  };
};
