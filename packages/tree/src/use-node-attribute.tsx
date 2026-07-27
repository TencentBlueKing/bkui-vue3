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

import isElement from 'lodash/isElement';
import { markRaw, toRaw } from 'vue';

import { NODE_ATTRIBUTES, NODE_SOURCE_ATTRS } from './constant';
import { TreeNode, TreePropTypes } from './props';

type TreeNodeAttributeMap = {
  [NODE_ATTRIBUTES.DEPTH]: number;
  [NODE_ATTRIBUTES.HAS_CHILD]: boolean;
  [NODE_ATTRIBUTES.INDEX]: number;
  [NODE_ATTRIBUTES.IS_ASYNC]: boolean;
  [NODE_ATTRIBUTES.IS_ASYNC_INIT]: boolean;
  [NODE_ATTRIBUTES.IS_CACHED]: boolean;
  [NODE_ATTRIBUTES.IS_CHECKED]: boolean;
  [NODE_ATTRIBUTES.IS_INDETERMINATE]: boolean;
  [NODE_ATTRIBUTES.IS_LOADING]: boolean;
  [NODE_ATTRIBUTES.IS_MATCH]: boolean;
  [NODE_ATTRIBUTES.IS_NULL]: boolean;
  [NODE_ATTRIBUTES.IS_OPEN]: boolean;
  [NODE_ATTRIBUTES.IS_ROOT]: boolean;
  [NODE_ATTRIBUTES.IS_SELECTED]: boolean;
  [NODE_ATTRIBUTES.ORDER]: number;
  [NODE_ATTRIBUTES.PARENT]: TreeNode;
  [NODE_ATTRIBUTES.PATH]: string;
  [NODE_ATTRIBUTES.TREE_NODE_ATTR]: Record<string, unknown>;
  [NODE_ATTRIBUTES.UUID]: string | number;
};

type SetNodeAttrOptions = {
  /** 跳过 UI 刷新通知（批量更新时使用） */
  silent?: boolean;
};

type UseNodeAttributeOptions = {
  /** schema 变更后的 UI 刷新（schema 已 markRaw，需显式通知） */
  onSchemaChange?: (node: TreeNode, attr: string, val: unknown) => void;
};

export default (
  flatData: {
    data: TreeNode[];
    schema: WeakMap<TreeNode, Record<string, unknown>>;
    nodeMap?: Map<number | string, TreeNode>;
    childMap?: WeakMap<TreeNode, TreeNode[]>;
    rootNodes?: TreeNode[];
    openCount?: number;
    notifySchemaChange?: (node: TreeNode, attr: string, val: unknown) => void;
    syncCheckedState?: (node: TreeNode) => void;
  },
  props?: TreePropTypes,
  options: UseNodeAttributeOptions = {},
) => {
  /**
   * WeakMap 以对象引用为 key；Vue Proxy 与 raw 不是同一引用，需同时兼容
   */
  const resolveSchemaNode = (node: TreeNode | null | undefined): TreeNode | null => {
    if (!node) {
      return null;
    }
    if (flatData.schema.has(node)) {
      return node;
    }
    const raw = toRaw(node);
    if (raw && raw !== node && flatData.schema.has(raw)) {
      return raw;
    }
    return null;
  };

  /**
   * 获取Schema中指定的对象值
   * @param key
   * @returns
   */
  const getSchemaVal = (node: TreeNode) => {
    const schemaNode = resolveSchemaNode(node);
    return schemaNode ? flatData.schema.get(schemaNode) : undefined;
  };

  /**
   * 获取节点属性
   * @param node 当前节点
   * @param attr 节点属性
   * @returns
   */
  function getNodeAttr<T extends NODE_ATTRIBUTES>(
    node: TreeNode | null | undefined,
    attr: T,
  ): TreeNodeAttributeMap[T] | undefined;
  function getNodeAttr(node: TreeNode | null | undefined, attr: string): unknown;
  function getNodeAttr(node: TreeNode | null | undefined, attr: string) {
    return node ? getSchemaVal(node)?.[attr] : undefined;
  }

  /**
   * 设置节点属性（原地更新 schema，避免每次 Object.assign 新对象）
   * @param node 指定节点
   * @param attr 节点属性
   * @param val 属性值
   * @returns
   */
  const setNodeAttr = (node: TreeNode, attr: string, val: unknown, id?, setOptions: SetNodeAttrOptions = {}) => {
    const schemaNode = resolveSchemaNode(node);
    if (!schemaNode) {
      console.warn('node is not in schema, please check', id, node);
      return;
    }

    const schemaVal = flatData.schema.get(schemaNode);
    if (!schemaVal) {
      return;
    }

    if (schemaVal[attr] === val) {
      return;
    }

    if (attr === NODE_ATTRIBUTES.IS_OPEN) {
      const prevOpen = !!schemaVal[attr];
      const nextOpen = !!val;
      if (prevOpen !== nextOpen) {
        flatData.openCount = (flatData.openCount || 0) + (nextOpen ? 1 : -1);
      }
    }

    schemaVal[attr] = val;

    if (attr === NODE_ATTRIBUTES.IS_CHECKED || attr === NODE_ATTRIBUTES.IS_INDETERMINATE) {
      flatData.syncCheckedState?.(node);
    }

    if (!setOptions.silent) {
      options.onSchemaChange?.(node, attr, val);
      flatData.notifySchemaChange?.(node, attr, val);
    }
  };

  const getNodeById = (id: string | unknown): TreeNode =>
    flatData.nodeMap?.get(`${id}`) ?? flatData.data.find(item => `${getNodeId(item)}` === `${id}`);

  const setNodeAttrById = (id: unknown, attr: string, val: unknown) => {
    if (Array.isArray(id)) {
      Array.prototype.forEach.call(id, (item: TreeNode) => setNodeAttr(getNodeById(item), attr, val, id));
      return;
    }

    setNodeAttr(getNodeById(id), attr, val, id);
  };

  const getNodePath = (node: TreeNode) => getNodeAttr(node, NODE_ATTRIBUTES.PATH);
  const getNodeId = (node: TreeNode | null | undefined) => {
    const schemaId = getNodeAttr(node, NODE_ATTRIBUTES.UUID);
    if (schemaId !== undefined && schemaId !== null && schemaId !== '') {
      return schemaId as string | number;
    }
    if (!node) {
      return undefined;
    }
    if (props?.nodeKey && node[props.nodeKey] !== undefined && node[props.nodeKey] !== null) {
      return node[props.nodeKey] as string | number;
    }
    return node[NODE_ATTRIBUTES.UUID] as string | number;
  };
  const isNodeOpened = (node: TreeNode) => !!getNodeAttr(node, NODE_ATTRIBUTES.IS_OPEN);
  const hasChildNode = (node: TreeNode) => {
    if (!!getNodeAttr(node, NODE_ATTRIBUTES.HAS_CHILD)) {
      return true;
    }
    const schemaNode = resolveSchemaNode(node);
    if (schemaNode && (flatData.childMap?.get(schemaNode)?.length ?? 0) > 0) {
      return true;
    }
    const childKey = props?.children || 'children';
    const rawNode = toRaw(node) as TreeNode;
    return !!((rawNode?.[childKey] as TreeNode[] | undefined)?.length || (node?.[childKey] as TreeNode[] | undefined)?.length);
  };
  const isNodeMatched = (node: TreeNode) => !!getNodeAttr(node, NODE_ATTRIBUTES.IS_MATCH);
  const isNodeChecked = (node: TreeNode) => !!getNodeAttr(node, NODE_ATTRIBUTES.IS_CHECKED);
  const getNodeParentId = (node: TreeNode) =>
    getNodeAttr(getNodeAttr(node, NODE_ATTRIBUTES.PARENT) as TreeNode, NODE_ATTRIBUTES.UUID);
  const isNodeLoading = (node: TreeNode) => !!getNodeAttr(node, NODE_ATTRIBUTES.IS_LOADING);
  const getParentNode = (node: TreeNode) => getNodeAttr(node, NODE_ATTRIBUTES.PARENT);
  const isMatchedNode = (node: TreeNode) => !!getNodeAttr(node, NODE_ATTRIBUTES.IS_MATCH);

  const getNodeAttrById = (id: string, attr: string) => {
    const target = getNodeById(id);
    return getNodeAttr(target, attr);
  };

  /**
   * 获取节点索引
   * @param id 节点 ID
   * @returns 节点索引
   */
  const getNodeIndexById = (id: string): number => getNodeAttrById(id, NODE_ATTRIBUTES.INDEX) as number;

  /**
   * 获取节点索引
   * @param node 节点
   * @returns 节点索引
   */
  const getNodeIndexByNode = (node: TreeNode): number => getNodeAttr(node, NODE_ATTRIBUTES.INDEX) as number;

  const isRootNode = (node: TreeNode | string) => {
    if (typeof node === 'string') {
      return !!getNodeAttrById(node, NODE_ATTRIBUTES.IS_ROOT);
    }

    if (!!getNodeAttr(node, NODE_ATTRIBUTES.IS_ROOT)) {
      return true;
    }
    if (getNodeAttr(node, NODE_ATTRIBUTES.PARENT)) {
      return false;
    }
    const schemaNode = resolveSchemaNode(node);
    return !!schemaNode && !!flatData.rootNodes?.includes(schemaNode);
  };

  const getNodeParentIdById = (id: string) => {
    const target = getNodeById(id);
    return getNodeParentId(target);
  };

  const getNodePathById = (id: string) => {
    const target = getNodeById(id);
    return getNodePath(target);
  };

  const setTreeNodeLoading = (node: TreeNode, value: boolean) => {
    setNodeAttr(node, NODE_ATTRIBUTES.IS_LOADING, value);
  };

  // const deleteNodeSchema = (id: string) => (flatData.schema as Map<string, any>).delete(id);

  /**
   * 判定指定节点是否为展开状态
   * @param item 节点或者节点 UUID
   * @returns
   */
  const isItemOpen = (item: TreeNode): boolean => {
    if (typeof item === 'object' && item !== null) {
      return isNodeOpened(item);
    }

    if (typeof item === 'string') {
      return !!getNodeAttrById(item, NODE_ATTRIBUTES.IS_OPEN);
    }

    return false;
  };

  const getParentNodeAttr = (node: TreeNode, attrName: string) => {
    return getNodeAttr(getNodeAttr(node, NODE_ATTRIBUTES.PARENT), attrName);
  };

  const isParentNodeOpened = (node: TreeNode): boolean =>
    isItemOpen(getNodeAttr(node, NODE_ATTRIBUTES.PARENT) as TreeNode);

  /**
   * 过滤当前状态为Open的节点
   * 页面展示只会展示Open的节点
   * @param item
   * @returns
   */
  const checkNodeIsOpen = (node: TreeNode): boolean =>
    isRootNode(node) || isItemOpen(node) || isParentNodeOpened(node);

  /**
   * 根据节点path返回源数据中节点信息
   * @param path
   * @returns
   */
  const getSourceNodeByPath = (path: string, uid?: string) => {
    const paths = path.split('-');

    const target = paths.reduce((pre, nodeIndex: string) => {
      const index = Number(nodeIndex);
      return Array.isArray(pre) ? pre[index] : pre[props.children][index];
    }, props.data);

    if (uid) {
      Object.assign(target, { [NODE_ATTRIBUTES.UUID]: uid });
    }

    return target;
  };

  const getChildNodes = (node: TreeNode) => {
    const schemaNode = resolveSchemaNode(node) ?? (toRaw(node) as TreeNode);
    const mapped = flatData.childMap?.get(schemaNode) ?? flatData.childMap?.get(node);
    if (mapped) {
      return mapped;
    }
    // 禁止回退 flatData.data.filter（百万节点 O(N)）；直接读源数据 children
    const childKey = props?.children || 'children';
    return ((schemaNode?.[childKey] as TreeNode[]) || (node?.[childKey] as TreeNode[]) || []);
  };

  const getSourceNodeByUID = (uid: string) => getNodeById(uid);

  const getParentNodeData = (node: TreeNode | string) => {
    let target = node;
    if (typeof target === 'string') {
      target = getSourceNodeByUID(target);
    }
    if (isRootNode(target)) {
      return { [props.children]: props.data };
    }

    return getParentNode(target);
  };

  /**
   * 处理scoped slot 透传数据
   * @param item 当前节点数据
   * @returns
   */
  const resolveScopedSlotParam = (item: TreeNode) => ({
    [NODE_SOURCE_ATTRS[NODE_ATTRIBUTES.IS_LOADING]]: getNodeAttr(item, NODE_ATTRIBUTES.IS_LOADING),
    [NODE_SOURCE_ATTRS[NODE_ATTRIBUTES.HAS_CHILD]]: hasChildNode(item),
    [NODE_SOURCE_ATTRS[NODE_ATTRIBUTES.IS_MATCH]]: isNodeMatched(item),
    [NODE_SOURCE_ATTRS[NODE_ATTRIBUTES.IS_CHECKED]]: isNodeChecked(item),
    [NODE_SOURCE_ATTRS[NODE_ATTRIBUTES.IS_OPEN]]: isNodeOpened(item),
    [NODE_SOURCE_ATTRS[NODE_ATTRIBUTES.IS_ROOT]]: isRootNode(item),
    fullPath: getNodeAttr(item, NODE_ATTRIBUTES.PATH),
    uuid: getNodeId(item),
    parent: getNodeAttr(item, NODE_ATTRIBUTES.PARENT),
    parentId: getNodeId(getNodeAttr(item, NODE_ATTRIBUTES.PARENT)),
  });

  const extendNodeAttr = (item: TreeNode) =>
    markRaw(
      Object.assign({}, toRaw(item) as TreeNode, {
        [NODE_ATTRIBUTES.TREE_NODE_ATTR]: resolveScopedSlotParam(item),
      }),
    );

  /**
   * 插槽参数：data 使用 toRaw，避免深层 Proxy；整体 markRaw，降低自定义渲染时的响应式开销。
   * 注意：data 仍持有原 children 引用，业务侧勿对整棵 data 做 JSON.stringify。
   */
  const extendNodeScopedData = (item: TreeNode) =>
    markRaw({
      data: toRaw(item) as TreeNode,
      attributes: resolveScopedSlotParam(item),
    });

  /**
   * 组装进入可视区域元素返回数据
   * @param target
   * @returns
   */
  const getIntersectionResponse = (target: HTMLElement | TreeNode) => {
    if (!target) {
      return null;
    }

    let node = target;
    if (isElement(target)) {
      node = getNodeById((target as HTMLElement).getAttribute('data-tree-node'));
    }

    const level = getNodeAttr(node as TreeNode, NODE_ATTRIBUTES.DEPTH);
    const isRoot = getNodeAttr(node as TreeNode, NODE_ATTRIBUTES.IS_ROOT);
    const parent = getNodeAttr(node as TreeNode, NODE_ATTRIBUTES.PARENT);
    const children = parent?.[props.children] as TreeNode[] | undefined;
    const index = isRoot
      ? getNodeAttr(node as TreeNode, NODE_ATTRIBUTES.INDEX)
      : children?.findIndex(child => child === node);
    return { level, target, index, parent, node, isRoot };
  };

  const getRootNodeList = () => flatData.rootNodes ?? flatData.data.filter(item => isRootNode(item));

  return {
    getSchemaVal,
    getNodeAttr,
    getNodeId,
    getNodeById,
    getNodeParentId,
    getParentNodeData,
    getNodePathById,
    getNodeAttrById,
    getNodeParentIdById,
    getNodeIndexById,
    getNodeIndexByNode,
    getRootNodeList,
    getParentNodeAttr,
    getParentNode,
    setNodeAttr,
    setNodeAttrById,
    getNodePath,
    isRootNode,
    isNodeOpened,
    hasChildNode,
    isItemOpen,
    isNodeChecked,
    isNodeMatched,
    isNodeLoading,
    checkNodeIsOpen,
    getSourceNodeByPath,
    getSourceNodeByUID,
    isMatchedNode,
    resolveScopedSlotParam,
    setTreeNodeLoading,
    extendNodeAttr,
    getChildNodes,
    extendNodeScopedData,
    getIntersectionResponse,
  };
};
