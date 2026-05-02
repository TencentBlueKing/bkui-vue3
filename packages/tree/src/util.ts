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

import { usePrefix } from '@bkui-vue/config-provider';

import { NODE_ATTRIBUTES } from './constant';
import { TreeDataChangePayload, TreeNode, TreePropTypes } from './props';

const DEFAULT_LEVLE_LINE = '1px dashed #c3cdd7';
export type TreeNodeKey = number | string;
export type IFlatData = {
  data: TreeNode[];
  schema: WeakMap<TreeNode, Record<string, unknown>>;
  nodeMap?: Map<TreeNodeKey, TreeNode>;
  childMap?: WeakMap<TreeNode, TreeNode[]>;
  rootNodes?: TreeNode[];
};

/**
 * 获取配置项可为Bool|String|Function类型，如果为Bool则配置默认值
 * @param props
 * @param key
 * @param item
 * @param defaultTrueValue
 * @param defaultFalseValue
 * @returns
 */
const getPropsOneOfBoolValueWithDefault = (
  props: TreePropTypes,
  key: string,
  item: TreeNode = null,
  defaultTrueValue: unknown = null,
  defaultFalseValue: unknown = null,
  args: Array<unknown> = [],
) => {
  const prop = props[key];
  if (typeof prop === 'boolean') {
    return prop ? defaultTrueValue : defaultFalseValue;
  }

  return getStringOrFuncStr(item, props, key, args);
};

/**
 * 处理Props中用户给定的配置项（返回值为String或者Function）
 * @param item 当前渲染数据（当item为Object时，返回当前Object中通过Props指定Key的Value，否则返回Props中指定的值）
 * @param props Props
 * @param key 配置项关键字
 * @param args 其他参数
 * @returns
 */
const getStringOrFuncStr = (item: TreeNode, props: TreePropTypes, key: string, args = []) => {
  const value = props[key];
  if (typeof value === 'string') {
    if (typeof item === 'object' && item !== null) {
      if (!Object.prototype.hasOwnProperty.call(item, value)) {
        console.error(`cannot find node label with key ${value}`);
      }
      return item[value];
    }

    return value;
  }

  if (typeof value === 'function') {
    const txt = value.apply(this, [item, ...args]);
    if (typeof txt === 'string') {
      return txt;
    }
    console.error('props label with function return value is not string, please check and return string');
    return undefined;
  }

  return undefined;
};

/**
 * 获取当前节点显示Label
 * @param item 当前节点
 * @param props Props
 */
export const getLabel = (item: TreeNode, props: TreePropTypes) => getStringOrFuncStr(item, props, 'label');

/**
 * 根据Props获取Tree样式设置
 * @param item
 * @param props
 * @returns
 */
export const getTreeStyle = (item: TreeNode, props: TreePropTypes) => {
  // 处理Props回调函数，参数 [tree] 表示 levelLine 回调参数第二个，此次渲染请求为Tree外层样式
  const levelLine = getPropsOneOfBoolValueWithDefault(props, 'levelLine', item, DEFAULT_LEVLE_LINE, null, ['tree']);
  return {
    '--level-line': levelLine,
    '--lineHeight': `${props.lineHeight}px`,
    '--indent': `${props.indent}px`,
    '--offset-left': `${props.offsetLeft}px`,
  };
};

/**
 * 获取节点样式配置
 * @param item
 * @param props
 * @returns
 */
export const getNodeItemStyle = (item: TreeNode, props: TreePropTypes, flatData: IFlatData, showTree = true) => {
  const { schema } = flatData;
  const depth = schema.get(item)?.[NODE_ATTRIBUTES.DEPTH];
  if (showTree) {
    const args = ['node'];
    const levelLine = () => getPropsOneOfBoolValueWithDefault(props, 'levelLine', item, DEFAULT_LEVLE_LINE, null, args);
    return {
      '--depth': depth,
      ...(typeof props.levelLine === 'function' ? { '--level-line': levelLine() } : {}),
    };
  }

  return {};
};

/**
 * 获取当前渲染节点Class List
 * @param item
 * @returns
 */
export const getNodeItemClass = (
  item: TreeNode,
  schema: WeakMap<TreeNode, Record<string, unknown>>,
  props: TreePropTypes,
  showTree = true,
) => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { __is_root, __is_open } = schema.get(item) || {};
  const { resolveClassName } = usePrefix();
  return {
    'is-root': __is_root,
    [`${resolveClassName('tree-node')}`]: true,
    'is-open': __is_open,
    'is-virtual-render': props.virtualRender,
    'level-line': props.levelLine && showTree,
  };
};

/**
 * 获取当前渲染节点Class List
 * @param item
 * @returns
 */
export const getNodeRowClass = (item: TreeNode, schema: WeakMap<TreeNode, Record<string, unknown>>) => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { __is_checked, __is_indeterminate, __is_selected } = schema.get(item) || {};
  const { resolveClassName } = usePrefix();
  return {
    'is-checked': __is_checked,
    'is-indeterminate': __is_indeterminate,
    'is-selected': __is_selected,
    'node-folder': item.is_folder,
    'node-leaf': item.is_leaf,
    [`${resolveClassName('node-row')}`]: true,
  };
};

/**
 * 根据路径更新指定节点Child-Data
 * @param path 节点路径
 * @param treeData Tree Data
 * @param childKey Child Key
 * @param nodekey 节点key
 * @param nodeValue 节点值
 */
export const updateTreeNode = (
  path: string,
  treeData: TreeNode[],
  childKey: string,
  nodekey: string,
  nodeValue: Record<string, unknown>[],
) => {
  assignTreeNode(path, treeData, childKey, { [nodekey]: nodeValue });
};

const cloneTreeNode = (node: TreeNode): TreeNode => {
  if (Array.isArray(node)) {
    return node.map(item => cloneTreeNode(item)) as unknown as TreeNode;
  }

  if (node && typeof node === 'object') {
    return Object.keys(node).reduce<TreeNode>((acc, key) => {
      const value = node[key];
      acc[key] = Array.isArray(value) ? value.slice() : value;
      return acc;
    }, {});
  }

  return node;
};

export const cloneTreeData = (treeData: TreeNode[] = [], childKey = 'children'): TreeNode[] =>
  (treeData || []).map(node => {
    const clonedNode = cloneTreeNode(node);
    if (Array.isArray(node?.[childKey])) {
      clonedNode[childKey] = cloneTreeData(node[childKey] as TreeNode[], childKey);
    }
    return clonedNode;
  });

export const isSameNodeId = (left: unknown, right: unknown) => {
  if (left === right) {
    return true;
  }

  if (left === undefined || left === null || right === undefined || right === null) {
    return false;
  }

  return `${left}` === `${right}`;
};

export const findNodeById = (
  treeData: TreeNode[] = [],
  nodeId: number | string,
  nodeKey: string,
  childKey: string,
): TreeNode | null => {
  for (const node of treeData) {
    if (isSameNodeId(node?.[nodeKey], nodeId)) {
      return node;
    }

    const children = node?.[childKey] as TreeNode[];
    if (Array.isArray(children) && children.length) {
      const target = findNodeById(children, nodeId, nodeKey, childKey);
      if (target) {
        return target;
      }
    }
  }

  return null;
};

export const mutateTreeById = (
  treeData: TreeNode[] = [],
  nodeId: number | string,
  nodeKey: string,
  childKey: string,
  updater: (node: TreeNode) => void,
) => {
  const target = findNodeById(treeData, nodeId, nodeKey, childKey);
  if (target) {
    updater(target);
  }
  return treeData;
};

export const removeTreeNodeById = (
  treeData: TreeNode[] = [],
  nodeId: number | string,
  nodeKey: string,
  childKey: string,
): { node: TreeNode | null; data: TreeNode[]; parentNode: TreeNode | null; index: number } => {
  const loop = (
    list: TreeNode[],
    parentNode: TreeNode | null,
  ): { node: TreeNode | null; parentNode: TreeNode | null; index: number } => {
    for (let index = 0; index < list.length; index++) {
      const current = list[index];
      if (isSameNodeId(current?.[nodeKey], nodeId)) {
        const [node] = list.splice(index, 1);
        return { node, parentNode, index };
      }

      const children = current?.[childKey] as TreeNode[];
      if (Array.isArray(children) && children.length) {
        const result = loop(children, current);
        if (result.node) {
          return result;
        }
      }
    }

    return { node: null, parentNode: null, index: -1 };
  };

  const result = loop(treeData, null);
  return { ...result, data: treeData };
};

export const insertTreeNodeById = (
  treeData: TreeNode[] = [],
  node: TreeNode,
  targetNodeId: number | string,
  nodeKey: string,
  childKey: string,
  options: { dropType: 'child' | 'move' | 'sort'; willInsertAfter?: boolean },
): { data: TreeNode[]; parentNode: TreeNode | null; targetNode: TreeNode | null; index: number } => {
  const { dropType, willInsertAfter = true } = options;

  if (dropType === 'child') {
    const targetNode = findNodeById(treeData, targetNodeId, nodeKey, childKey);
    if (!targetNode) {
      return { data: treeData, parentNode: null, targetNode: null, index: -1 };
    }

    if (!Array.isArray(targetNode[childKey])) {
      targetNode[childKey] = [];
    }

    const targetChildren = targetNode[childKey] as TreeNode[];
    targetChildren.push(node);
    return { data: treeData, parentNode: targetNode, targetNode, index: targetChildren.length - 1 };
  }

  const loop = (
    list: TreeNode[],
    parentNode: TreeNode | null,
  ): { parentNode: TreeNode | null; targetNode: TreeNode | null; index: number } => {
    for (let index = 0; index < list.length; index++) {
      const current = list[index];
      if (isSameNodeId(current?.[nodeKey], targetNodeId)) {
        const insertIndex = willInsertAfter ? index + 1 : index;
        list.splice(insertIndex, 0, node);
        return { parentNode, targetNode: current, index: insertIndex };
      }

      const children = current?.[childKey] as TreeNode[];
      if (Array.isArray(children) && children.length) {
        const result = loop(children, current);
        if (result.targetNode) {
          return result;
        }
      }
    }

    return { parentNode: null, targetNode: null, index: -1 };
  };

  const result = loop(treeData, null);
  return { data: treeData, ...result };
};

export const moveTreeNodeById = (
  treeData: TreeNode[] = [],
  nodeId: number | string,
  targetNodeId: number | string,
  nodeKey: string,
  childKey: string,
  options: { dropType: 'child' | 'move' | 'sort'; willInsertAfter?: boolean },
): TreeDataChangePayload | null => {
  const nextTreeData = cloneTreeData(treeData, childKey);
  const removeResult = removeTreeNodeById(nextTreeData, nodeId, nodeKey, childKey);
  if (!removeResult.node) {
    return null;
  }

  const insertResult = insertTreeNodeById(nextTreeData, removeResult.node, targetNodeId, nodeKey, childKey, options);
  if (!insertResult.targetNode) {
    return null;
  }

  return {
    trigger: 'drag',
    data: nextTreeData,
    node: removeResult.node,
    targetNode: insertResult.targetNode,
    parentNode: insertResult.parentNode,
    oldParentNode: removeResult.parentNode,
    dropType: options.dropType,
    sourceIndex: removeResult.index,
    targetIndex: insertResult.index,
  };
};

/**
 * 根据路径更新指定节点Child-Data
 * @param path 节点路径
 * @param treeData Tree Data
 * @param childKey Child Key
 * @param assignVal value
 */
export const assignTreeNode = (
  path: string,
  treeData: TreeNode[],
  childKey: string,
  assignVal: Record<string, unknown>,
) => {
  const paths = path.split('-');
  const targetNode = paths.reduce((pre: TreeNode | TreeNode[], nodeIndex: string) => {
    const index = Number(nodeIndex);
    return Array.isArray(pre) ? pre[index] : pre[childKey][index];
  }, treeData);

  Object.assign(targetNode, assignVal || {});
};

export const resolveNodeItem = (node: TreeNode) => {
  if (node === undefined || node === null) {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return { __IS_NULL: true } as TreeNode;
  }

  return node;
};

export const resolvePropIsMatched = (node, prop, id) => {
  if (Array.isArray(prop)) {
    return prop.some(item => resolvePropIsMatched(node, item, id));
  }

  if (typeof prop === 'string' || typeof prop === 'number') {
    return isSameNodeId(prop, id);
  }

  return node === prop;
};

export const showCheckbox = (props: TreePropTypes, node?: TreeNode) => {
  if (typeof props.showCheckbox === 'function') {
    return props.showCheckbox(node);
  }

  return props.showCheckbox;
};

export const isCascadeEnabled = (props: TreePropTypes): boolean => {
  if (typeof props.cascade === 'boolean') {
    return props.cascade;
  }
  return !!props.checkStrictly;
};
